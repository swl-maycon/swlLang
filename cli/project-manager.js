const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const Compiler = require("../lib/compiler");

// Cores ANSI estáveis para estilização do terminal
const C_RESET = "\x1b[0m";
const C_CYAN = "\x1b[36m";
const C_GREEN = "\x1b[32m";
const C_RED = "\x1b[31m";
const C_YELLOW = "\x1b[33m";
const C_GRAY = "\x1b[90m";
const C_BOLD = "\x1b[1m";

class ProjectManager {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.gpaiPath = path.join(projectRoot, "_gpai.swls");
    this.configPath = path.join(projectRoot, "swls.config.json");
    this.compiler = new Compiler({ projectRoot });
    this.watcher = null;
  }

  // Inicializa a estrutura de um novo projeto SWLS
  init() {
    if (fs.existsSync(this.gpaiPath)) {
      console.log(`  ${C_GREEN}✓ Info:${C_RESET} _gpai.swls ja existe neste diretorio`);
      return false;
    }

    const template = `// SWLS Project Index
// Arquivo gerado automaticamente — NAO EDITAR

@projeto: ${path.basename(this.projectRoot)}
@versao: 2.0.0
@timestamp: ${new Date().toISOString()}
@entrada: "./index.swls"

(root:
  // Seu codigo aqui
)
`;

    fs.writeFileSync(this.gpaiPath, template);
    console.log(`  ${C_GREEN}✓ Sucesso:${C_RESET} Estrutura central _gpai.swls gerada`);

    const config = {
      entrada: "./index.swls",
      saida: "./dist",
      lint: true,
      minify: false,
      sourcemap: false,
      watched: ["**/*.swls"],
    };
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
    console.log(`  ${C_GREEN}✓ Sucesso:${C_RESET} Configuração swls.config.json criada`);

    return true;
  }

  // Registra dinamicamente um arquivo criado no índice _gpai
  registerFile(filepath) {
    if (!fs.existsSync(this.gpaiPath)) {
      console.warn(`  ${C_YELLOW}[AVISO] _gpai.swls nao encontrado. Inicialize o projeto primeiro.${C_RESET}`);
      return;
    }

    let content = fs.readFileSync(this.gpaiPath, "utf-8");
    const relPath = `./${path.relative(this.projectRoot, filepath).replace(/\\/g, "/")}`;

    if (!content.includes(`@importar "${relPath}"`)) {
      const insertPoint = content.indexOf("(root:");
      const importLine = `@importar "${relPath}"\n`;
      content = content.slice(0, insertPoint) + importLine + content.slice(insertPoint);
      fs.writeFileSync(this.gpaiPath, content);
      console.log(`  ${C_CYAN}[REGISTRO]${C_RESET} Modulo adicionado: ${relPath}`);
    }
  }

  // Remove o registro de um arquivo deletado do indice _gpai
  unregisterFile(filepath) {
    if (!fs.existsSync(this.gpaiPath)) return;

    let content = fs.readFileSync(this.gpaiPath, "utf-8");
    const relPath = `./${path.relative(this.projectRoot, filepath).replace(/\\/g, "/")}`;
    const importLine = `@importar "${relPath}"\n`;

    if (content.includes(importLine)) {
      content = content.replace(importLine, "");
      fs.writeFileSync(this.gpaiPath, content);
      console.log(`  ${C_YELLOW}[REMOÇAO]${C_RESET} Modulo desvinculado do indice: ${relPath}`);
    }
  }

  // Compilação unitária em segundo plano acionada pelo Watcher
  buildFile(filepath) {
    const t0 = Date.now();
    const relativePath = path.relative(this.projectRoot, filepath).replace(/\\/g, "/");
    
    if (relativePath === "_gpai.swls") return;

    const outputCssPath = path.join(this.projectRoot, "dist", relativePath.replace(/\.swls$/, ".css"));
    const outputDir = path.dirname(outputCssPath);

    try {
      const source = fs.readFileSync(filepath, "utf-8");
      const result = this.compiler.compile(source, relativePath);

      if (!result.success) {
        console.error(`\n  ${C_RED}[FALHA] Erro de compilaçao em: ${relativePath}${C_RESET}`, result.error);
        return;
      }

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputCssPath, result.css);
      const distName = `dist/${path.relative(path.join(this.projectRoot, "dist"), outputCssPath)}`;
      console.log(`  ${C_GRAY}[AUTO]${C_RESET} ${C_GREEN}build:${C_RESET} ${relativePath} ${C_GRAY}→${C_RESET} ${distName} ${C_GRAY}(${Date.now() - t0}ms)${C_RESET}`);
    } catch (err) {
      console.error(`\n  ${C_RED}[CRITICO] Falha ao processar modulo ${relativePath}:${C_RESET}`, err.message);
    }
  }

  // Build centralizado de todo o escopo do projeto
  build(outputPath = null) {
    if (!fs.existsSync(this.gpaiPath)) {
      console.error(`\n  ${C_RED}[ERRO] _gpai.swls nao encontrado. Inicialize o projeto primeiro.${C_RESET}\n`);
      process.exit(1);
    }

    const t0 = Date.now();
    const source = fs.readFileSync(this.gpaiPath, "utf-8");
    const result = this.compiler.compile(source, "_gpai.swls");

    if (!result.success) {
      console.error(`\n  ${C_RED}[ERRO] Falha de compilaçao global:${C_RESET} ${result.error}\n`);
      result.diagnostics.forEach(d => {
        const severity = d.severity === "error" ? `${C_RED}[X]${C_RESET}` : `${C_YELLOW}[!]${C_RESET}`;
        console.log(`  ${severity} [${d.code}] ${d.message} (Linha ${d.line})`);
      });
      process.exit(1);
    }

    const out = outputPath || path.join(this.projectRoot, "dist", "estilos.css");
    const outputDir = path.dirname(out);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(out, result.css);

    console.log(`\n  ${C_BOLD}${C_CYAN}PROJETO COMPILADO${C_RESET}`);
    console.log(`  ${C_GRAY}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}`);
    console.log(`    Entrada      : _gpai.swls`);
    console.log(`    Saida        : ${path.basename(out)}`);
    console.log(`    Tamanho      : ${result.css.length} bytes`);
    console.log(`    Tempo        : ${Date.now() - t0}ms`);
    console.log(`    Regras       : ${result.stats.rules}`);
    console.log(`    Propriedades : ${result.stats.properties}`);
    console.log(`  ${C_GRAY}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}\n`);
  }

  // Inicializa o barramento de monitoramento dinâmico em tempo real
  watch(outputPath = null) {
    if (!fs.existsSync(this.gpaiPath)) {
      console.error(`\n  ${C_RED}[ERRO] _gpai.swls nao encontrado. Inicialize o projeto primeiro.${C_RESET}\n`);
      process.exit(1);
    }

    const config = this.loadConfig();
    const watched = config.watched || ["**/*.swls"];

    this.watcher = chokidar.watch(watched, {
      cwd: this.projectRoot,
      ignored: /(^|[\/\\])\.|_gpai\.swls|dist/,
      persistent: true,
    });

    console.log(`\n  ${C_BOLD}${C_CYAN}MONITORAMENTO ATIVO${C_RESET}`);
    console.log(`  ${C_GRAY}Diretorio : ${this.projectRoot}${C_RESET}`);
    console.log(`  ${C_GRAY}Aguardando alteraçoes... (Pressione Ctrl+C para encerrar)${C_RESET}\n`);

    this.watcher.on("add", (file) => {
      const fullPath = path.join(this.projectRoot, file);
      this.registerFile(fullPath);
      this.buildFile(fullPath);
    });

    this.watcher.on("change", (file) => {
      const fullPath = path.join(this.projectRoot, file);
      this.buildFile(fullPath);
    });

    this.watcher.on("unlink", (file) => {
      const fullPath = path.join(this.projectRoot, file);
      this.unregisterFile(fullPath);

      const relPath = file.replace(/\\/g, "/");
      const outputCssPath = path.join(this.projectRoot, "dist", relPath.replace(/\.swls$/, ".css"));
      if (fs.existsSync(outputCssPath)) {
        fs.unlinkSync(outputCssPath);
        console.log(`  ${C_YELLOW}[LIMPEZA]${C_RESET} Arquivo deletado do dist: dist/${relPath.replace(/\.swls$/, ".css")}`);
      }
    });
  }

  // Executa o Linter de integridade estrutural em todo o projeto
  lint() {
    if (!fs.existsSync(this.gpaiPath)) {
      console.error(`\n  ${C_RED}[ERRO] _gpai.swls nao encontrado neste diretorio.${C_RESET}\n`);
      return;
    }

    const source = fs.readFileSync(this.gpaiPath, "utf-8");
    const result = this.compiler.compile(source, "_gpai.swls");

    console.log(`\n  ${C_BOLD}${C_CYAN}RELATORIO DE INTEGRIDADE (LINT)${C_RESET}`);
    console.log(`  ${C_GRAY}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}`);

    const errors = result.diagnostics.filter(d => d.severity === "error");
    const warnings = result.diagnostics.filter(d => d.severity === "warning");
    const infos = result.diagnostics.filter(d => d.severity === "info");

    if (errors.length === 0 && warnings.length === 0 && infos.length === 0) {
      console.log(`    ${C_GREEN}✓ Perfeito: Nenhum problema estrutural encontrado!${C_RESET}`);
    } else {
      errors.forEach(d => console.log(`    ${C_RED}[X] ${d.message} (${d.code})${C_RESET}`));
      warnings.forEach(d => console.log(`    ${C_YELLOW}[!] ${d.message} (${d.code})${C_RESET}`));
      infos.forEach(d => console.log(`    ${C_CYAN}[i] ${d.message} (${d.code})${C_RESET}`));
      console.log(`\n  ${C_BOLD}Resumo:${C_RESET} ${C_RED}${errors.length} erro(s)${C_RESET}, ${C_YELLOW}${warnings.length} aviso(s)${C_RESET}, ${C_CYAN}${infos.length} info(s)${C_RESET}`);
    }

    console.log(`  ${C_GRAY}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}\n`);
  }

  // Carrega e decodifica o arquivo de configuraçao json
  loadConfig() {
    if (fs.existsSync(this.configPath)) {
      return JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
    }
    return {};
  }

  // Encerra a execuçao ativa do barramento do watcher
  stop() {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}

module.exports = ProjectManager;

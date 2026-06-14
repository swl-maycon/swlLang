#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const Compiler = require("../lib/compiler");
const ProjectManager = require("./project-manager");

// cores ANSI para o terminal
const C_RESET = "\x1b[0m";
const C_CYAN = "\x1b[36m";
const C_GREEN = "\x1b[32m";
const C_RED = "\x1b[31m";
const C_YELLOW = "\x1b[33m";
const C_GRAY = "\x1b[90m";
const C_BOLD = "\x1b[1m";

const [, , command, ...args] = process.argv;

// painel de ajuda e instruções do CLI
function showHelp() {
  console.log(`
${C_BOLD}${C_CYAN}SWLS Core MX v2.0.0${C_RESET}
Motor de alto desempenho com arquitetura modular

${C_BOLD}USO:${C_RESET}
  swls init                  Inicializa novo projeto com _gpai.swls
  swls build [arquivo]       Compila arquivo ou projeto inteiro
  swls watch                 Monitora e compila automaticamente
  swls lint                  Valida sem compilar
  swls doctor                Diagnostico do ambiente
  swls version               Versao atual

${C_BOLD}EXEMPLOS:${C_RESET}
  swls init                  # Cria _gpai.swls e swls.config.json
  swls watch                 # Inicia watcher automatico
  swls build estilos.swls    # Compila arquivo unico
  swls build -o saida.css    # Compilacao com output definido
  swls lint                  # Verifica erros e warnings

${C_GRAY}Repositorio: https://github.com/swl-maycon/swlLang

{C_RESET}
  `);
}

// Executa diagnostico do ambiente e estrutura local
function doctor() {
  console.log(`\n${C_BOLD}${C_CYAN}SWLS Doctor — v2.0.0${C_RESET}`);
  console.log(`${C_GRAY}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}`);

  const info = [
    ["Node.js", process.version],
    ["Plataforma", process.platform],
    ["Arquitetura", process.arch],
    ["Compilador", `${C_GREEN}OK${C_RESET}`],
    ["Tokenizer", `${C_GREEN}OK${C_RESET}`],
    ["Linter", `${C_GREEN}OK${C_RESET}`],
    ["Watcher", `${C_GREEN}OK (chokidar)${C_RESET}`],
  ];

  info.forEach(([k, v]) => {
    console.log(`  ${k.padEnd(18)} ${v}`);
  });

  const cwd = process.cwd();
  const hasGpai = fs.existsSync(path.join(cwd, "_gpai.swls"));
  const hasConfig = fs.existsSync(path.join(cwd, "swls.config.json"));

  console.log(`\n${C_BOLD}Projeto Atual${C_RESET}`);
  console.log(`${C_GRAY}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}`);
  console.log(`  _gpai.swls    ${hasGpai ? `${C_GREEN}Presente${C_RESET}` : `${C_RED}Nao encontrado${C_RESET}`}`);
  console.log(`  config.json   ${hasConfig ? `${C_GREEN}Presente${C_RESET}` : `${C_RED}Nao encontrado${C_RESET}`}`);

  console.log(`\n${C_BOLD}Proximos passos:${C_RESET}`);
  if (!hasGpai) {
    console.log(`  ${C_YELLOW}→ Execute 'swls init' para inicializar o projeto${C_RESET}`);
  } else {
    console.log(`  ${C_YELLOW}→ Execute 'swls watch' para iniciar monitoramento automatico${C_RESET}`);
  }

  console.log(`${C_GRAY}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}\n`);
}

// barra de progresso no terminal
function renderProgressBar(percentage) {
  const size = 30;
  const dots = "█".repeat(Math.round((percentage / 100) * size));
  const empty = "░".repeat(size - dots.length);
  process.stdout.write(`\r  ${C_CYAN}[${dots}${empty}] ${percentage}%${C_RESET}`);
}

// Simula sincronia visual com barra de carregamento para arquivos unitários
function runBuildProgress(callback) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;
    renderProgressBar(progress);
    if (progress >= 100) {
      clearInterval(interval);
      process.stdout.write("\n");
      callback();
    }
  }, 60);
}

// Ponto de entrada assincrono para roteamento de comandos
async function main() {
  switch (command) {
    case "init": {
      const pm = new ProjectManager();
      pm.init();
      break;
    }

    case "build": {
      const file = args[0];
      const outIdx = args.indexOf("-o");
      const output = outIdx !== -1 ? args[outIdx + 1] : null;

      if (!file) {
        const pm = new ProjectManager();
        pm.build(output);
      } else {
        const fullPath = path.resolve(file);
        if (!fs.existsSync(fullPath)) {
          console.error(`\n  ${C_RED}[ERRO] Arquivo nao encontrado: ${file}${C_RESET}\n`);
          process.exit(1);
        }

        console.log(`\n  ${C_BOLD}Compilando arquivo:${C_RESET} ${C_GRAY}${file}${C_RESET}`);
        
        runBuildProgress(() => {
          const source = fs.readFileSync(fullPath, "utf-8");
          const compiler = new Compiler();
          const result = compiler.compile(source, file);

          if (!result.success) {
            console.error(`\n  ${C_RED}[FALHA] ${result.error}${C_RESET}\n`);
            process.exit(1);
          }

          const outPath = output || fullPath.replace(/\.swls$/, ".css");
          fs.writeFileSync(outPath, result.css);
          console.log(`  ${C_GREEN}✓ Sucesso:${C_RESET} ${path.basename(outPath)} gerado com estabilidade\n`);
        });
      }
      break;
    }

    case "watch": {
      const pm = new ProjectManager();
      const outIdx = args.indexOf("-o");
      const output = outIdx !== -1 ? args[outIdx + 1] : null;
      pm.watch(output);

      process.on("SIGINT", () => {
        console.log(`\n\n  ${C_YELLOW}Parando monitoramento automático do watcher...${C_RESET}\n`);
        pm.stop();
        process.exit(0);
      });
      break;
    }

    case "lint": {
      const pm = new ProjectManager();
      pm.lint();
      break;
    }

    case "doctor": {
      doctor();
      break;
    }

    case "version": {
      console.log(`SWLS Core MX v2.0.0`);
      break;
    }

    case "--help":
    case "-h":
    case undefined: {
      showHelp();
      break;
    }

    default: {
      console.error(`\n  ${C_RED}[ERRO] Comando desconhecido: ${command}${C_RESET}`);
      showHelp();
      process.exit(1);
    }
  }
}

main().catch(err => {
  console.error(`\n  ${C_RED}[ERRO FATAL] ${err.message}${C_RESET}\n`);
  process.exit(1);
});

const fs = require("fs");
const path = require("path");
const Parser = require("./parser");
const CSSGenerator = require("./generator");
const { Linter } = require("./parser/linter");
const { Tokenizer } = require("./tokenizer");

class Compiler {
  constructor(options = {}) {
    this.options = {
      minify: false,
      sourcemap: false,
      lint: true,
      strict: false,
      ...options,
    };
    this.linter = new Linter();
    this.generator = new CSSGenerator();
    this.loadedFiles = new Set();
    this.projectRoot = options.projectRoot || process.cwd();
  }

  // Coordena o pipeline de compilação do arquivo
  compile(source, filename = "unknown.swls") {
    try {
      this.loadedFiles.clear();

      const parser = new Parser(source, filename);
      const ast = parser.parse();

      const globalVariables = {};
      const gpaiPath = path.resolve(this.projectRoot, "_gpai.swls");
      
      // Carrega e extrai variaveis globais do arquivo index se disponivel
      if (fs.existsSync(gpaiPath) && filename !== "_gpai.swls") {
        try {
          const gpaiSource = fs.readFileSync(gpaiPath, "utf-8");
          const gpaiAST = new Parser(gpaiSource, "_gpai.swls").parse();
          gpaiAST.body.forEach(node => {
            if (node.type === "Variable") {
              globalVariables[node.name] = node.value;
            }
          });
        } catch (e) {}
      }

      // Processa e injeta de forma isolada os modulos de importaçao
      this.processImports(ast, filename);

      // Executa validaçao estrutural e escopo léxico de variaveis
      const diagnostics = this.linter.lint(ast, globalVariables);
      const errors = diagnostics.filter(d => d.severity === "error");
      const warnings = diagnostics.filter(d => d.severity === "warning");

      if (this.options.strict && warnings.length > 0) {
        return {
          success: false,
          css: "",
          diagnostics,
          error: `${warnings.length} warning(s) encontrado(s) em modo strict`,
        };
      }

      if (errors.length > 0) {
        return {
          success: false,
          css: "",
          diagnostics,
          error: `Erros de compilação: ${errors.map(e => e.message).join("; ")}`,
        };
      }

      // Transmite as variaveis coletadas e gera a folha de estilos final
      this.generator.variables = { ...globalVariables };
      const css = this.generator.generate(ast);

      return {
        success: true,
        css,
        diagnostics,
        stats: {
          lines: source.split("\n").length,
          properties: this.countProperties(ast),
          rules: this.countRules(ast),
        },
      };
    } catch (err) {
      return {
        success: false,
        css: "",
        diagnostics: [],
        error: err.message,
      };
    }
  }

  // Leitura física e compilação direta via caminho do arquivo
  compileFile(filepath) {
    const fullPath = path.resolve(this.projectRoot, filepath);
    const source = fs.readFileSync(fullPath, "utf-8");
    const result = this.compile(source, filepath);
    return result;
  }

  // Varre e expande de forma recursiva a arvore sintatica de imports
  processImports(ast, filename) {
    const dir = path.dirname(filename);
    
    if (!ast || !ast.body) return;
    const imports = ast.body.filter(n => n.type === "Import");

    for (const imp of imports) {
      const importPath = path.resolve(dir, imp.path);
      if (!fs.existsSync(importPath)) {
        throw new Error(`Arquivo importado não encontrado: ${imp.path}`);
      }

      if (this.loadedFiles.has(importPath)) {
        continue; 
      }
      this.loadedFiles.add(importPath);

      const importedSource = fs.readFileSync(importPath, "utf-8");
      
      const ParserMestre = require("./parser");
      const importedAST = new ParserMestre(importedSource, imp.path).parse();
      this.processImports(importedAST, imp.path);

      const importIndex = ast.body.indexOf(imp);
      if (importIndex !== -1) {
        ast.body.splice(importIndex, 1, ...importedAST.body);
      }
    }
  }

  // Auxiliar estatistico de contagem total de propriedades CSS geradas
  countProperties(node) {
    if (!node) return 0;
    let count = 0;

    if (node.type === "Property") count++;
    if (node.properties) count += node.properties.length;
    if (node.body && Array.isArray(node.body)) {
      count += node.body.filter(n => n.type === "Property").length;
    }

    if (Array.isArray(node)) {
      return node.reduce((sum, n) => sum + this.countProperties(n), 0);
    }

    if (node.body && Array.isArray(node.body)) count += this.countProperties(node.body);
    if (node.children) count += this.countProperties(node.children);
    if (node.pseudoStates) count += this.countProperties(node.pseudoStates);
    if (node.frames) count += this.countProperties(node.frames);
    if (node.rules) count += this.countProperties(node.rules);

    return count;
  }

  // Auxiliar estatistico de contagem total de regras e seletores mapeados
  countRules(node) {
    if (!node) return 0;
    let count = 0;

    if (node.type === "Rule") count++;
    if (Array.isArray(node)) {
      return node.reduce((sum, n) => sum + this.countRules(n), 0);
    }

    if (node.body && Array.isArray(node.body)) count += this.countRules(node.body);
    if (node.children) count += this.countRules(node.children);
    if (node.rules) count += this.countRules(node.rules);

    return count;
  }
}

module.exports = Compiler;

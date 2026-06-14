const { PROPERTIES, VALUES, PSEUDOS, COLORS } = require("./dictionary");

class Diagnostic {
  constructor(severity, message, line, column, code = "SWLS0000") {
    this.severity = severity;
    this.message = message;
    this.line = line;
    this.column = column;
    this.code = code;
  }
}

class Linter {
  constructor() {
    this.diagnostics = [];
    this.definedVariables = new Set();
    this.definedComponents = new Set();
    this.importedFiles = new Set();
  }

  // Ponto de entrada do linter para analise estrutural e escopo
  lint(ast, globalVariables = {}) {
    this.diagnostics = [];
    this.definedVariables.clear();
    this.definedComponents.clear();
    this.importedFiles.clear();

    Object.keys(globalVariables).forEach(name => this.definedVariables.add(name));

    if (!ast || !ast.body) return this.diagnostics;

    this.collectDefinitions(ast.body);
    this.validateAST(ast.body);

    return this.diagnostics;
  }

  // Primeira passagem: mapeia declaracoes na raiz e escopos internos
  collectDefinitions(nodes) {
    if (!Array.isArray(nodes)) return;

    for (const node of nodes) {
      if (!node) continue;

      if (node.type === "Variable") {
        this.definedVariables.add(node.name);
      }
      if (node.type === "Component") {
        this.definedComponents.add(node.name);
      }
      if (node.type === "Import") {
        this.importedFiles.add(node.path);
      }
      if (node.type === "Mixin") {
        this.definedVariables.add(node.name);
      }
      if (node.type === "Loop" && node.variable) {
        this.definedVariables.add(node.variable);
      }

      if (node.body && Array.isArray(node.body)) {
        this.collectDefinitions(node.body);
      }
      if (node.thenBranch && Array.isArray(node.thenBranch)) {
        this.collectDefinitions(node.thenBranch);
      }
      if (node.properties && Array.isArray(node.properties)) {
        this.collectDefinitions(node.properties);
      }
      if (node.children && Array.isArray(node.children)) {
        this.collectDefinitions(node.children);
      }
    }
  }

  // Segunda passagem: executa validacao profunda dos nos
  validateAST(nodes) {
    if (!Array.isArray(nodes)) return;

    for (const node of nodes) {
      if (!node) continue;

      switch (node.type) {
        case "Rule":
          this.validateRule(node);
          if (node.properties) this.validateAST(node.properties);
          if (node.children) this.validateAST(node.children);
          if (node.pseudoStates) this.validateAST(node.pseudoStates);
          break;
        case "Property":
          this.validateProperty(node);
          break;
        case "PseudoState":
          this.validatePseudoState(node);
          if (node.properties) this.validateAST(node.properties);
          break;
        case "Component":
          this.validateComponent(node);
          if (node.body) this.validateAST(node.body);
          break;
        case "Variable":
          this.validateVariable(node);
          break;
        case "Animation":
          this.validateAnimation(node);
          break;
        case "Theme":
          if (node.variables) this.validateAST(node.variables);
          break;
        case "Conditional":
        case "Loop":
          if (node.body) this.validateAST(node.body);
          if (node.thenBranch) this.validateAST(node.thenBranch);
          break;
      }
    }
  }

  // Valida integridade e caracteres de seletores CSS
  validateRule(node) {
    if (!node.selector || node.selector.trim() === "") {
      this.diagnostics.push(
        new Diagnostic("error", "Seletor vazio", node.line, 0, "SWLS0001")
      );
    }
    const invalidChars = /[{};]/g;
    if (invalidChars.test(node.selector)) {
      this.diagnostics.push(
        new Diagnostic(
          "error",
          `Seletor contém caracteres inválidos: ${node.selector}`,
          node.line,
          0,
          "SWLS0002"
        )
      );
    }
  }

  // Verifica mapeamento de propriedades e consistencia de chamadas de variaveis
  validateProperty(node) {
    if (!node || !node.name) return;
    const propName = node.name.toLowerCase();

    if (!PROPERTIES[propName]) {
      this.diagnostics.push(
        new Diagnostic(
          "warning",
          `Propriedade desconhecida: '${node.name}'. Será gerada como CSS bruto.`,
          node.line,
          0,
          "SWLS0010"
        )
      );
    }

    if (node.value && typeof node.value === "string") {
      const vars = node.value.match(/@([\w-]+)/g) || [];
      vars.forEach(v => {
        const varName = v.slice(1);
        if (!this.definedVariables.has(varName)) {
          this.diagnostics.push(
            new Diagnostic(
              "error",
              `Variável não definida: '${v}'`,
              node.line,
              0,
              "SWLS0020"
            )
          );
        }
      });

      if (node.value.includes("important") && !node.value.includes("!")) {
        this.diagnostics.push(
          new Diagnostic(
            "info",
            "Use '!importante' para marcar propriedade como importante",
            node.line,
            0,
            "SWLS0030"
          )
        );
      }
    }
  }

  // Valida a existencia ou compatibilidade de pseudo-classes
  validatePseudoState(node) {
    const name = node.name;
    if (!name || name.startsWith("__raw__")) return;

    if (!PSEUDOS[name] && !PSEUDOS[name.replace(":", "")]) {
      this.diagnostics.push(
        new Diagnostic(
          "warning",
          `Pseudo-estado desconhecido: '${name}'. Será gerado como ':${name}'`,
          node.line,
          0,
          "SWLS0040"
        )
      );
    }
  }

  // Garante a existencia de vinculos de heranca de componentes
  validateComponent(node) {
    if (node.parent && !this.definedComponents.has(node.parent)) {
      this.diagnostics.push(
        new Diagnostic(
          "error",
          `Componente pai '${node.parent}' não definido`,
          node.line,
          0,
          "SWLS0050"
        )
      );
    }
  }

  // Checa nomeaçao e conteudo atribuido a variaveis locais ou globais
  validateVariable(node) {
    if (!/^[\w-]+$/.test(node.name)) {
      this.diagnostics.push(
        new Diagnostic(
          "warning",
          `Nome de variável inválido: '@${node.name}'. Use apenas letras, números e hífens.`,
          node.line,
          0,
          "SWLS0060"
        )
      );
    }

    if (!node.value || String(node.value).trim() === "") {
      this.diagnostics.push(
        new Diagnostic(
          "error",
          `Variável vazia: '@${node.name}'`,
          node.line,
          0,
          "SWLS0061"
        )
      );
    }
  }

  // Valida integridade de estruturas de keyframes de animacao
  validateAnimation(node) {
    if (!node.frames || node.frames.length === 0) {
      this.diagnostics.push(
        new Diagnostic(
          "warning",
          `Animação '@${node.name}' vazia`,
          node.line,
          0,
          "SWLS0070"
        )
      );
    }
  }
}

module.exports = { Linter, Diagnostic };

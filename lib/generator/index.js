const { PROPERTIES, COLORS, VALUES, PSEUDOS } = require("../parser/dictionary");

class CSSGenerator {
  constructor() {
    this.css = "";
    this.indent = 0;
    this.variables = {};
  }

  // Ponto de entrada que dispara a geracao do CSS
  generate(ast) {
    this.css = "";
    this.indent = 0;
    this.astRoot = ast;
    
    if (!this.variables) {
      this.variables = {};
    }

    if (ast && ast.body) {
      ast.body.forEach(node => {
        if (node.type === "Variable") {
          this.variables[node.name] = node.value;
        }
      });

      for (const node of ast.body) {
        this.generateNode(node);
      }
    }

    return this.css.trim();
  }

  // Registra e clona o estado atual da tabela de escopos
  saveScope() {
    return { ...this.variables };
  }

  // Restaura a tabela de escopos para o estado anterior cadastrado
  restoreScope(previousScope) {
    this.variables = previousScope;
  }

  // Roteia cada no mapeado para sua respectiva sub-rotina de escrita
  generateNode(node) {
    if (!node) return;

    if (node.type === "Variable") {
      this.variables[node.name] = node.value;
      return;
    }

    switch (node.type) {
      case "Rule": this.generateRule(node); break;
      case "Component": this.generateComponent(node); break;
      case "Theme": this.generateTheme(node); break;
      case "Animation": this.generateAnimation(node); break;
      case "MediaQuery": this.generateMedia(node); break;
      case "Conditional": this.generateConditional(node, "", false); break;
      case "Loop": this.generateLoop(node, ""); break;
      case "Include": this.generateInclude(node); break;
      case "Extend": this.generateExtend(node); break;
    }
  }

  // Transcreve seletores CSS combinando escopos locais e filhos aninhados
  generateRule(node, parentSelector = "") {
    const previousScope = this.saveScope();
    let currentSelector = node.selector;
    
    if (parentSelector) {
      currentSelector = currentSelector.startsWith(".") || currentSelector.startsWith("#") || currentSelector.startsWith(":")
        ? `${parentSelector}${currentSelector}`
        : `${parentSelector} ${currentSelector}`;
    }

    currentSelector = currentSelector
      .replace(/\s*-\s*/g, "-")
      .replace(/([a-zA-Z0-9_-]+)\s*\.\s*([a-zA-Z0-9_-]+)/g, "$1.$2");

    const temPropriedadesDiretas = node.properties && node.properties.length > 0;
    const temCondicionalComPropriedades = node.children && node.children.some(c => c.type === "Conditional");
    const temIncludeDePropriedades = node.children && node.children.some(c => c.type === "Include" || c.type === "Extend");

    if (temPropriedadesDiretas || temCondicionalComPropriedades || temIncludeDePropriedades) {
      this.write(`${currentSelector} {\n`);
      this.indent++;
      
      if (node.properties) {
        node.properties.forEach(prop => this.generateProperty(prop));
      }

      if (node.children) {
        node.children.forEach(child => {
          if (child.type === "Conditional") {
            this.generateConditional(child, currentSelector, true);
          } else if (child.type === "Include") {
            this.generateInclude(child);
          } else if (child.type === "Extend") {
            this.generateExtend(child);
          }
        });
      }

      this.indent--;
      this.write(`}\n\n`);
    }

    if (node.pseudoStates && node.pseudoStates.length > 0) {
      node.pseudoStates.forEach(pseudo => this.generatePseudo(pseudo, currentSelector));
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        if (child.type === "Rule") {
          this.generateRule(child, currentSelector);
        } else if (child.type === "Loop") {
          this.generateLoop(child, currentSelector);
        } else if (child.type === "MediaQuery") {
          this.generateMedia(child);
        } else if (child.type === "Conditional") {
          this.generateConditional(child, currentSelector, false);
        }
      });
    }

    this.restoreScope(previousScope);
  }

  // Resolve e transcreve estruturas de componentes herdados
  generateComponent(node) {
    const previousScope = this.saveScope();
    const className = `.${node.name}`;
    let todasAsPropriedades = [];
    let pseudoEstados = [];

    if (node.parent) {
      const componentList = this.astRoot?.body || []; 
      const paiNode = componentList.find(n => n.type === "Component" && n.name === node.parent);
      
      if (paiNode && paiNode.body) {
        todasAsPropriedades.push(...paiNode.body.filter(n => n.type === "Property" || n.type === "Variable"));
        pseudoEstados.push(...paiNode.body.filter(n => n.type === "PseudoState"));
      }
    }

    if (node.body) {
      todasAsPropriedades.push(...node.body.filter(n => n.type === "Property" || n.type === "Variable"));
      pseudoEstados.push(...node.body.filter(n => n.type === "PseudoState"));
    }

    if (todasAsPropriedades.length > 0) {
      this.write(`${className} {\n`);
      this.indent++;
      todasAsPropriedades.forEach(prop => this.generateProperty(prop));
      this.indent--;
      this.write(`}\n\n`);
    }

    if (pseudoEstados.length > 0) {
      pseudoEstados.forEach(pseudo => this.generatePseudo(pseudo, className));
    }

    if (node.body) {
      const rules = node.body.filter(n => n.type === "Rule");
      rules.forEach(rule => this.generateRule(rule, className));
    }

    this.restoreScope(previousScope);
  }

  // Transcreve mapas de variaveis de blocos de temas customizados
  generateTheme(node) {
    this.write(`:root[data-tema="${node.name}"] {\n`);
    this.indent++;
    node.variables.forEach(v => {
      const value = this.resolveValue(v.value);
      this.write(`--${v.name}: ${value};\n`);
    });
    this.indent--;
    this.write(`}\n\n`);
  }

  // Escreve sequencias completas de sub-frames de animacoes keyframes
  generateAnimation(node) {
    this.write(`@keyframes ${node.name} {\n`);
    this.indent++;
    node.frames.forEach(frame => {
      const pos = frame.position === "de" ? "from" : frame.position === "para" ? "to" : frame.position;
      this.write(`${pos} {\n`);
      this.indent++;
      frame.properties.forEach(prop => this.generateProperty(prop));
      this.indent--;
      this.write(`}\n`);
    });
    this.indent--;
    this.write(`}\n\n`);
  }

  // Traduz termos estruturais e escreve blocos de media queries
  generateMedia(node) {
    let condition = node.condition;
    if (condition) {
      condition = condition
        .replace(/\be\b/g, "and")
        .replace(/e\s*\(/g, "and (");

      for (const [pt, en] of Object.entries(PROPERTIES)) {
        const escapedPt = pt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        condition = condition.replace(new RegExp(`\\b${escapedPt}\\b`, "gi"), en);
      }
    }

    this.write(`@media ${condition} {\n`);
    this.indent++;
    
    if (Array.isArray(node.rules)) {
      node.rules.forEach(rule => {
        if (rule.type === "Rule") {
          this.generateRule(rule, "");
        } else {
          this.generateNode(rule);
        }
      });
    }
    
    this.indent--;
    this.write(`}\n\n`);
  }
  // Processa e escreve propriedades individuais traduzidas
  generateProperty(prop) {
    if (!prop || prop.value === undefined || prop.value === null) return;

    if (prop.type === "Variable") {
      this.variables[prop.name] = this.resolveValue(prop.value);
      return;
    }

    const cssName = PROPERTIES[prop.name] || prop.name;
    let rawValue = prop.value;

    if (typeof rawValue === "string" && rawValue.includes("@importar")) {
      rawValue = rawValue.split("@importar")[0].trim();
    }

    if (rawValue.includes("@")) {
      for (const [varName, varVal] of Object.entries(this.variables)) {
        const escapedVarName = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        rawValue = rawValue.replace(new RegExp(`@${escapedVarName}`, "g"), varVal);
      }
    }

    let cssValue = this.resolveValue(rawValue);

    if (/[+\-*/]/.test(cssValue) && !cssValue.includes("calc(") && !cssValue.includes("rgba(")) {
      try {
        const unitMatch = cssValue.match(/(px|%|em|rem|vh|vw)/);
        const unit = unitMatch ? unitMatch : "";
        const cleanExpr = cssValue.replace(/(px|%|em|rem|vh|vw)/g, "").trim();
        if (/^[0-9.+\-*/\s()]+$/.test(cleanExpr)) {
          const result = Function(`"use strict"; return (${cleanExpr})`)();
          cssValue = `${Number(result.toFixed(3))}${unit}`;
        }
      } catch (e) {}
    }

    if (cssName === "content") {
      if (!cssValue.startsWith('"') && !cssValue.startsWith("'")) {
        cssValue = `"${cssValue}"`;
      }
    }

    if (typeof cssValue === "string" && /!\s*importante/i.test(cssValue)) {
      cssValue = cssValue.replace(/!\s*importante/gi, "").trim();
      prop.important = true;
    }

    this.write(`${cssName}: ${cssValue}${prop.important ? " !important" : ""};\n`);
  }

  // Avalia condicionais @se dinamicos
  generateConditional(node, contextSelector = "", isInOpenBlock = false) {
    let expr = node.condition;

    if (this.variables) {
      for (const [varName, varVal] of Object.entries(this.variables)) {
        const escapedVarName = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        expr = expr.replace(new RegExp(`@${escapedVarName}`, "g"), varVal);
      }
    }

    let rawExpr = expr.replace(/=\s*=/g, "==").replace(/!\s*=/g, "!=").trim();
    let cleanExpr = rawExpr
      .split(/\s+/)
      .map(token => {
        if (["==", "!=", "&&", "||", "true", "false"].includes(token) || /^[0-9.-]+$/.test(token)) return token;
        if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) return token;
        return `"${token}"`;
      })
      .join(" ");

    try {
      const isTrue = Function(`"use strict"; return (${cleanExpr})`)();

      if (isTrue && node.thenBranch) {
        node.thenBranch.forEach(child => {
          if (child.type === "Property" || (child.name && child.value !== undefined)) {
            if (isInOpenBlock) this.generateProperty(child);
          } else if (child.type === "Include" || child.type === "Extend") {
            if (isInOpenBlock) this.generateNode(child);
          } else {
            if (!isInOpenBlock) {
              if (child.type === "Rule") this.generateRule(child, contextSelector);
              else if (child.type === "Loop") this.generateLoop(child, contextSelector);
              else this.generateNode(child);
            }
          }
        });
      }
    } catch (e) {
      console.warn(`⚠ Falha ao avaliar condicional [@se ${expr}]:`, e.message);
    }
  }

  // Resolve pseudo-classes e pseudo-elementos
  generatePseudo(pseudo, selector) {
    const name = pseudo.name;
    if (name.startsWith("__raw__")) {
      const suffix = name.slice(7);
      this.write(`${selector}${suffix} {\n`);
      this.indent++;
      pseudo.properties.forEach(prop => this.generateProperty(prop));
      this.indent--;
      this.write(`}\n\n`);
      return;
    }

    const cssName = PSEUDOS[name] || name;
    if (cssName.includes(":")) {
      this.write(`@media (${cssName}) {\n`);
      this.indent++;
      this.write(`${selector} {\n`);
      this.indent++;
      pseudo.properties.forEach(prop => this.generateProperty(prop));
      this.indent--;
      this.write(`}\n`);
      this.indent--;
      this.write(`}\n\n`);
      return;
    }

    this.write(`${selector}:${cssName} {\n`);
    this.indent++;
    pseudo.properties.forEach(prop => this.generateProperty(prop));
    this.indent--;
    this.write(`}\n\n`);
  }

  // Traduz valores com base no dicionario global e ajusta funcoes CSS
  resolveValue(value) {
    if (!value) return "";
    let resolved = value;

    if (resolved.startsWith("(") && resolved.endsWith(")") && !/^(url|rgba|rgb|calc|linear-gradient)/i.test(resolved)) {
      resolved = resolved.slice(1, -1).trim();
    }

    if (COLORS[resolved]) return COLORS[resolved];
    if (VALUES[resolved]) return VALUES[resolved];

    if (resolved.includes(" ") || resolved.includes(",")) {
      resolved = resolved.split(/(\s+|,)/).map(t => (!t.trim() ? t : COLORS[t.trim()] || VALUES[t.trim()] || t)).join("");
    }

    resolved = resolved
      .replace(/repetir\s*\(\s*/gi, "repeat(")
      .replace(/url\(\s*/g, "url(")
      .replace(/rgba\(\s*/g, "rgba(")
      .replace(/rgb\(\s*/g, "rgb(")
      .replace(/calc\(\s*/g, "calc(")
      .replace(/clamp\s*\(\s*/g, "clamp(")
      .replace(/var\s*\(\s*/g, "var(")
      .replace(/rotate\s*\(\s*/g, "rotate(")
      .replace(/scale\s*\(\s*/g, "scale(")
      .replace(/translateY\s*\(\s*/g, "translateY(")
      .replace(/\s*:\s*/g, ":")
      .replace(/\s*\/\s*/g, "/")
      .replace(/\s*,\s*/g, ", ")
      .replace(/\s*\)\s*/g, ")")
      .replace(/(\d+)\s+(px|rem|em|%|vh|vw)/g, "$1$2");

    if (resolved.includes("url(") && !resolved.endsWith(")")) resolved += ")";
    if (resolved.includes("rgba(") && !resolved.endsWith(")")) resolved += ")";
    if (resolved.includes("rgb(") && !resolved.endsWith(")")) resolved += ")";

    return resolved;
  }

  // Auxiliar de escrita com indentacao
  write(str) {
    const indentation = "  ".repeat(this.indent);
    this.css += indentation + str;
  }
  // Expande laços de repetição @repetir aplicando escopo dinâmico e recursivo
  generateLoop(node, contextSelector = "") {
    const varName = node.variable;
    const condition = node.iterable;

    const match = condition.match(/de\s+(\d+)\s+ate\s+(\d+)/i);
    if (!match) {
      console.warn(`⚠ Sintaxe de loop inválida: [@repetir @${varName} ${condition}]`);
      return;
    }

    const inicio = parseInt(match[1], 10);
    const fim = parseInt(match[2], 10);
    const originalValue = this.variables[varName];

    for (let i = inicio; i <= fim; i++) {
      this.variables[varName] = i.toString();

      if (node.body) {
        node.body.forEach(child => {
          if (child.type === "Rule") {
            let resolvedSelector = child.selector.replace(new RegExp(`@${varName}\\b`, "g"), i);
            
            const resolvedProperties = child.properties ? child.properties.map(prop => {
              let propValue = prop.value;
              if (typeof propValue === "string" && propValue.includes(`@${varName}`)) {
                propValue = propValue.replace(new RegExp(`@${varName}\\b`, "g"), i);
              }
              return { ...prop, value: propValue };
            }) : [];

            const resolvedChildren = child.children ? child.children.map(c => {
              if (c.type === "Property" || c.type === "Variable") {
                let cValue = c.value;
                if (typeof cValue === "string" && cValue.includes(`@${varName}`)) {
                  cValue = cValue.replace(new RegExp(`@${varName}\\b`, "g"), i);
                }
                return { ...c, value: cValue };
              }
              return c;
            }) : [];

            const tempRule = { 
              ...child, 
              selector: resolvedSelector, 
              properties: resolvedProperties,
              children: resolvedChildren
            };
            
            this.generateRule(tempRule, contextSelector);
          } else if (child.type === "Property" || child.type === "Variable") {
            let childValue = child.value;
            if (typeof childValue === "string" && childValue.includes(`@${varName}`)) {
              childValue = childValue.replace(new RegExp(`@${varName}\\b`, "g"), i);
            }
            const tempProp = { ...child, value: childValue };
            this.generateProperty(tempProp);
          } else {
            this.generateNode(child);
          }
        });
      }
    }

    if (originalValue !== undefined) {
      this.variables[varName] = originalValue;
    } else {
      delete this.variables[varName];
    }
  }

  // Injeta blocos de regras reaproveitáveis via @incluir
  generateInclude(node) {
    const mixinName = node.name;
    const list = this.astRoot?.body || [];
    const mixinNode = list.find(n => n.type === "Mixin" && n.name === mixinName);

    if (!mixinNode || !mixinNode.body) {
      console.warn(`⚠ Mixin não encontrado ou vazio: [@incluir ${mixinName}]`);
      return;
    }

    mixinNode.body.forEach(child => {
      if (child.type === "Property" || child.type === "Variable") {
        this.generateProperty(child);
      } else {
        this.generateNode(child);
      }
    });
  }

  // Copia propriedades de seletores existentes via @estender
  generateExtend(node) {
    const targetSelector = node.target;
    const list = this.astRoot?.body || [];
    const targetRule = list.find(n => n.type === "Rule" && n.selector === targetSelector);

    if (!targetRule || !targetRule.properties) {
      console.warn(`⚠ Alvo do @estender não encontrado ou sem propriedades: [${targetSelector}]`);
      return;
    }

    targetRule.properties.forEach(prop => {
      this.generateProperty(prop);
    });
  }
}

module.exports = CSSGenerator;

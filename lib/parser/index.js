const { Tokenizer } = require("../tokenizer");
const AST = require("../ast");
const { PROPERTIES } = require("./dictionary");

class Parser {
  constructor(source, filename = "unknown.swls") {
    this.source = source;
    this.filename = filename;
    this.tokenizer = new Tokenizer(source);
    this.tokens = this.tokenizer.tokenize();
    this.pos = 0;
  }

  // Retorna o token na posicao atual do ponteiro
  current() {
    return this.tokens[this.pos];
  }

  // Permite espiar tokens a frente sem avancar o ponteiro
  peek(offset = 1) {
    return this.tokens[this.pos + offset];
  }

  // Avanca o ponteiro de leitura dos tokens
  advance() {
    this.pos++;
  }

  // Consome um token exigindo correspondencia estrita de tipo
  expect(type) {
    const token = this.current();
    if (!token || token.type !== type) {
      throw new Error(`Expected ${type}, got ${token ? token.type : "EOF"} at line ${token?.line}`);
    }
    this.advance();
    return token;
  }

  // Consome um token se ele corresponder a um dos tipos informados
  match(...types) {
    const token = this.current();
    if (token && types.includes(token.type)) {
      this.advance();
      return token;
    }
    return null;
  }

  // Ponto de entrada que inicia o processamento do programa
  parse() {
    const program = new AST.Program();
    program.metadata = {
      source: this.filename,
      timestamp: new Date().toISOString(),
    };

    while (this.current() && this.current().type !== "EOF") {
      if (this.current().type === "IDENTIFIER" && !this.current().value.trim()) {
        this.advance();
        continue;
      }
      
      const stmt = this.parseStatement();
      if (stmt) {
        program.body.push(stmt);
      }
    }

    return program;
  }

  // Executa o roteamento de instrucoes de raiz
  parseStatement() {
    while (this.current() && this.current().type === "IDENTIFIER" && !this.current().value.trim()) {
      this.advance();
    }

    if (!this.current() || this.current().type === "EOF") return null;

    const token = this.current();

    if (token.type === "IMPORT") {
      this.advance();
      const pathToken = this.expect("STRING");
      return new AST.Import(pathToken.value);
    }

    if (token.type === "THEME") {
      return this.parseTheme();
    }

    if (token.type === "ANIMATION") {
      return this.parseAnimation();
    }

    if (token.type === "COMPONENT") {
      return this.parseComponent();
    }

    if (token.type === "MIXIN" || token.value === "@mixin") {
      return this.parseMixin();
    }

    if (token.type === "VARIABLE") {
      const varToken = this.current();
      const varName = this.expect("VARIABLE").value.slice(1);
      this.expect("COLON");
      const varValue = this.parseValue();
      const v = new AST.Variable(varName, varValue);
      v.line = varToken.line;
      return v;
    }

    if (token.type === "PAREN_OPEN") {
      return this.parseRule();
    }

    this.advance();
    return null;
  }

  // Processa e extrai lacos de repeticao @repetir
  parseLoop() {
    this.expect("LOOP");
    const varToken = this.expect("VARIABLE");
    const varName = varToken.value.slice(1);

    let loopCondition = "";
    while (this.current() && this.current().type !== "PAREN_OPEN" && this.current().type !== "EOF") {
      loopCondition += this.current().value + " ";
      this.advance();
    }
    loopCondition = loopCondition.trim();

    this.expect("PAREN_OPEN");
    const body = this.parseBlock();
    this.expect("PAREN_CLOSE");
    
    while (this.current() && ["IDENTIFIER", "SLASH", "DOT"].includes(this.current().type) && !this.current().value.trim()) {
      this.advance();
    }

    const loopNode = new AST.Loop(varName, loopCondition);
    loopNode.body = body;
    loopNode.line = varToken.line;
    return loopNode;
  }

  // Processa e extrai estruturas condicionais @se
  parseConditional() {
    this.expect("CONDITIONAL");

    let conditionExpr = "";
    while (this.current() && this.current().type !== "PAREN_OPEN" && this.current().type !== "EOF") {
      conditionExpr += this.current().value + " ";
      this.advance();
    }
    conditionExpr = conditionExpr.trim();

    this.expect("PAREN_OPEN");
    const thenBranch = this.parseBlock();
    this.expect("PAREN_CLOSE");

    while (this.current() && this.current().type === "IDENTIFIER" && !this.current().value.trim()) {
      this.advance();
    }

    const condNode = new AST.Conditional(conditionExpr);
    condNode.thenBranch = thenBranch;
    condNode.line = this.current() ? this.current().line : 0;
    return condNode;
  }

  // Processa diretivas basicas de importacao
  parseImport() {
    const token = this.expect("IMPORT");
    const path = this.expect("STRING").value;
    const imp = new AST.Import(path);
    imp.line = token.line;
    imp.column = token.column;
    return imp;
  }

  // Processa blocos de definicao de tema global @tema
  parseTheme() {
    const token = this.expect("THEME");
    const name = this.expect("IDENTIFIER").value;
    const theme = new AST.Theme(name);
    theme.line = token.line;
    theme.column = token.column;

    this.expect("PAREN_OPEN");
    
    while (this.current() && this.current().type !== "PAREN_CLOSE" && this.current().type !== "EOF") {
      if (this.current().type === "IDENTIFIER" && !this.current().value.trim()) {
        this.advance();
        continue;
      }

      const varToken = this.current();
      if (varToken.type !== "IDENTIFIER" && varToken.type !== "VARIABLE") {
        this.advance();
        continue;
      }

      const varName = varToken.value.replace("@", "");
      this.advance();

      if (this.current() && this.current().type === "COLON") {
        this.advance();
      }

      const value = this.parseValue();
      const v = new AST.Variable(varName, value);
      v.line = varToken.line;
      theme.variables.push(v);
    }
    this.expect("PAREN_CLOSE");

    return theme;
  }
  // Processa a definicao de componentes e heranças nativas
  parseComponent() {
    const token = this.expect("COMPONENT");
    const name = this.expect("IDENTIFIER").value;
    let parent = null;

    if (this.current() && this.current().type === "IDENTIFIER" && this.current().value === "herda") {
      this.advance();
      parent = this.expect("IDENTIFIER").value;
    }

    const comp = new AST.Component(name, parent);
    comp.line = token.line;
    comp.column = token.column;

    this.expect("PAREN_OPEN");
    comp.body = this.parseBlock();
    this.expect("PAREN_CLOSE");

    return comp;
  }

  // Processa blocos de animacao keyframes @animar e seus sub-frames
  parseAnimation() {
    const token = this.expect("ANIMATION");
    const name = this.expect("IDENTIFIER").value;
    const anim = new AST.Animation(name);
    anim.line = token.line;
    anim.column = token.column;

    this.expect("PAREN_OPEN");
    
    while (this.current() && this.current().type !== "PAREN_CLOSE" && this.current().type !== "EOF") {
      if (this.current().type === "IDENTIFIER" && !this.current().value.trim()) {
        this.advance();
        continue;
      }

      const frameToken = this.current();
      if (frameToken.type !== "IDENTIFIER" && frameToken.type !== "NUMBER") {
        this.advance();
        continue;
      }
      
      const framePos = frameToken.value;
      this.advance(); 
      this.expect("COLON"); 
      
      const frame = new AST.Frame(framePos);
      frame.line = frameToken.line;

      while (this.current() && this.current().type === "IDENTIFIER" && this.current().value.trim()) {
        if ((this.current().value === "de" || this.current().value === "para") && this.peek() && this.peek().type === "COLON") {
          break;
        }
        
        const propToken = this.current();
        const propName = this.expect("IDENTIFIER").value;
        
        if (this.current() && this.current().type === "COLON") {
          this.advance();
        }
        
        const propValue = this.parseValue();
        const prop = new AST.Property(propName, propValue);
        prop.line = propToken.line;
        frame.properties.push(prop);
      }

      anim.frames.push(frame);
    }
    this.expect("PAREN_CLOSE");

    return anim;
  }

  // Processa consultas de midia @media e isola suas regras internas
  parseMedia() {
    const token = this.expect("MEDIA");
    const condition = this.parseValue();
    const media = new AST.MediaQuery(condition);
    media.line = token.line;
    media.column = token.column;

    this.expect("PAREN_OPEN");
    media.rules = this.parseBlock();
    this.expect("PAREN_CLOSE");

    return media;
  }

  // Processa blocos de mixins reaproveitaveis @mixin
  parseMixin() {
    const token = this.expect("MIXIN");
    const name = this.expect("IDENTIFIER").value;
    const mixin = new AST.Mixin(name);
    mixin.line = token.line;
    mixin.column = token.column;

    this.expect("PAREN_OPEN");
    mixin.body = this.parseBlock();
    this.expect("PAREN_CLOSE");

    return mixin;
  }

  // Processa seletores, pseudo-classes, combinadores e monta regras CSS
  parseRule() {
    if (this.match("PAREN_OPEN")) {
      let selector = "";
      const startToken = this.current();
      
      while (this.current() && this.current().type !== "COLON" && this.current().type !== "EOF") {
        const token = this.current();
        
        if (token.type === "STRING") {
          selector += `"${token.value}"`;
        } else if (token.type === "PLUS" || token.type === "MINUS" || token.type === "MULTIPLY" || token.value === ">") {
          selector += ` ${token.value} `;
        } else {
          selector += token.value;
        }
        this.advance();
      }
      
      this.expect("COLON");
      let cleanSelector = selector.replace(/\s+/g, " ").trim();

      if (cleanSelector.startsWith("&")) {
        const pseudoName = cleanSelector.slice(1).trim();
        const finalName = pseudoName.startsWith(":") ? pseudoName.slice(1) : pseudoName;
        
        const isAttribute = finalName.startsWith("[");
        const nodeName = isAttribute ? "__raw__" + finalName : "__raw__:" + finalName;
        
        const pseudo = new AST.PseudoState(nodeName);
        pseudo.line = startToken ? startToken.line : 0;
        
        pseudo.properties = this.parseBlock();
        this.expect("PAREN_CLOSE");
        return pseudo;
      }

      const rule = new AST.Rule(cleanSelector);
      rule.line = startToken ? startToken.line : 0;
      
      const blockNodes = this.parseBlock();
      
      blockNodes.forEach(node => {
        if (node.type === "Property" || node.type === "Variable") {
          rule.properties.push(node);
        } else if (node.type === "PseudoState") {
          rule.pseudoStates.push(node);
        } else {
          rule.children.push(node);
        }
      });
      
      this.expect("PAREN_CLOSE");
      return rule;
    }
    return null;
  }
  // Auxiliar para captura limpa de seletores brutos
  parseSelector() {
    let selector = "";
    while (this.current() && this.current().type !== "COLON") {
      selector += this.current().value + " ";
      this.advance();
    }
    return selector.replace(/\s+/g, " ").trim();
  }

  // Varre e distribui os nós internos de qualquer bloco estrutural
  parseBlock() {
    const nodes = [];
    
    while (this.current() && this.current().type !== "PAREN_CLOSE" && this.current().type !== "EOF") {
      
      while (this.current() && this.current().type === "IDENTIFIER" && this.current().value !== undefined && !this.current().value.trim()) {
        this.advance();
      }

      if (!this.current() || this.current().type === "PAREN_CLOSE" || this.current().type === "EOF") {
        break;
      }

      const token = this.current();

      if (token.type === "MEDIA" || token.value === "@media") {
        const mediaNode = this.parseMedia();
        if (mediaNode) nodes.push(mediaNode);
        continue;
      }

      if (token.type === "CONDITIONAL" || token.value === "@se") {
        const cond = this.parseConditional();
        if (cond) nodes.push(cond);
        continue;
      }

      if (token.type === "LOOP" || token.value === "@repetir") {
        const loop = this.parseLoop();
        if (loop) nodes.push(loop);
        continue;
      }

      if (token.type === "INCLUDE" || token.value === "@incluir") {
        this.advance();
        const nameToken = this.expect("IDENTIFIER");
        const includeNode = new AST.Include(nameToken.value);
        includeNode.line = nameToken.line;
        nodes.push(includeNode);
        continue;
      }

      if (token.type === "EXTEND" || token.value === "@estender") {
        this.advance();
        let targetSelector = "";
        while (this.current() && this.current().line === token.line && this.current().type !== "PAREN_CLOSE" && this.current().type !== "EOF") {
          targetSelector += this.current().value;
          this.advance();
        }
        const extendNode = new AST.Extend(targetSelector.trim());
        extendNode.line = token.line;
        nodes.push(extendNode);
        continue;
      }

      if (token.type === "AMPERSAND") {
        this.advance(); 
        const pseudo = this.parsePseudoState();
        if (pseudo) nodes.push(pseudo);
        continue;
      }

      if (token.type === "VARIABLE") {
        const varToken = this.current();
        const varName = this.expect("VARIABLE").value.slice(1);
        this.expect("COLON");
        const varValue = this.parseValue();
        const v = new AST.Variable(varName, varValue);
        v.line = varToken.line;
        nodes.push(v);
        continue;
      }

      if (token.type === "PAREN_OPEN") {
        const rule = this.parseRule();
        if (rule) nodes.push(rule);
        continue;
      }

      if (token.type === "IDENTIFIER" && token.value.trim() && this.peek() && this.peek().type !== "COLON") {
        const propToken = this.current();
        const propName = this.expect("IDENTIFIER").value;
        const propValue = this.parseValue();
        const prop = new AST.Property(propName, propValue);
        prop.line = propToken.line;
        nodes.push(prop);
        continue;
      }

      this.advance();
    }
    
    return nodes.filter(Boolean);
  }

  // Captura e reconstrói valores complexos aplicando regras de espaçamento nativo
  parseValue() {
    if (!this.current() || this.current().type === "EOF") return "";
    const startLine = this.current().line;
    let valueParts = [];
    let isInsideCssFunction = false;
    let parenDepth = 0;

    while (this.current() && this.current().type !== "EOF" && this.current().line === startLine) {
      const token = this.current();

      if (["url", "rgba", "rgb", "calc", "linear-gradient", "clamp", "blur", "brightness", "drop-shadow"].includes(token.value)) {
        if (this.peek() && this.peek().type === "PAREN_OPEN") {
          isInsideCssFunction = true;
        }
      }

      if (token.type === "PAREN_OPEN") {
        parenDepth++;
      }

      if (token.type === "PAREN_CLOSE" && !isInsideCssFunction && parenDepth === 0) {
        break;
      }

      if (token.type === "PAREN_CLOSE" && parenDepth > 0) {
        parenDepth--;
        if (isInsideCssFunction) isInsideCssFunction = false;
      }

      valueParts.push(token);
      this.advance();
    }

    while (this.current() && this.current().line === startLine && this.current().type !== "EOF") {
      this.advance();
    }

    let rawValue = "";
    for (let i = 0; i < valueParts.length; i++) {
      const currentToken = valueParts[i];
      const nextToken = valueParts[i + 1];

      rawValue += currentToken.value;

      if (nextToken) {
        if (nextToken.type === "PAREN_OPEN" && ["url", "rgba", "rgb", "calc", "linear-gradient", "clamp", "blur", "brightness", "drop-shadow"].includes(currentToken.value)) {
          continue;
        }
        if (currentToken.value.includes("/") || nextToken.value.startsWith("/") || currentToken.value === "." || nextToken.value === ".") {
          continue;
        }
        if (currentToken.type === "PLUS" || currentToken.type === "MINUS" || currentToken.type === "MULTIPLY" || nextToken.type === "PLUS" || nextToken.type === "MINUS" || nextToken.type === "MULTIPLY") {
          if (currentToken.type === "MINUS" && /[\w]/.test(valueParts[i-1]?.value) && /[\w]/.test(nextToken.value)) {
            continue; 
          }
          rawValue += " ";
          continue;
        }
        if (currentToken.type === "PAREN_CLOSE" && nextToken.type !== "COMMA" && nextToken.type !== "PAREN_CLOSE") {
          rawValue += " ";
          continue;
        }
        if (currentToken.type === "COMMA") {
          rawValue += " ";
          continue;
        }
        rawValue += " ";
      }
    }

    rawValue = rawValue
      .replace(/\s*:\s*/g, ":")
      .replace(/\s*,\s*/g, ", ")
      .replace(/\s*==\s*/g, "==")
      .replace(/\s*=\s*/g, "==")
      .replace(/\s*\+\s*/g, " + ") 
      .replace(/\(\s+/g, "(")      
      .replace(/\s+\)/g, ")")      
      .replace(/\)([a-zA-Z_-]+)\(/g, ") $1(")
      .replace(/\)([0-9]+%?)/g, ") $1");

    rawValue = rawValue.replace(/(\d+)\s+(px|rem|em|vh|vw)/g, "$1$2");

    return rawValue.trim();
  }

  // Processa pseudo-classes e seletores de atributos puros
  parsePseudoState() {
    if (this.current().type === "COLON") {
      this.advance();
      const nameToken = this.current();
      const name = this.expect("IDENTIFIER").value;
      const pseudo = new AST.PseudoState(name);
      pseudo.line = nameToken.line;

      if (this.current() && this.current().type === "IDENTIFIER" && !this.current().value.trim()) {
        this.advance();
      }

      if (this.current() && this.current().type === "PAREN_OPEN") {
        this.advance();
        pseudo.properties = this.parseBlock();
        this.expect("PAREN_CLOSE");
      }

      return pseudo;
    }

    let rawSelector = "";
    while (this.current() && this.current().type !== "PAREN_OPEN" && this.current().type !== "COLON" && this.current().type !== "EOF") {
      rawSelector += this.current().value;
      this.advance();
    }

    if (rawSelector) {
      if (this.current() && this.current().type === "COLON") {
        this.advance();
      }

      const pseudo = new AST.PseudoState("__raw__" + rawSelector.trim());
      pseudo.line = this.current() ? this.current().line : 0;
      
      if (this.current() && this.current().type === "IDENTIFIER" && !this.current().value.trim()) {
        this.advance();
      }

      if (this.current() && this.current().type === "PAREN_OPEN") {
        this.advance();
        pseudo.properties = this.parseBlock();
        this.expect("PAREN_CLOSE");
      }
      return pseudo;
    }

    return null;
  }
}

module.exports = Parser;

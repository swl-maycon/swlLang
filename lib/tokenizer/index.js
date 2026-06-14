// Dicionario de palavras-chave da linguagem mapeadas para seus tokens
const KEYWORDS = {
  "@importar": "IMPORT",
  "@tema": "THEME",
  "@componente": "COMPONENT",
  "@animar": "ANIMATION",
  "@media": "MEDIA",
  "@mixin": "MIXIN",
  "@incluir": "INCLUDE",
  "@estender": "EXTEND",
  "@se": "CONDITIONAL",
  "@repetir": "LOOP",
};

// Delimitadores e operadores de sintaxe reconhecidos pelo compilador
const SYMBOLS = {
  "(": "PAREN_OPEN",
  ")": "PAREN_CLOSE",
  "{": "BRACE_OPEN",
  "}": "BRACE_CLOSE",
  "[": "BRACKET_OPEN",
  "]": "BRACKET_CLOSE",
  ":": "COLON",
  ",": "COMMA",
  "&": "AMPERSAND",
  ".": "DOT",
  "+": "PLUS",
  "-": "MINUS",
  "*": "MULTIPLY",
  "/": "SLASH",
  "=": "EQUALS"
};

class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

class Tokenizer {
  constructor(source) {
    this.source = source.replace(/\r/g, "");
    this.pos = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  current() {
    return this.source[this.pos];
  }

  peek(offset = 1) {
    return this.source[this.pos + offset];
  }

  advance() {
    if (this.current() === "\n") {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.pos++;
  }

  skipWhitespace() {
    while (this.current() && /\s/.test(this.current())) {
      this.advance();
    }
  }

  // Descarta comentarios de linha única protegendo paths de URL (http://)
  skipCommentLine() {
    if (this.current() === "/" && this.peek() === "/") {
      if (this.pos > 0 && this.source[this.pos - 1] === ":") {
        return false;
      }
      while (this.current() && this.current() !== "\n") {
        this.advance();
      }
      return true;
    }
    return false;
  }

  // Descarta blocos de comentario multilinha
  skipCommentBlock() {
    if (this.current() === "/" && this.peek() === "*") {
      this.advance();
      this.advance();
      while (this.current() && !(this.current() === "*" && this.peek() === "/")) {
        this.advance();
      }
      if (this.current()) {
        this.advance();
        this.advance();
      }
      return true;
    }
    return false;
  }

  // Captura cadeias de caracteres entre aspas com suporte a caracteres de escape
  readString(quote) {
    const startLine = this.line;
    const startCol = this.column;
    this.advance();

    let value = "";
    while (this.current() && this.current() !== quote) {
      if (this.current() === "\\") {
        this.advance();
        if (this.current()) {
          value += this.current();
          this.advance();
        }
      } else {
        value += this.current();
        this.advance();
      }
    }

    if (this.current() === quote) {
      this.advance();
    } else {
      throw new Error(`Unterminated string at line ${startLine}:${startCol}`);
    }

    return new Token("STRING", value, startLine, startCol);
  }

  // Captura identificadores de propriedades e paths internos de funcoes de URL
  readIdentifier() {
    const startLine = this.line;
    const startCol = this.column;
    let value = "";

    const isInsideUrl = this.tokens.length > 1 && 
                        this.tokens[this.tokens.length - 1].type === "PAREN_OPEN" && 
                        this.tokens[this.tokens.length - 2].value === "url";

    if (isInsideUrl) {
      while (this.current() && this.current() !== ")" && this.current() !== "\n") {
        value += this.current();
        this.advance();
      }
    } else {
      while (this.current() && /[\w\-\.]/.test(this.current())) {
        value += this.current();
        this.advance();
      }
    }

    return new Token("IDENTIFIER", value.trim(), startLine, startCol);
  }

  // Captura valores numericos, unidades de medida e hashes de cores hexadecimais
  readNumber() {
    const startLine = this.line;
    const startCol = this.column;
    let value = "";

    if (this.current() === "#") {
      value += this.current();
      this.advance();
      while (this.current() && /[0-9a-fA-F]/.test(this.current())) {
        value += this.current();
        this.advance();
      }
      return new Token("NUMBER", value, startLine, startCol);
    }

    while (this.current() && /[0-9a-zA-Z\.\%]/.test(this.current())) {
      if (value === "" && /[a-zA-Z]/.test(this.current())) {
        break;
      }
      value += this.current();
      this.advance();
    }

    return new Token("NUMBER", value, startLine, startCol);
  }

  // Diferencia diretivas nativas da linguagem de declaracoes comuns de variavel
  readKeywordOrVariable() {
    const startLine = this.line;
    const startCol = this.column;
    let value = "";

    while (this.current() && /[\w\-@]/.test(this.current())) {
      value += this.current();
      this.advance();
    }

    const type = KEYWORDS[value] || "VARIABLE";
    return new Token(type, value, startLine, startCol);
  }

  // Laço central que varre o arquivo bruto fatiando-o em tokens catalogados
  tokenize() {
    while (this.pos < this.source.length) {
      this.skipWhitespace();

      if (this.skipCommentLine() || this.skipCommentBlock()) continue;

      if (!this.current()) break;

      const c = this.current();
      const line = this.line;
      const col = this.column;

      if (c === '"' || c === "'") {
        this.tokens.push(this.readString(c));
        continue;
      }

      if (c === "@") {
        this.tokens.push(this.readKeywordOrVariable());
        continue;
      }

      if (/\d/.test(c) || c === "#") {
        this.tokens.push(this.readNumber());
        continue;
      }

      if (/[\w\-]/.test(c)) {
        this.tokens.push(this.readIdentifier());
        continue;
      }

      if (SYMBOLS[c]) {
        this.tokens.push(new Token(SYMBOLS[c], c, line, col));
        this.advance();
        continue;
      }

      this.tokens.push(new Token("IDENTIFIER", c, line, col));
      this.advance();
    }

    this.tokens.push(new Token("EOF", "", this.line, this.column));
    return this.tokens;
  }
}

module.exports = { Tokenizer, Token };

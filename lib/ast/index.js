class ASTNode {
  constructor(type) {
    this.type = type;
    this.line = 0;
    this.column = 0;
  }
}

class Program extends ASTNode {
  constructor() {
    super("Program");
    this.body = [];
    this.metadata = {};
  }
}

class Import extends ASTNode {
  constructor(path) {
    super("Import");
    this.path = path;
  }
}

class Variable extends ASTNode {
  constructor(name, value) {
    super("Variable");
    this.name = name;
    this.value = value;
  }
}

class Rule extends ASTNode {
  constructor(selector) {
    super("Rule");
    this.selector = selector;
    this.properties = [];
    this.pseudoStates = [];
    this.children = [];
    this.modifiers = {}; // & combinators
  }
}

class Property extends ASTNode {
  constructor(name, value) {
    super("Property");
    this.name = name;
    this.value = value;
    this.important = false;
  }
}

class PseudoState extends ASTNode {
  constructor(name) {
    super("PseudoState");
    this.name = name; // hover, focus, :not(...), .classe, [attr], etc
    this.properties = [];
  }
}

class Component extends ASTNode {
  constructor(name, parent = null) {
    super("Component");
    this.name = name;
    this.parent = parent;
    this.body = [];
    this.parameters = [];
  }
}

class Mixin extends ASTNode {
  constructor(name) {
    super("Mixin");
    this.name = name;
    this.parameters = [];
    this.body = [];
  }
}

class Include extends ASTNode {
  constructor(name) {
    super("Include");
    this.name = name;
  }
}

class Extend extends ASTNode {
  constructor(target) {
    super("Extend");
    this.target = target; // Ex: .btn, div.card, etc.
  }
}


class Theme extends ASTNode {
  constructor(name) {
    super("Theme");
    this.name = name;
    this.variables = [];
  }
}

class Animation extends ASTNode {
  constructor(name) {
    super("Animation");
    this.name = name;
    this.frames = [];
  }
}

class Frame extends ASTNode {
  constructor(position) {
    super("Frame");
    this.position = position; // from, to, 0%, 50%, etc
    this.properties = [];
  }
}

class MediaQuery extends ASTNode {
  constructor(condition) {
    super("MediaQuery");
    this.condition = condition;
    this.rules = [];
  }
}

class Conditional extends ASTNode {
  constructor(condition) {
    super("Conditional");
    this.condition = condition;
    this.thenBranch = [];
    this.elseBranch = [];
  }
}

class Loop extends ASTNode {
  constructor(variable, iterable) {
    super("Loop");
    this.variable = variable;
    this.iterable = iterable;
    this.body = [];
  }
}

class FunctionCall extends ASTNode {
  constructor(name, args) {
    super("FunctionCall");
    this.name = name;
    this.args = args;
  }
}

module.exports = {
  ASTNode,
  Program,
  Import,
  Variable,
  Rule,
  Property,
  PseudoState,
  Component,
  Mixin,
  Include,
  Extend,
  Theme,
  Animation,
  Frame,
  MediaQuery,
  Conditional,
  Loop,
  FunctionCall,
};

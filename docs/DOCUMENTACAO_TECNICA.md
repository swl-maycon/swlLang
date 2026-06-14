# Especificação Técnica de Arquitetura e Implementação — SWLS Core MX v2.0.0

Documentação arquitetural de software, descrição de subsistemas e assinaturas da API pública do compilador.

---

## Índice Técnico

1. Visão Geral da Arquitetura
2. Pipeline do Ciclo de Vida de Compilação
3. Subsistemas e Componentes Principais
4. Assinatura da API Pública Node.js
5. Modelagem Formal da Árvore Sintática Abstrata (AST)
6. Engenharia do Analisador Léxico (Tokenizer)
7. Engenharia do Analisador Sintático (Parser)
8. Barramento de Validação e Análise Estática (Linter)
9. Engenharia do Gerador de Código (Generator)
10. Subsistema de Resolução de Importações e Módulos
11. Políticas de Captura e Tratamento de Exceções
12. Critérios de Extensibilidade e Desempenho

---

## Visão Geral da Arquitetura

### Diagrama de Fluxo de Componentes

```text
┌─────────────────────────────────────────────────────────────┐
│                      SWLS Core MX                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────┐                                         │
│  │  Arquivo .swls │                                         │
│  └────────┬───────┘                                         │
│           │                                                 │
│           ▼                                                 │
│  ┌──────────────────────────────────────────┐               │
│  │        PIPELINE DE COMPILAÇÃO            │               │
│  ├──────────────────────────────────────────┤               │
│  │ 1. Tokenizer (Análise Léxica)            │               │
│  │    └─ Fluxo Ordenado de Tokens           │               │
│  │                                          │               │
│  │ 2. Parser (Análise Sintática)            │               │
│  │    └─ Árvore Sintática Abstrata (AST)    │               │
│  │                                          │               │
│  │ 3. Import Processor (Módulos)            │               │
│  │    └─ AST Expandida Inalterada           │               │
│  │                                          │               │
│  │ 4. Linter (Análise Estática de Escopo)   │               │
│  │    └─ Matriz de Diagnostics              │               │
│  │                                          │               │
│  │ 5. Generator (Geração de Código)         │               │
│  │    └─ String Textual CSS                 │               │
│  └──────────────────────────────────────────┘               │
│           │                                                 │
│           ▼                                                 │
│  ┌────────────────┐                                         │
│  │   Arquivo CSS  │                                         │
│  └────────────────┘                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Subsistemas do Núcleo

| Subsistema Mapeado | Atribuição Arquitetural | Caminho Físico Relativo |
| :--- | :--- | :--- |
| **Compiler** | Orquestração síncrona do pipeline de compilação. | `lib/compiler.js` |
| **Tokenizer** | Fatiamento léxico de strings em fluxos de tokens catalogados. | `lib/tokenizer/index.js` |
| **Parser** | Análise sintática recursiva e estruturação de nós. | `lib/parser/index.js` |
| **Linter** | Verificação estática de escopo em duas passagens e auditoria de variáveis. | `lib/parser/linter.js` |
| **CSSGenerator** | Geração e faxina de strings de funções nativas do CSS. | `lib/generator/index.js` |
| **AST** | Estruturas e definições formais das classes de nós do programa. | `lib/ast.js` |
| **Dictionary** | Dicionários estáticos de propriedades, cores e pseudos (W3C). | `lib/parser/dictionary.js` |
| **CLI** | Interface de linha de comando e processamento de flags ANSI. | `cli/swls.js` |
| **ProjectManager** | Controlador centralizado de rotinas (build, watch, init). | `cli/project-manager.js` |

---

## Pipeline do Ciclo de Vida de Compilação

### Demonstração do Fluxo de Transformação de Estados

#### 1. Código Fonte de Entrada (Módulo SWLS)
```swls
@importar "./variaveis.swls"

(body:
  fundo @cor-fundo
)
```

#### 2. Análise Léxica (Conversão Resultante no Tokenizer)
```javascript
[
  { type: "IMPORT", value: "@importar", line: 1, column: 1 },
  { type: "STRING", value: "./variaveis.swls", line: 1, column: 11 },
  { type: "PAREN_OPEN", value: "(", line: 3, column: 1 },
  { type: "IDENTIFIER", value: "body", line: 3, column: 2 },
  { type: "COLON", value: ":", line: 3, column: 6 },
  { type: "IDENTIFIER", value: "fundo", line: 4, column: 3 },
  { type: "VARIABLE", value: "@cor-fundo", line: 4, column: 9 },
  { type: "PAREN_CLOSE", value: ")", line: 5, column: 1 },
  { type: "EOF", value: "", line: 5, column: 2 }
]
```

#### 3. Análise Sintática (Geração da Árvore Sintática Abstrata)
```javascript
{
  type: "Program",
  metadata: { source: "estilos.swls", timestamp: "2026-06-14T13:00:00.000Z" },
  body: [
    {
      type: "Import",
      path: "./variaveis.swls",
      line: 1
    },
    {
      type: "Rule",
      selector: "body",
      properties: [
        {
          type: "Property",
          name: "fundo",
          value: "@cor-fundo",
          line: 4
        }
      ],
      line: 3
    }
  ]
}
```

#### 4. Resolução de Importações (Expansão Modular)
* Avalia e le arquivos anexados recursivamente de forma isolada.
* Aplica mutações de junção à cauda do corpo da AST principal garantindo a estabilidade geométrica da árvore sintática.
* Isola referências e detecta de forma precoce importações cíclicas e loops de arquivo.

#### 5. Análise Estática de Símbolos (Linter)
Se o validador detectar que o token de variável chamado `@cor-fundo` não foi indexado na tabela de símbolos nem via arquivo global `_gpai.swls`, o barramento de diagnostics armazena a ocorrência:
```javascript
[
  {
    file: "estilos.swls",
    line: 4,
    column: 9,
    severity: "error",
    message: "Variável '@cor-fundo' não definida",
    code: "SWLS0020"
  }
]
```

#### 6. Geração de Código (Transcrição Final)
```css
body {
  background-color: #f3f4f6;
}
```

---

## Subsistemas e Componentes Principais

### 1. Classe Orquestradora: `Compiler`

**Localização:** `lib/compiler.js`

**Atribuição:** Gerenciar sequencialmente os gatilhos das fases do pipeline.

#### Instanciação de Parâmetros (Constructor)
```javascript
const Compiler = require("swl-core");
const compiler = new Compiler(options);

// Objeto de opções suportadas pelo motor
{
  minify: false,          // Parâmetro programático para otimização de CSS
  sourcemap: false,       // Emissão de mapas de origem para debug
  lint: true,             // Acionamento mandatório do analisador estático
  strict: false,          // Conversão de warnings linter em erros fatais
  projectRoot: process.cwd() // Diretório raiz de trabalho do software
}
```

#### Assinaturas de Métodos Públicos

##### `compile(source, filename)`
Processa uma string direta de código fonte SWLS retornando o objeto consolidado de build:
* **Parâmetros**: `source` (String), `filename` (String, padrão: "unknown.swls")
* **Retorno**: 
  ```typescript
  {
    success: boolean,
    css: string,
    diagnostics: Diagnostic[],
    stats: {
      lines: number,
      properties: number,
      rules: number
    },
    error?: string
  }
  ```

##### `compileFile(filepath)`
Executa a leitura física e aciona recursivamente o pipeline a partir de um caminho absoluto do sistema operacional:
* **Parâmetros**: `filepath` (String)
* **Retorno**: Mesmo formato tipado do método `compile()`.

#### Assinaturas de Métodos Privados internos

* `processImports(ast, filename)`: Varre de forma recursiva a árvore isolando nós do tipo `Import` e aplicando a substituição posicional estável de blocos via `splice()`.
* `countProperties(node)`: Varre recursivamente os ramos contando as propriedades válidas injetadas no CSS.
* `countRules(node)`: Varre os ramos contabilizando a densidade final de seletores e mídias geradas.
---

### 2. Classe de Análise Léxica: `Tokenizer`

**Localização:** `lib/tokenizer/index.js`

**Atribuição:** Varre a string de entrada do código fonte e a fatia em um fluxo ordenado de tokens catalogados.

#### Catálogo Oficial de Tipos de Tokens

```javascript
"IDENTIFIER"      // Nomes de seletores, propriedades brutas ou valores literais
"STRING"          // Cadeia de caracteres capturada entre aspas duplas ou simples
"NUMBER"          // Valores numéricos puros, comprimentos com unidade ou hashes hexadecimais
"VARIABLE"        // Identificadores de variáveis precedidos pelo caractere "@"
"COLON"           // Delimitador de atribuição estrutural ":"
"PAREN_OPEN"      // Delimitador inicial de abertura de bloco ou escopo "("
"PAREN_CLOSE"     // Delimitador final de fechamento de bloco ou escopo ")"
"COMMA"           // Separador posicional de argumentos de funções ","
"AMPERSAND"       // Caractere de ancoragem e concatenação estrita de seletores "&"
"DOT"             // Prefixo identificador de classes CSS "."
"PLUS"            // Operador de combinador adjacente ou adição matemática "+"
"MINUS"           // Operador de hífens textuais ou subtração matemática "-"
"MULTIPLY"        // Operador matemático de multiplicação "*"
"SLASH"           // Operador de caminhos relativos ou divisão matemática "/"
"EQUALS"          // Operador lógico de comparação de strings "==" ou "="
"IMPORT"          // Diretiva modular "@importar"
"THEME"           // Diretiva estrutural de temas "@tema"
"COMPONENT"       // Diretiva estrutural de componentização "@componente"
"ANIMATION"       // Diretiva mestre de keyframes "@animar"
"MEDIA"           // Diretiva de consultas de mídia "@media"
"MIXIN"           // Diretiva de encapsulamento polimórfico "@mixin"
"INCLUDE"         // Diretiva de injeção inline de mixins "@incluir"
"EXTEND"          // Diretiva de herança de seletores puros "@estender"
"CONDITIONAL"     // Diretiva de avaliação lógica em tempo de build "@se"
"LOOP"            // Diretiva de laço multiplicador iterativo "@repetir"
"EOF"             // Sinalizador de fim físico do arquivo (End of File)
```

#### Assinatura do Método Central

```javascript
tokenize() 
  → Token[] // Retorna o array indexado de objetos Token
```

#### Demonstração de Fatiamento Léxico (Mapeamento Interno)

**Código de Entrada SWLS:**
```swls
(button.btn-acao:
  cor branco
)
```

**Resultado na Coleção de Tokens:**
```javascript
[
  { type: "PAREN_OPEN", value: "(", line: 1, column: 1 },
  { type: "IDENTIFIER", value: "button", line: 1, column: 2 },
  { type: "DOT", value: ".", line: 1, column: 8 },
  { type: "IDENTIFIER", value: "btn-acao", line: 1, column: 9 },
  { type: "COLON", value: ":", line: 1, column: 17 },
  { type: "IDENTIFIER", value: "cor", line: 2, column: 3 },
  { type: "IDENTIFIER", value: "branco", line: 2, column: 7 },
  { type: "PAREN_CLOSE", value: ")", line: 3, column: 1 },
  { type: "EOF", value: "", line: 3, column: 2 }
]
```

---

### 3. Classe de Análise Sintática: `Parser`

**Localização:** `lib/parser/index.js`

**Atribuição:** Consome sequencialmente o fluxo de tokens gerando a Árvore Sintática Abstrata (AST) baseada em classes formais de nós.

#### Interface de Métodos da Classe

```javascript
class Parser {
  constructor(source, filename) {
    this.source = source;
    this.filename = filename;
    this.tokenizer = new Tokenizer(source);
    this.tokens = this.tokenizer.tokenize();
    this.pos = 0;
  }

  // Barramentos de Navegação e Consumo do Ponteiro
  current()                    // Retorna o token posicionado no ponteiro atual
  peek(offset)                 // Espia tokens à frente na cauda sem avançar o ponteiro
  advance()                    // Incrementa o ponteiro e gerencia quebras de linha físicas
  expect(type)                 // Consome o token exigindo correspondência estrita de tipo
  match(...types)              // Avalia correspondências flexíveis avançando sob sucesso

  // Sub-rotinas de Processamento Sintático de Nós (AST)
  parse()                      // Ponto de entrada central. Retorna o nó AST.Program
  parseStatement()             // Executa o roteamento inicial de diretivas de raiz
  parseRule()                  // Processa seletores, ampersands, pseudos e regras encadeadas
  parseBlock()                 // Varre recursivamente e distribui nós internos de qualquer bloco
  parseValue()                 // Captura valores complexos tratando espaçamentos e funções CSS
  parsePseudoState()           // Processa pseudo-classes e seletores de atributos puros
  parseComponent()             // Processa declarações de componentes e heranças nativas
  parseTheme()                 // Processa blocos de definição de tema global
  parseAnimation()             // Processa sequências de sub-frames de animações
  parseMedia()                 // Processa consultas de mídia isolando suas regras
  parseMixin()                 // Processa definições de mixins reaproveitáveis
  parseLoop()                  // Processa e extrai laços de repetição @repetir
  parseConditional()           // Processa e extrai estruturas condicionais @se
}
```

#### Tipos de Nós da Árvore Sintática (Classes em `lib/ast.js`)

```javascript
// Program: Nó raiz centralizador
{ type: "Program", metadata: { source: string, timestamp: string }, body: Node[] }

// Rule: Nós de seletores e sub-regras aninhadas
{ type: "Rule", selector: string, properties: Property[], children: Node[], pseudoStates: PseudoState[], line: number }

// Property: Nós de atribuição de estilo CSS
{ type: "Property", name: string, value: string, important: boolean, line: number }

// Variable: Nós de declaração de variáveis locais ou globais
{ type: "Variable", name: string, value: string, line: number }

// Import: Nós de acoplamento modular externo
{ type: "Import", path: string, line: number }

// Component: Nós de classes de componentes com herança profunda
{ type: "Component", name: string, parent: string|null, body: Node[], line: number }

// Theme: Nós de inversão e variáveis de tema em :root
{ type: "Theme", name: string, variables: Variable[], line: number }

// Animation: Nós de keyframes de animação
{ type: "Animation", name: string, frames: Frame[], line: number }

// Frame: Sub-nós posicionais de frames de animação
{ type: "Frame", position: string, properties: Property[], line: number }

// MediaQuery: Nós de consultas responsivas calculated
{ type: "MediaQuery", condition: string, rules: Node[], line: number }

// Conditional: Nós de avaliação lógica @se em tempo de build
{ type: "Conditional", condition: string, thenBranch: Node[], line: number }

// Loop: Nós multiplicadores do laço @repetir
{ type: "Loop", variable: string, iterable: string, body: Node[], line: number }
```

---

### 4. Classe de Análise Estática: `Linter`

**Localização:** `lib/parser/linter.js`

**Atribuição:** Executa a varredura estática da AST em duas passagens independentes, auditando conflitos de escopo léxico e tabelas de símbolos.

#### Assinatura do Método Central

```javascript
lint(ast, globalVariables) 
  → Diagnostic[] // Retorna a coleção de violações de integridade
```

#### Estrutura do Objeto de Ocorrência (`Diagnostic`)
```typescript
{
  severity: "error" | "warning" | "info",
  message: string,
  line: number,
  column: number,
  code: string // Exemplo: "SWLS0020"
}
```

#### Protocolos de Validação Homologados

* **Variáveis Não Declaradas (`SWLS0020`)**: Disparado com gravidade `error` se o analisador detectar que a variável invocada com `@` não foi catalogada na tabela de símbolos locais ou no escopo descendente global do `_gpai.swls`.
* **Propriedades Desconhecidas (`SWLS0010`)**: Disparado com gravidade `warning` se o nome da propriedade digitada não for mapeado pelas chaves do dicionário mestre. O motor adverte o desenvolvedor, mas prossegue gerando o texto fielmente como CSS bruto.
* **Seletores Inválidos (`SWLS0002`)**: Disparado com gravidade `error` se a string do seletor capturada contiver caracteres espúrios como chaves ou pontos-e-vírgulas.
* **Variáveis Vazias (`SWLS0061`)**: Disparado com gravidade `error` se uma variável for inicializada sem nenhum conteúdo ou valor atado.
---

### 5. Classe de Geração de Código: `CSSGenerator`

**Localização:** `lib/generator/index.js`

**Atribuição:** Varre recursivamente a Árvore Sintática Abstrata (AST) validada, resolvendo pilhas de escopos locais, processando as funções calculated e transcrevendo os nós para uma string de texto em CSS nativo.

#### Interface de Métodos da Classe

```javascript
class CSSGenerator {
  constructor() {
    this.css = "";
    this.indent = 0;
    this.variables = {};
    this.astRoot = null;
  }

  // Ponto de Entrada Público
  generate(ast) → string // Transcreve a AST completa e retorna o CSS higienizado

  // Sub-rotinas Privadas de Escrita e Resolução de Nós
  generateNode(node)        // Roteador central que despacha nós para sub-rotinas específicas
  generateRule(node, parentSelector) // Renderiza seletores compostos e aninhamentos
  generateComponent(node)   // Resolve herança profunda e pseudo-estados de componentes
  generateTheme(node)       // Renderiza atributos de temas customizados no :root
  generateAnimation(node)   // Transcreve blocos de animação keyframes para CSS
  generateMedia(node)       // Converte expressões lógicas e renderiza media queries
  generateConditional(node, contextSelector, isInOpenBlock) // Avalia estruturas @se
  generateLoop(node, contextSelector) // Expande os laços multiplicadores @repetir
  generateInclude(node)     // Processa a inclusão de propriedades inline de mixins
  generateExtend(node)      // Injeta propriedades de seletores herdados via @estender
  generatePseudo(pseudo, selector) // Resolve pseudo-classes e pseudos brutos via ampersand
  resolveValue(value)       // Traduz valores, aplica cálculos inline e limpa funções CSS
  saveScope()               // Clona e salva o estado atual da tabela de variáveis locais
  restoreScope(scope)       // Restaura a tabela de variáveis locais ao estado anterior
  write(str)                // Auxiliar de escrita de string aplicando a indentação física
}
```

#### Processo Centralizador de Roteamento
```javascript
generate(ast) {
  this.css = "";
  this.indent = 0;
  this.astRoot = ast;
  
  if (!this.variables) this.variables = {};

  if (ast && ast.body) {
    // Primeira passagem: Preenche a tabela de símbolos de raiz
    ast.body.forEach(node => {
      if (node.type === "Variable") this.variables[node.name] = node.value;
    });

    // Segunda passagem: Despacha cada nó para processamento
    for (const node of ast.body) {
      this.generateNode(node);
    }
  }
  return this.css.trim();
}
```

---

## Assinatura da API Pública Node.js

Para integrações programáticas de ferramentas de automação e esteiras de CI/CD, as classes do núcleo são expostas através do pacote oficial de distribuição.

### Importações Estruturais do Pacote

```javascript
const { Tokenizer, Token } = require("swl-core");
const Parser = require("swl-core/lib/parser");
const CSSGenerator = require("swl-core/lib/generator");
const { Linter, Diagnostic } = require("swl-core/lib/parser/linter");
const Compiler = require("swl-core");
```

### 1. API do Módulo `Compiler`

```javascript
const Compiler = require("swl-core");

// Instanciação parametrizada do compilador
const compiler = new Compiler({
  minify: false,
  sourcemap: false,
  lint: true,
  strict: false,
  projectRoot: process.cwd()
});

// Pipeline 1: Processamento de string textual direta
const result = compiler.compile(codigoFonteBruto, "modulo.swls");

// Pipeline 2: Processamento físico a partir do disco
const resultFile = compiler.compileFile("src/main.swls");

// Interface do objeto retornado pelo barramento
// result = {
//   success: boolean,
//   css: string,
//   diagnostics: Diagnostic[],
//   stats: { lines: number, properties: number, rules: number },
//   error?: string
// }
```

### 2. API do Módulo `Parser`

```javascript
const Parser = require("swl-core/lib/parser");

const parser = new Parser(codigoFonteBruto, "arquivo.swls");
const ast = parser.parse(); // Retorna o nó mestre AST.Program

// Métodos expostos para análise sintática assistida
const tokenAtual = parser.current();
const proximoToken = parser.peek(1);
parser.advance();
```

### 3. API do Módulo `Tokenizer`

```javascript
const { Tokenizer } = require("swl-core/lib/tokenizer");

const tokenizer = new Tokenizer(codigoFonteBruto);
const arrayDeTokens = tokenizer.tokenize(); // Retorna o fluxo Token[]
```

### 4. API do Módulo `Linter`

```javascript
const { Linter } = require("swl-core/lib/parser/linter");

const linter = new Linter();
// Varre a AST cruzando com variáveis globais iniciais extraídas
const diagnostics = linter.lint(ast, globalVariablesMap);
```

### 5. API do Módulo `CSSGenerator`

```javascript
const CSSGenerator = require("swl-core/lib/generator");

const generator = new CSSGenerator();
generator.variables = { ...mapaVariaveisGlobais }; // Injeta escopo inicial
const cssStringResult = generator.generate(ast);
```
---

## Sistema de Tipos e Assinaturas Formais

Abaixo estão descritas as especificações teóricas estruturais dos nós da árvore sintática e do fluxo de tokens do motor Core MX v2.0.0.

### Modelos de Nós da Árvore Sintática (AST Interfaces)

```typescript
type ASTNode = 
  | Program
  | Rule
  | Property
  | Variable
  | Import
  | Component
  | Theme
  | Animation
  | Frame
  | MediaQuery
  | Conditional
  | Loop
  | Include
  | Extend
  | PseudoState

interface Program {
  type: "Program"
  metadata: { source: string; timestamp: string }
  body: ASTNode[]
}

interface Rule {
  type: "Rule"
  selector: string
  properties: Property[]
  children: ASTNode[]
  pseudoStates: PseudoState[]
  line: number
}

interface Property {
  type: "Property"
  name: string
  value: string
  important: boolean
  line: number
}

interface Variable {
  type: "Variable"
  name: string
  value: string
  line: number
}

interface Import {
  type: "Import"
  path: string
  line: number
}

interface Component {
  type: "Component"
  name: string
  parent: string | null
  body: ASTNode[]
  line: number
}

interface Theme {
  type: "Theme"
  name: string
  variables: Variable[]
  line: number
}

interface Animation {
  type: "Animation"
  name: string
  frames: Frame[]
  line: number
}

interface Frame {
  type: "Frame"
  position: string
  properties: Property[]
  line: number
}

interface MediaQuery {
  type: "MediaQuery"
  condition: string
  rules: ASTNode[]
  line: number
}

interface Conditional {
  type: "Conditional"
  condition: string
  thenBranch: ASTNode[]
  line: number
}

interface Loop {
  type: "Loop"
  variable: string
  iterable: string
  body: ASTNode[]
  line: number
}
```

### Estrutura Formal de Tokens

```typescript
type TokenType = 

  | "IDENTIFIER" | "STRING" | "NUMBER" | "VARIABLE" | "COLON" 
  | "PAREN_OPEN" | "PAREN_CLOSE" | "COMMA" | "AMPERSAND" | "DOT" 
  | "PLUS" | "MINUS" | "MULTIPLY" | "SLASH" | "EQUALS" 
  | "IMPORT" | "THEME" | "COMPONENT" | "ANIMATION" | "MEDIA" 
  | "MIXIN" | "INCLUDE" | "EXTEND" | "CONDITIONAL" | "LOOP" | "EOF"

interface Token {
  type: TokenType
  value: string
  line: number
  column: number
}
```

---

## Análise Léxica (Tokenizer System)

### Fluxo de Transição do Autômato Léxico

```text
Entrada Físia: "(button.btn-acao: fundo azul)"

    ┌─ PAREN_OPEN:  "("
    ├─ IDENTIFIER:  "button"
    ├─ DOT:         "."
    ├─ IDENTIFIER:  "btn-acao"
    ├─ COLON:       ":"
    ├─ IDENTIFIER:  "fundo"
    ├─ IDENTIFIER:  "azul"
    ├─ PAREN_CLOSE: ")"
    └─ EOF:         ""
```

### Expressões Regulares de Captura de Caracteres

O fatiamento consome strings brutas aplicando correspondências lógicas controladas por loops de ponteiro:

* **Unidades e Cores Hexadecimais**: `/#[0-9a-fA-F]{3,8}/` ou `/^[0-9]+(px|rem|em|%|vh|vw|deg|ms|s)?/`
* **Identificadores e Propriedades**: `/^[\w\-\.]+/` com suporte a travas de path de URL.
* **Cadeias de Texto em Aspas**: `/"[^"]*"|'[^']*'/` gerenciando escapes físicos de aspas.
* **Diretivas Especiais e Variáveis**: `/^@[\w\-@]+/` cruzando com o dicionário de chaves do núcleo.

---

## Análise Sintática (Parser Engine)

### Especificação de Gramática LL(1) Simplificada (MX v2.0.0)

```text
program      := statement* EOF
statement    := import | theme | animation | component | mixin | variable | rule
import       := 'IMPORT' STRING
variable     := 'VARIABLE' 'COLON' value
rule         := 'PAREN_OPEN' selector 'COLON' blockNodes* 'PAREN_CLOSE'
selector     := (IDENTIFIER | DOT | AMPERSAND | PLUS | MULTIPLY)+
value        := (IDENTIFIER | STRING | NUMBER | VARIABLE | PAREN_OPEN | PAREN_CLOSE | COMMA)+
```

### Demonstração do Algoritmo de Análise Descendente Recursiva

```javascript
// Amostragem lógica baseada nas sub-rotinas do lib/parser/index.js
parse() {
  const program = new AST.Program();
  
  while (this.current() && this.current().type !== "EOF") {
    if (this.current().type === "IDENTIFIER" && !this.current().value.trim()) {
      this.advance();
      continue;
    }
    const stmt = this.parseStatement();
    if (stmt) program.body.push(stmt);
  }
  return program;
}

parseRule() {
  this.expect("PAREN_OPEN");
  let selector = "";
  const startToken = this.current();
  
  while (this.current() && this.current().type !== "COLON" && this.current().type !== "EOF") {
    selector += this.current().value;
    this.advance();
  }
  this.expect("COLON");
  
  const rule = new AST.Rule(selector.trim());
  rule.line = startToken ? startToken.line : 0;
  
  const blockNodes = this.parseBlock();
  blockNodes.forEach(node => {
    if (node.type === "Property" || node.type === "Variable") rule.properties.push(node);
    else if (node.type === "PseudoState") rule.pseudoStates.push(node);
    else rule.children.push(node);
  });
  
  this.expect("PAREN_CLOSE");
  return rule;
}
```

---

## Barramento de Validação e Análise Estática (Linter)

### Matriz de Diagnósticos Homologada

```javascript
// Códigos Oficiais de Rastreabilidade Estrutural
"SWLS0001"    // Erro Crítico: Seletor vazio ou ausente
"SWLS0002"    // Erro Crítico: Seletor contendo caracteres inválidos (chaves ou pontos-e-vírgulas)
"SWLS0010"    // Alerta Local: Propriedade desconhecida (gerada fielmente como CSS bruto)
"SWLS0020"    // Erro Crítico: Variável invocada não foi declarada na tabela de símbolos
"SWLS0030"    // Info: Recomendação de uso da flag nativa '!importante'
"SWLS0040"    // Alerta Local: Pseudo-classe desconhecida pelo dicionário mestre
"SWLS0050"    // Erro Crítico: Vínculo de herança apontando para componente pai inexistente
"SWLS0061"    // Erro Crítico: Inicialização de variável vazia ou sem valor atado
```

### Regras Estritas de Auditoria de Símbolos

#### 1. Consistência de Variáveis e Escopo Léxico
```javascript
// O linter dispara erro se a variável não existir na tabela de símbolos locais ou globais
(div.HUD-card:
  cor @cor-fantasma // Aciona erro SWLS0020 de forma imediata no barramento
)
```

#### 2. Compatibilidade Semântica de Propriedades
```swls
(div.HUD-card:
  largura-falsa 100% // Aciona warning SWLS0010. O build prossegue injetando a linha bruta.
)
```
---

#### 3. Compatibilidade Semântica de Valores e Cores
O linter realiza o cruzamento de strings literais com o array `VALID_VALUES` contido no dicionário mestre. Se o token de preenchimento corresponder a uma cor no padrão hexadecimal ou funções nativas (`rgb`, `rgba`), a linha é validada pelo barramento:
```swls
// Exemplos validados pelo analisador estático
(div.HUD-bloco:
  exibicao bloco
  cor #ffffff
  fundo rgba(0, 0, 0, 0.5)
)
```

#### 4. Controle de Teto de Aninhamento (Nesting Depth)
O motor MX v2.0.0 estabelece o limite recomendado de até 3 níveis de profundidade de acoplamento de seletores para garantir a performance de renderização das regras.
```swls
// Acoplamento dentro do limite recomendado: Validação Nominal
(a: (b: (c: // Nível 3: OK ) ) )

// Acoplamento excedendo o limite recomendado: Alerta SWLS0010 acionado
(a: (b: (c: (d: // Nível 4: Emite advertência de profundidade ) ) ) )
```

---

## Engenharia do Gerador de Código (Generator Engine)

### Algoritmo Centralizador de Geração (Fase Final)

O método mestre `generate` da classe `CSSGenerator` varre a AST processando regras estruturais, condicionais, loops e componentes de forma sequencial através de um barramento síncrono.

```javascript
// Amostragem lógica da esteira contida no lib/generator/index.js
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

  if (temPropriedadesDiretas) {
    this.write(`${currentSelector} {\n`);
    this.indent++;
    if (node.properties) {
      node.properties.forEach(prop => this.generateProperty(prop));
    }
    this.indent--;
    this.write(`}\n\n`);
  }

  // Renderização externa segura: Processa sub-regras fechando o bloco pai antes
  if (node.children) {
    node.children.forEach(child => {
      if (child.type === "Rule") this.generateRule(child, currentSelector);
    });
  }
  this.restoreScope(previousScope);
}
```

### Otimizações do Pipeline de Transcrição

#### 1. Resolução Dinâmica de Escopo de Variáveis
As substituições textuais de variáveis ocorrem de forma direta. O interpretador busca o token na tabela de símbolos locais. Caso o identificador contenha o prefixo `@`, a regex varre a esteira injetando o conteúdo resolvido:
```swls
// Entrada no código fonte:
@cor-primaria: #2563eb
cor @cor-primaria

// Transcrição final gerada na string de saída:
color: #2563eb;
```

#### 2. Mapeamento de Propriedades e Valores
O motor consulta os mapas indexados exportados pelo dicionário unificado, convertendo strings literais (como `fundo` -> `background-color`, `centro` -> `center`, `ponteiro` -> `pointer`) e executando a faxina de espaçamentos em funções nativas coladas (`calc(`, `rgba(`).

---

## Subsistema de Resolução de Importações e Módulos

### Pipeline de Expansão de Árvores Sintáticas

O orquestrador processa a inclusão de dependências em segundo plano. Quando um nó do tipo `Import` é interceptado, o compilador lê o arquivo complementar de forma isolada, gera uma subárvore AST secundária e a acopla diretamente no índice da árvore mestre utilizando manipulação de arrays por mutação posicional estrita:

```text
Evolução da Topologia de Módulos (Árvore Expandida):
main.swls
└── @importar "./componentes.swls"
    ├── @importar "./botao.swls"
    └── @importar "./formulario.swls"
```

### Mecanismo de Detecção de Ciclos e Duplicações

```javascript
// Implementação baseada na esteira síncrona do lib/compiler.js
processImports(ast, filename) {
  const dir = path.dirname(filename);
  if (!ast || !ast.body) return;
  
  const imports = ast.body.filter(n => n.type === "Import");

  for (const imp of imports) {
    const importPath = path.resolve(dir, imp.path);
    if (!fs.existsSync(importPath)) {
      throw new Error(`Arquivo importado não encontrado: ${imp.path}`);
    }

    // Estratégia de Trava Léxica: Evita duplicações e loops infinitos
    if (this.loadedFiles.has(importPath)) continue; 
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
```

### Resolução de Caminhos Relativos
Os caminhos físicos de inclusão são resolvidos de forma estrita tomando como base o diretório físico do módulo que disparou a chamada da diretiva `@importar`, permitindo navegações de diretórios complexas (`./`, `../`).

---

## Políticas de Captura e Tratamento de Exceções

### Tipos de Erros Mapeados no Sistema

* **Erros Léxicos (Tokenizer)**: Disparados quando strings textuais contendo aspas não terminadas ou quebras físicas de linha corrompem a leitura de tokens (`Unterminated string at line X:Y`).
* **Erros Sintáticos (Parser)**: Disparados quando a ordem geométrica dos tokens viola as regras da gramática formal estabelecida pelo compilador (`Expected PAREN_CLOSE, got IDENTIFIER at line X`).
* **Erros de Validação Estática (Linter)**: Disparados quando referências cruzadas ou pilhas locais encontram termos órfãos na tabela de símbolos (`Variável '@cor' não definida`).
* **Erros de Sistema (Compiler)**: Disparados por falhas de infraestrutura física de leitura de disco ou caminhos de módulos inválidos (`Arquivo importado não encontrado`).

### Gestão Contida da Pilha de Exceções (Error Stack)
```javascript
try {
  const compiler = new Compiler();
  const result = compiler.compile(sourceCode, filename);
  if (!result.success) throw new Error(result.error);
} catch (err) {
  process.stderr.write(`[FALHA CRÍTICA DE PIPELINE]: ${err.message}\n`);
  process.exit(1);
}
```

---

## Critérios de Extensibilidade e Desempenho

### Sobrescrita Estrutural do Módulo Compiler

A arquitetura orientada a objetos orienta a extensibilidade do núcleo através do encapsulamento de heranças diretas da classe base, permitindo acoplar microsserviços de pré e pós-processamento de strings sem corromper a esteira síncrona central:

```javascript
class CustomCompiler extends Compiler {
  constructor(options) {
    super(options);
  }
  
  // Sobrescrita do pipeline de compilação
  compile(source, filename) {
    const processedSource = this.customPreprocessor(source);
    const result = super.compile(processedSource, filename);
    result.css = this.customPostprocessor(result.css);
    return result;
  }
}
```
### 2. Customização do Módulo Generator

A arquitetura orientada a objetos do gerador permite a criação de variantes de compilação customizadas por meio da extensão direta das classes do núcleo, possibilitando a modificação de sub-rotinas de escrita sem alterar o motor síncrono principal:

```javascript
class CustomGenerator extends CSSGenerator {
  // Sobrescrita da sub-rotina de renderização de seletores
  generateRule(node, parentSelector = "") {
    // Implementação de lógica customizada de interceptação
    return super.generateRule(node, parentSelector);
  }
}
```

---

## Avaliação de Desempenho (Performance)

### Diretrizes de Otimização Implementadas no Núcleo

* **Persistência do Fluxo de Tokens**: A varredura de caracteres e o fatiamento léxico pelo `Tokenizer` ocorrem uma única vez por módulo. O array resultante de tokens é persistido em memória e reutilizado nas fases subsequentes.
* **Análise Sintática em Passagem Única (Single-Pass Parsing)**: O `Parser` consome a coleção de tokens sequencialmente através do avanço do ponteiro, estruturando a Árvore Sintática Abstrata (AST) sem a necessidade de varreduras redundantes.
* **Resolução Tardia de Variáveis (Lazy Resolution)**: A substituição de variáveis e o cálculo de expressões matemáticas inline são postergados para a fase final do `Generator`, eliminando o overhead de processamento durante a montagem da árvore sintática.

### Métricas de Latência (Benchmarks)

As medições de tempo de processamento do pipeline síncrono mantêm-se estáveis sob os seguintes limites operacionais:

```text
Compilação de Módulo Unitário Isolado : ~5ms
Compilação com Resolução de Imports     : ~15ms
Build Completo de Escopo de Projeto     : ~50ms
```

---

## Estrutura para Testes e Integração Contínua (CI)

A modularidade das classes expostas pela API pública permite acoplar o compilador diretamente a executores de testes unitários (como Jest ou Mocha) para auditoria automatizada de regressão sintática:

```javascript
// Amostragem de suíte de testes automatizados para validação do pipeline
describe("Suíte de Validação Sintática do Compilador SWLS", () => {
  it("Deve transcrever propriedades do dicionário semântico e parear parênteses", () => {
    const source = "(button.btn-acao: cor branco)";
    const result = compiler.compile(source, "teste.swls");
    
    expect(result.success).toBe(true);
    expect(result.css).toContain("color: white;");
  });
});
```

---

## Conclusão de Engenharia do Sistema

O ecossistema SWLS Core MX consolida-se como uma infraestrutura de software de alta confiabilidade para engenharia de estilos, assegurando um pipeline previsível com separação estrita de responsabilidades entre análise léxica, sintática, validação estática e geração de código.

Para especificações complementares de operação, consulte os módulos:
* `README.md` — Guia principal de uso e comandos da CLI.
* `MANUAL_ESTUDO.md` — Tutorial progressivo de padrões e boas práticas.

---

Documentação Técnica do Núcleo • Assinaturas e Arquitetura de Software • MIT License • v2.0.0

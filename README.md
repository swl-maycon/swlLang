# Stellar Web Language Styling (SWLS) — Core MX v2.0.4

Mecanismo declarativo de compilação e estilização modular de alto desempenho, projetado para o processamento otimizado de arquiteturas de folhas de estilo modernas. O SWLS Core MX elimina a necessidade de chaves e delimitadores de fim de linha, introduzindo escopo léxico isolado profundo, avaliação condicional em tempo de compilação, loops expansíveis baseados em iteração matemática e gerenciamento nativo de componentes com herança estrutural.

[![NPM Version](https://shields.io)](https://www.npmjs.com/package/swl-core)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org)

---

## Visão Geral

O SWLS Core MX é um compilador avançado de folhas de estilo que implementa uma linguagem de estilo intuitiva em português, oferecendo:

* **Sintaxe Declarativa Base**: Código em português mais inteligível, legível e de rápida assimilação.
* **Compilação Eficiente**: Geração síncrona otimizada de folhas de estilo no padrão W3C CSS.
* **Análise Estática Integrada (Linter)**: Validação automática de escopos locais e tabelas de símbolos em duas passagens.
* **Arquitetura Modular**: Suporte completo a importações de múltiplos arquivos físicos acoplados de forma isolada.
* **Monitoramento Automatizado**: Barramento de watcher em segundo plano para recompilação instantânea de arquivos.
* **Isolamento de Escopo**: Gerenciamento estrito de pilhas de variáveis e símbolos locais que previnem vazamentos.

---

## Diretrizes de Instalação e Inicialização

### Instalação

```bash
# Instalação global do pacote de produção via NPM
npm install swl-core -g

# Instalação local atada às dependências de desenvolvimento do projeto
npm install swl-core --save-dev
```

**Requisitos Mínimos:**
* Runtime Node.js igual ou superior à versão 16.x
* Gerenciador npm igual ou superior à versão 7.x

### Inicialização Rápida de Projetos

```bash
# 1. Inicializar o escopo de controle local do projeto
node cli/swls.js init

# 2. Ativar o barramento de monitoramento contínuo em segundo plano
node cli/swls.js watch
```

O comando de inicialização gera automaticamente as seguintes estruturas de controle de distribuição:

```text
projeto-escopo/
├── _gpai.swls          # Índice invisível global para tabela de símbolos
├── swls.config.json    # Manifesto de especificações de build do compilador
└── estilos.swls        # Arquivo fonte de desenvolvimento de regras
```

---

## Catálogo de Sintaxe Oficial (MX v2.0.4)

### 1. Declaração de Variáveis Globais (Índice `_gpai.swls`)

```swls
// Identificadores Cromáticos e Espaciais
@cor-primaria: #2563eb
@cor-secundaria: #f59e0b
@espacamento-base: 8px
@fonte-principal: "Segoe UI", sans-serif

// Parâmetros de Breakpoints Responsivos
@breakpoint-mobile: 640px
@breakpoint-tablet: 1024px
```

### 2. Regras Sintáticas Simples

```swls
(body:
  familia @fonte-principal
  fundo #ffffff
  margem 0
  padding 0
)
```

### 3. Seletores Aninhados (Nesting)

```swls
(nav.menu-principal:
  fundo @cor-primaria
  padding 1rem
  
  (a.link-item:
    cor branco
    padding (0.5rem, 1rem)
    decoracao nenhum
    
    &:pairado (
      fundo @cor-secundaria
    )
  )
)
```

### 4. Pseudo-classes e Pseudo-elementos Estruturais

```swls
(button.btn-acao:
  fundo @cor-primaria
  cor branco
  
  &:pairado (
    fundo #1d4ed8
    cursor ponteiro
  )
  
  &:ativo (
    transformacao scale(0.98)
  )
  
  &:antes (
    conteudo "→"
    margem-direita 0.5rem
  )
)
```

### 5. Consultas de Mídia Integradas

```swls
(#container-HUD:
  largura 1200px
  
  @media screen e (max-largura: 1024px) (
    (#container-HUD:
      largura 100%
      padding 1rem
    )
  )
)
```

### 6. Estruturas de Animações (@animar Keyframes)

```swls
@animar deslizar (
  de:
    transformacao translateX(-100%)
  para:
    transformacao translateX(0)
)

(div.hud-alerta:
  animar deslizar 0.3s ease-in-out
)
```

### 7. Importações de Módulos Modulares

```swls
// Arquivo principal: estilos.swls
@importar "./layout/grid.swls"
@importar "./componentes/botoes.swls"

// Nota: O compilador absorve nativamente as variáveis globais do _gpai.swls.
```

---

## Interface de Linha de Comando (CLI)

### Diretivas de Compilação

```bash
# Compilar o escopo do projeto inteiro baseado no manifesto local
node cli/swls.js build

# Compilar um arquivo modular unitário
node cli/swls.js build estilos.swls

# Compilar forçando a gravação em um caminho físico customizado de saída
node cli/swls.js build estilos.swls -o saida/styles.css
```

### Monitoramento Contínuo

```bash
# Inicia o watcher automático para escuta de alterações de arquivos
node cli/swls.js watch

# Inicia o watcher direcionando o build para uma saída física específica
node cli/swls.js watch -o saida/styles.css
```

### Validação Estática

```bash
# Executa o analisador estático imprimindo o relatório de erros de escopo
node cli/swls.js lint

# Executa o build ativando o modo estrito (Warnings tornam-se erros fatais)
node cli/swls.js build estilos.swls --strict
```

### Rotinas de Diagnóstico

```bash
# Executa verificações de permissões e integridade do ecossistema local
node cli/swls.js doctor

# Exibe a versão ativa do compilador
node cli/swls.js version

# Imprime o painel explicativo completo de ajuda da CLI
node cli/swls.js --help
```
---

## Consumo do Compilador Programaticamente (Módulo Node.js)

### 1. Processamento de Strings Textuais Diretas

```javascript
const Compiler = require("swl-core");

const compiler = new Compiler({
  minify: false,
  sourcemap: false,
  lint: true,
  strict: false
});

const source = `
(body:
  fundo #ffffff
)
`;

const result = compiler.compile(source, "estilos.swls");

if (result.success) {
  console.log(result.css);         // Retorna a string CSS gerada
  console.log(result.stats);       // Imprime estatísticas de build
  console.log(result.diagnostics); // Imprime a coleção de validações
} else {
  console.error(result.error);
}
```

### 2. Processamento Físico via Sistema de Arquivos

```javascript
const Compiler = require("swl-core");

const compiler = new Compiler({
  projectRoot: process.cwd()
});

const result = compiler.compileFile("estilos.swls");
```

### 3. Instanciação e Uso Isolado de Subsistemas

```javascript
const { Tokenizer } = require("swl-core/lib/tokenizer");
const Parser = require("swl-core/lib/parser");
const { Linter } = require("swl-core/lib/parser/linter");
const CSSGenerator = require("swl-core/lib/generator");

// Fase 1: Análise Léxica (Fatiamento)
const tokenizer = new Tokenizer(source);
const tokens = tokenizer.tokenize();

// Fase 2: Análise Sintática (Montagem da AST)
const parser = new Parser(source, "arquivo.swls");
const ast = parser.parse();

// Fase 3: Validação Estática (Auditoria de Símbolos)
const linter = new Linter();
const diagnostics = linter.lint(ast, mapaVariaveisGlobais);

// Fase 4: Geração de Código (Transcrição Final)
const generator = new CSSGenerator();
const css = generator.generate(ast);
```

---

## Parâmetros de Instanciação do Compilador

```javascript
const options = {
  minify: false,             // Compactação programática da string CSS
  sourcemap: false,          // Geração de mapas de origem para depuração
  lint: true,                // Acionamento automático do analisador estático
  strict: false,             // Conversão de warnings linter em erros fatais
  projectRoot: process.cwd() // Diretório de trabalho padrão do interpretador
};

const compiler = new Compiler(options);
```

---

## Topologia de Pastas e Distribuição Pura

```text
swls-ecosystem/
├── swls-core-mx/               # Diretório do compilador e utilitários de CLI
│   ├── cli/
│   │   ├── project-manager.js # Controlador central de automação (build/init/watch)
│   │   └── swls.js            # Ponto de entrada da CLI e renderização ANSI
│   ├── lib/
│   │   ├── parser/            # Componentes do analisador sintático, linter e dicionário
│   │   ├── generator/         # Motor de geração de código e faxina de strings CSS
│   │   ├── tokenizer/         # Tokenizer léxico e controle de caracteres de escape
│   │   ├── ast.js             # Modelagem formal dos nós da árvore sintática abstrata
│   │   └── compiler.js        # Orquestrador do pipeline de compilação e resolução de imports
│   └── package.json           # Manifesto de dependências do Node.js
│
└── vscode-extension/          # Diretório isolado da extensão oficial do editor
    ├── icons/                 # Temas visuais e logotipos associados à extensão
    ├── snippets/              # Modelos de expansion de código e preenchimento automático
    ├── src/                   # Provedor do IntelliSense e save-listener do editor
    ├── syntaxes/              # Gramática TextMate para realce de sintaxe atualizado
    ├── language-configuration.json # Configuração de auto-fechamento e comportamento do ENTER
    └── package.json           # Manifesto de registro da extensão na versão 2.0.0
```

---

## Especificações Avançadas de Controle: `swls.config.json`

O arquivo gerado na raiz do projeto encapsula as opções de leitura e escrita consumidas de forma síncrona pela CLI:

```json
{
  "entrada": "./src/main.swls",
  "saida": "./dist/estilos.css",
  "lint": true,
  "minify": false,
  "sourcemap": false,
  "watched": ["**/*.swls"]
}
```

---

## Demonstração de Componentes e Estruturas Práticas

### 1. Modelagem Básica de Componente de Botão

```swls
// Módulo: componentes/botao.swls

@pad-pequeno: 8px
@pad-medio: 12px
@pad-grande: 16px

(button.btn-acao:
  borda-raio 4px
  borda nenhum
  cursor ponteiro
  transicao all 0.2s ease
  
  (&.pequeno:
    padding @pad-pequeno
    tamanho 12px
  )
  
  (&.medio:
    padding @pad-medio
    tamanho 14px
  )
  
  (&.grande:
    padding @pad-grande
    tamanho 16px
  )
  
  (&.primario:
    fundo #2563eb
    cor branco
    
    &:pairado (
      fundo #1d4ed8
    )
  )
  
  (&.secundario:
    fundo #e5e7eb
    cor #111827
    
    &:pairado (
      fundo #d1d5db
    )
  )
)
```

### 2. Configuração de Grade Responsiva (Grid CSS)

```swls
// Módulo: layouts/grid.swls

(.grid-container:
  exibicao grid
  coluna-gap 1rem
  linha-gap 1rem
  colunas repetir(3, 1fr)
  
  @media screen e (max-largura: 768px) (
    (.grid-container:
      colunas repetir(2, 1fr)
    )
  )
  
  @media screen e (max-largura: 480px) (
    (.grid-container:
      colunas 1fr
    )
  )
  
  (div.grid-item:
    fundo #f3f4f6
    padding 1rem
    borda-raio 8px
  )
)
```

### 3. Índice de Design System Baseado em Tema

```swls
// Módulo Global: src/_gpai.swls

// Definições Cromáticas de Paleta
@cor-primaria: #2563eb
@cor-secundaria: #f59e0b
@cor-sucesso: #10b981
@cor-erro: #ef4444
@cor-aviso: #f59e0b

// Padrões de Tipografia
@fonte-principal: "Inter", -apple-system, sans-serif
@fonte-mono: "Fira Code", monospace

// Parâmetros de Malha de Espaçamento
@espaco-xs: 4px
@espaco-sm: 8px
@espaco-md: 16px
@espaco-lg: 24px
@espaco-xl: 32px

// Escala de Breakpoints Responsivos
@bp-mobile: 480px
@bp-tablet: 768px
@bp-desktop: 1024px
@bp-wide: 1280px
```

---

## Assinatura das Classes da API Pública

### Módulo: `Compiler`
```javascript
new Compiler(options)
  .compile(source, filename)      // Processa string bruta → Retorna objeto de build
  .compileFile(filepath)          // Processa arquivo físico → Retorna objeto de build
```

### Módulo: `Parser`
```javascript
new Parser(source, filename)
  .parse()                        // Analisa os tokens → Retorna o nó AST.Program
```

### Módulo: `Tokenizer`
```javascript
new Tokenizer(source)
  .tokenize()                     // Fatiamento léxico → Retorna a coleção Token[]
```

### Módulo: `Linter`
```javascript
new Linter()
  .lint(ast, globalVariables)     // Varre a AST → Retorna as ocorrências Diagnostic[]
```

### Módulo: `CSSGenerator`
```javascript
new CSSGenerator()
  .generate(ast)                  // Transcreve a AST → Retorna a string textual CSS
```

---

## Barramento de Análise Estática e Diagnósticos

O analisador estático (Linter) intercepta automaticamente em tempo de design:
* Identificadores de variáveis não declarados ou órfãos no escopo.
* Grafia de propriedades desconhecidas em desacordo com o dicionário mestre.
* Quebras geométricas em delimitadores de blocos e seletores malformados.
* Excesso de profundidade de aninhamento ultrapassando o limite técnico recomendado.
* Referências cíclicas e loops de importações cruzadas de arquivos.

### Modelo de Instanciação do Objeto de Ocorrência
```javascript
{
  file: "estilos.swls",
  line: 12,
  column: 5,
  severity: "error",
  message: "Variável '@cor' não definida",
  code: "SWLS0020"
}
```
---

## Estrutura do Objeto de Estatísticas (Stats Object)

Após a conclusão bem-sucedida do pipeline de compilação, o barramento expõe o objeto contendo as métricas coletadas do arquivo processado:

```javascript
result.stats = {
  lines: 145,          // Total de linhas físicas do arquivo fonte lido
  properties: 42,      // Quantidade total de propriedades CSS geradas
  rules: 18            // Densidade de regras e seletores CSS mapeados
}
```

---

## Integração com o Editor (Visual Studio Code)

### Instalação da Extensão Oficial

O plugin pode ser ativado diretamente pelo painel de extensões do editor buscando por `Stellar Web Language Styling (SWLS) Tools`, ou de forma automatizada invocando o identificador oficial no console do sistema:

```bash
code --install-extension swl-maycon-developer.swls-language-support
```

### Recursos Avançados do Plugin

* **Realce de Sintaxe (Syntax Highlighting)**: Baseado em gramática TextMate Grammar otimizada para a especificação MX.
* **Modelos de Expansão (Snippets)**: Blocos simétricos estruturados para preenchimento rápido de diretivas lógicas.
* **Autocompletar Inteligente**: Sugestões contextuais de propriedades e valores em português.
* **Diagnósticos em Tempo Real**: Monitoramento e validação estática de escopo em segundo plano.
* **Documentação Instantânea (Hover)**: Painel flutuante exibindo as traduções semânticas para o CSS.

**Prefixos de Snippets Homologados:**
* `regra` ou `(` ── Injeta uma nova regra sintática CSS envelopada.
* `var` ── Injeta o esqueleto de declaração de variável.
* `@import` ── Injeta a diretiva modular de importação.
* `media` ── Injeta a estrutura de consultas de mídia responsivas.
* `keyframes` ── Injeta a assinatura mestre de uma animação @animar.
* `pseudo` ── Injeta a ancoragem para pseudo-classes combinadas.

---

## Resoluções de Comportamentos Inesperados (Troubleshooting)

### Falha: "Arquivo importado nao encontrado"
```text
Error: Arquivo importado não encontrado: ./variaveis.swls
```
* **Diretriz de Correção**: Valide a precisão gramatical do caminho relativo informado, certifique-se de incluir a extensão obrigatória `.swls` e confirme se a grafia de pastas e arquivos respeita o padrão *case-sensitive* do sistema operacional.

### Falha: "Variavel nao definida"
```text
Error: Variável '@cor-primaria' não foi declarada
```
* **Diretriz de Correção**: Certifique-se de que o identificador está devidamente registrado na tabela de símbolos local ou contido no escopo descendente do arquivo global `_gpai.swls`. Utilize o validador `node cli/swls.js lint` para auditar a árvore.

### Falha: Latência excessiva no tempo de build
* **Diretriz de Correção**: Reduza a profundidade do aninhamento de seletores (nesting) ao teto recomendado de 3 níveis, fragmente folhas de estilo massivas em pequenos arquivos modulares acoplados e utilize o comando `node cli/swls.js doctor` para diagnosticar restrições de permissão de disco.

---

## Fontes Complementares de Referência

| Canal Eletrônico | Endereço Oficial de Acesso |
| :--- | :--- |
| **Pacote NPM Oficial** | [swl-core no NPM](https://www.npmjs.com/package/swl-core) |
| **Extensão VS Code Marketplace** | [SWLS Language Support](https://marketplace.visualstudio.com/items?itemName=swl-maycon-developer.swls-language-support) |
| **Repositório GitHub Mestre** | [swlLang](https://github.com/swl-maycon/swlLang) |
| **Manual de Aprendizado** | [MANUAL_ESTUDO.md](docs/MANUAL_ESTUDO.md) |
| **Especificação Arquitetural** | [DOCUMENTACAO_TECNICA.md](docs/DOCUMENTACAO_TECNICA.md) |

---

## Governança e Contribuição

O fluxo de contribuições para o motor segue o protocolo estruturado de gerenciamento de repositórios de código aberto:

1. Execute o Fork do repositório mestre oficial.
2. Inicialize uma branch de trabalho isolada para sua funcionalidade (`git checkout -b feature/AmazingFeature`).
3. Registre seus commits com descrições técnicas claras e impessoais (`git commit -m 'Add some AmazingFeature'`).
4. Execute o push do escopo para a sua branch correspondente (`git push origin feature/AmazingFeature`).
5. Abra um Pull Request detalhando as alterações para auditoria da engenharia do núcleo.

---

## Licenciamento

Este software está distribuído e homologado sob as diretrizes e permissões da licença **MIT**. Veja o arquivo descritivo de licença para maiores detalhes.

---

## Governança do Autor

**Maycon Developer**
* Perfil Principal GitHub: [@swl-maycon](https://github.com/swl-maycon)
* Código Fonte do Repositório: [swlLang](https://github.com/swl-maycon/swlLang)

---

## Agradecimentos

Agradecimentos técnicos dedicados à comunidade de desenvolvedores e colaboradores que dão suporte à evolução contínua da especificação Core MX.

---

Documentação em Vernáculo Português • Todos os Direitos Reservados • MIT License • v2.0.0

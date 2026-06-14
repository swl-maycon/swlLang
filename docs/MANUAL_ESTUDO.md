# Manual de Treinamento e Estudo Prático — SWLS Core MX v2.0.4

Guia estruturado para capacitação e aprendizado profissional da linguagem SWLS.

---

## Índice Temático

1. Introdução e Comparações
2. Fundamentos e Infraestrutura Local
3. Conceitos Estruturais Fundamentais
4. Catálogo de Especificação Sintática
5. Padrões Arquiteturais Avançados
6. Diretrizes de Engenharia e Otimização de Escrita
7. Boas Práticas Profissionais de Estilização
8. Cenários Práticos de Fixação
9. Tabela de Referência Rápida

---

## Introdução e Comparações

### O que é a Linguagem SWLS?

Stellar Web Language Styling (SWLS) é um mecanismo declarativo de compilação e estilização de folhas de estilo que oferece:

* Sintaxe intuitiva baseada em vernáculo português traduzido para W3C CSS.
* Pipeline estável de compilação compatível com a totalidade dos navegadores do mercado.
* Módulo validador estático (Linter) integrado para detecção precoce de erros de escopo.
* Suporte robusto a persistência de variáveis, heranças e arquitetura modular de arquivos.

### Análise Comparativa: SWLS vs CSS Tradicional

**CSS Tradicional NAtivo:**
```css
.btn-acao {
  background-color: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.btn-acao:hover {
  background-color: #1d4ed8;
}
```

**Sintaxe SWLS Equivalente (MX v2.0.0):**
```swls
(button.btn-acao:
  fundo #2563eb
  cor branco
  padding (8px, 16px)
  borda-raio 4px
  transicao background-color 0.2s ease
  
  &:pairado (
    fundo #1d4ed8
  )
)
```

### Matriz de Diferenciais Técnicos

| Diferencial | Descrição Operacional |
| :--- | :--- |
| **Acessibilidade Linguística** | Propriedades e valores em português, agilizando o entendimento do layout. |
| **Aninhamento Nativo** | Estruturação hierárquica baseada em blocos, eliminando redundâncias de seletores. |
| **Persistência de Símbolos** | Centralização e reutilização de tokens cromáticos e espaciais via variáveis. |
| **Modularidade Isolada** | Fragmentação do código de design em múltiplos arquivos acoplados com caminhos isolados. |
| **Barramento de Validação** | Captura automática de seletores corrompidos ou referências órfãs antes do build final. |

---

## Fundamentos e Infraestrutura Local

### Requisitos Mínimos de Ambiente

* Compreensão conceitual básica das propriedades de layout estabelecidas pelo CSS nativo.
* Domínio na manipulação e aplicação de seletores (tags, classes, identificadores e atributos).
* Runtime Node.js instalado em versão igual ou superior à 16.x.

### Instalação e Configuração Passo a Passo

**Etapa 1: Auditoria de Versões do Ecossistema Local**
Abra o seu terminal de comandos e certifique-se de que os pacotes de runtime estão instalados corretamente:
```bash
node --version
npm --version
```

**Etapa 2: Instalação Global do Pacote Compilador**
Instale os binários de distribuição oficial diretamente através do gerenciador de pacotes NPM:
```bash
npm install swl-core -g
```

**Etapa 3: Verificação de Integridade dos Binários**
Rode os validadores para testar as assinaturas do compilador e avaliar as permissões de diretórios locais:
```bash
node cli/swls.js version
node cli/swls.js doctor
```

**Etapa 4: Inicialização do Escopo de Controle do Projeto**
Navegue até a pasta raiz do seu software e dispare o inicializador nativo para criar as estruturas bases:
```bash
mkdir meu-projeto-swls
cd meu-projeto-swls
node cli/swls.js init
```

### Topologia Inicial de um Projeto de Produção

```text
meu-projeto/
├── _gpai.swls           # Índice invisível global para tabela de símbolos
├── swls.config.json     # Arquivo de especificações operacionais de build
├── estilos.swls         # Arquivo fonte de desenvolvimento principal
└── estilos.css          # Código transscrito CSS nativo resultante (gerado)
```

---

## Conceitos Estruturais Fundamentais

### 1. Seletores Simples e Tradução Semântica

#### Seletor de Tag (Elemento)
Os seletores de tag mapeiam os elementos estruturais do HTML. O gerador intercepta a regra e transcreve o nome da tag fielmente para o padrão internacional:
```swls
(p:
  cor #333333
  tamanho 16px
  altura-linha 1.6
)
```
**CSS Nativo Resultante:**
```css
p {
  color: #333333;
  font-size: 16px;
  line-height: 1.6;
}
```

#### Seletor de Classe
Utilizado para capturar agrupamentos específicos de elementos utilizando o prefixo composto de ponto `.`:
```swls
(.destaque-conteudo:
  fundo #fffacd
  peso bold
)
```

#### Seletor de Identificador (ID)
Utilizado para capturar referências únicas e exclusivas através do prefixo de hash `#`:
```swls
(#container-HUD:
  largura 1200px
  margem (0, auto)
)
```

#### Seletor de Atributo
Permite isolar regras com base em propriedades customizadas ou nativas embutidas nas tags através de colchetes `[]`:
```swls
(input[type="text"]:
  largura 100%
  padding 8px
  borda 1px solida #cccccc
)
```

---

### 2. Arquitetura de Aninhamento Estrutural (Nesting)

O aninhamento permite mapear a hierarquia visual do HTML diretamente dentro dos blocos sintáticos, mitigando repetições desnecessárias de seletores e organizando a cascata.

```swls
(nav.menu-principal:
  fundo #2c3e50
  padding 1rem
  
  // Segunda Camada: Compila para 'nav.menu-principal ul.lista-itens'
  (ul.lista-itens:
    exibicao inline-bloco
    margem (0, 1rem)
    
    // Terceira Camada: Compila para 'nav.menu-principal ul.lista-itens a.link'
    (a.link:
      cor branco
      decoracao nenhum
      transicao cor 0.3s ease
      
      // Pseudo-classe aninhada e isolada via caractere de referência '&'
      &:pairado (
        cor #3498db
      )
    )
  )
  
  // Combinador direto aplicado no fechamento do bloco pai
  (> div.item-imediato:
    peso bold
  )
)
```
**CSS Nativo Resultante da Estrutura de Aninhamento:**
```css
nav.menu-principal {
  background-color: #2c3e50;
  padding: 1rem;
}

nav.menu-principal ul.lista-itens {
  display: inline-block;
  margin: 0 1rem;
}

nav.menu-principal ul.lista-itens a.link {
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
}

nav.menu-principal ul.lista-itens a.link:hover {
  color: #3498db;
}

nav.menu-principal > div.item-imediato {
  font-weight: bold;
}
```

### Controle de Profundidade do Aninhamento

A utilização de níveis excessivos de acoplamento gera seletores finais redundantes e pesados para a renderização do navegador. O teto recomendado para manutenção e performance é de no máximo 3 níveis.

```swls
// Abordagem Não Recomendada: Complexidade e acoplamento desnecessários
(section.modulo-HUD:
  (div.container-interno:
    (div.painel-estatisticas:
      (div.elemento-slot:
        (span.item-valor:
          // Densidade sintática excessiva
        )
      )
    )
  )
)

// Abordagem Recomendada: Legibilidade, modularidade e performance
(section.modulo-HUD:
  (div.painel-estatisticas:
    (span.item-valor:
      // Seletor final otimizado
    )
  )
)
```

---

## 3. Gerenciamento de Variáveis e Armazenamento

### Declaração no Índice `_gpai.swls`
As variáveis globais devem ser concentradas no arquivo centralizador do escopo do projeto, utilizando a atribuição limpa via dois-pontos:

```swls
// Identificadores Cromáticos
@cor-primaria: #2563eb
@cor-secundaria: #f59e0b
@cor-sucesso: #10b981
@cor-erro: #ef4444

// Identificadores Tipográficos
@fonte-tamanho-base: 16px
@fonte-tamanho-grande: 24px
@altura-linha-base: 1.5

// Parâmetros Espaciais (Grid System)
@espaco-base: 8px
@espaco-dobro: 16px
@espaco-triplo: 24px

// Atributos de Borda e Estrutura
@bordura-arredondada: 4px
@sombra-leve: 0 1px 3px rgba(0,0,0,0.1)
```

### Consumo de Variáveis e Escopo Léxico
Para invocar o token guardado na tabela de símbolos, utilize o prefixo `@` colado no nome do identificador em qualquer propriedade do módulo:

```swls
(button.btn-acao:
  fundo @cor-primaria
  cor branco
  padding (@espaco-base, @espaco-dobro)
  borda-raio @bordura-arredondada
  sombra @sombra-leve
  tamanho @fonte-tamanho-base
  
  &:pairado (
    fundo #1d4ed8
  )
)
```

### Fluxo de Herança de Símbolos
O motor de compilação MX v2.0.0 isola o escopo de variáveis. Identificadores declarados no índice de controle propagam-se de forma descendente por toda a subárvore sintática do projeto:

```swls
// Variável global persistida via _gpai.swls
@cor-global: #2563eb

(section.modulo-layout:
  fundo @cor-global
  
  (div.item-bloco:
    // Acessível de forma estável por herança de escopo léxico
    cor @cor-global
  )
)
```

---

## 4. Pseudo-classes e Pseudo-elementos Estruturais

O processamento de pseudo-estados e pseudo-elementos é executado através do caractere de ancoragem `&`, que indica ao gerador a concatenação estrita com o seletor do bloco imediatamente superior.

### Pseudo-classes (Estados de Eventos)

```swls
(a.link-navegacao:
  cor #2563eb
  decoracao nenhum
  
  &:link (
    cor #2563eb
  )
  
  &:visitado (
    cor #8b5cf6
  )
  
  &:pairado (
    cor #1d4ed8
    decoracao underline
  )
  
  &:ativo (
    cor #1e3a8a
  )
  
  &:focado (
    outline 2px solida #fbbf24
    outline-offset 2px
  )
  
  &:desabilitado (
    opacidade 0.5
    cursor nao-permitido
  )
)
```

### Pseudo-elementos (Injeções Estruturais)

```swls
(p.texto-conteudo:
  alinhamento-texto justificado
  
  &::primeira-letra (
    tamanho 1.5em
    peso bold
    espacamento-letras 2px
  )
  
  &::primeira-linha (
    tamanho @fonte-tamanho-grande
    transformacao-texto maiuscula
  )
  
  &:antes (
    conteudo "→ "
    cor @cor-primaria
  )
  
  &:depois (
    conteudo " ←"
    cor @cor-primaria
  )
)
```
---

## 5. Consultas de Mídia Integradas (Responsividade)

### Sintaxe de Controle Responsivo

```swls
// Definições de Breakpoints no índice _gpai.swls
@bp-mobile: 480px
@bp-tablet: 768px
@bp-desktop: 1024px
@bp-wide: 1280px

// Aplicação de regras responsivas em módulos estruturais
(div.container-HUD:
  largura 1200px
  padding (0, 2rem)
  
  // Interceptação para Tablet (max-width)
  @media screen e (max-largura: 768px) (
    (div.container-HUD:
      largura 100%
      padding (0, 1rem)
    )
  )
  
  // Interceptação para Mobile (max-width)
  @media screen e (max-largura: 480px) (
    (div.container-HUD:
      largura 100%
      padding (0, 0.5rem)
    )
  )
)
```

### Consultas de Mídia Compostas e Preferências do Sistema

```swls
(div.elemento-card:
  // Condições lógicas combinadas por intervalo de tela
  @media screen e (min-largura: 768px) e (max-largura: 1024px) (
    (div.elemento-card:
      exibicao grid
      colunas repetir(2, 1fr)
    )
  )
  
  // Orientação física do dispositivo
  @media (orientacao: paisagem) (
    (div.elemento-card:
      altura 100vh
    )
  )
  
  // Acessibilidade: Preferência por redução de animações
  @media (prefers-reduced-motion: reduzir) (
    (div.elemento-card:
      transicao nenhum
      animar nenhum
    )
  )
  
  // Preferência por esquema cromático escuro (Dark Mode)
  @media (prefers-color-scheme: escuro) (
    (div.elemento-card:
      fundo #1a1a1a
      cor #ffffff
    )
  )
)
```

---

## 6. Arquitetura Modular e Sistema de Módulos

### Topologia Modular Recomendada

```text
projeto/
├── _gpai.swls           # Índice invisível global de tabelas de símbolos
├── main.swls            # Centralizador de distribuição das folhas
├── componentes/
│   ├── botao.swls       # Definições específicas do componente de botão
│   ├── formulario.swls  # Estruturas de caixas de texto e entradas
│   └── card.swls        # Estruturas de encapsulamento de cartões
└── layouts/
    ├── header.swls      # Estrutura de cabeçalhos
    ├── footer.swls      # Estrutura de rodapés
    └── grid.swls        # Sistemas de malhas responsivas
```

### Processamento de Inclusões via `@importar`

O arquivo `main.swls` funciona como a esteira de unificação. Os arquivos utilitários e de componentes devem ser atados através de caminhos relativos limpos. O compilador resolve as subárvores e as injeta na AST de produção:

```swls
// Arquivo: main.swls
@importar "./componentes/botao.swls"
@importar "./componentes/formulario.swls"
@importar "./layouts/header.swls"

// Nota: O índice _gpai.swls é absorvido nativamente pelo compilador.
// Evite importações circulares (Módulo A importar Módulo B, e Módulo B importar Módulo A).
```

---

## Catálogo de Especificação Sintática

### 1. Tradução Semântica de Propriedades

#### Cores, Transparências e Fundos

| Sintaxe SWLS | Especificação W3C CSS | Exemplo de Implementação Prática |
| :--- | :--- | :--- |
| `cor` | `color` | `cor #ffffff` |
| `fundo` / `bg` | `background-color` | `fundo #f3f4f6` |
| `fundo-imagem` | `background-image` | `fundo-imagem url("../hud.png")` |
| `opacidade` | `opacity` | `opacidade 0.8` |

#### Tipografia e Tratamento de Textos

| Sintaxe SWLS | Especificação W3C CSS | Exemplo de Implementação Prática |
| :--- | :--- | :--- |
| `familia` | `font-family` | `familia "Orbitron", sans-serif` |
| `tamanho` | `font-size` | `tamanho 16px` |
| `peso` | `font-weight` | `peso bold` |
| `altura-linha` | `line-height` | `altura-linha 1.5` |
| `espacamento-letras` | `letter-spacing` | `espacamento-letras 2px` |
| `alinhamento-texto` | `text-align` | `alinhamento-texto centro` |
| `decoracao` | `text-decoration` | `decoracao underline` |
| `transformacao-texto` | `text-transform` | `transformacao-texto maiuscula` |

#### Box Model e Dimensionamento

| Sintaxe SWLS | Especificação W3C CSS | Exemplo de Implementação Prática |
| :--- | :--- | :--- |
| `largura` / `w` | `width` | `largura 100%` |
| `altura` / `h` | `height` | `altura 200px` |
| `padding` / `p` | `padding` | `padding 1rem` |
| `margem` / `m` | `margin` | `margem (0, auto)` |
| `borda` | `border` | `borda 1px solida #cccccc` |
| `borda-raio` | `border-radius` | `borda-raio 8px` |
| `sombra` | `box-shadow` | `sombra 0 2px 4px rgba(0,0,0,0.1)` |

#### Layout e Empilhamento

| Sintaxe SWLS | Especificação W3C CSS | Exemplo de Implementação Prática |
| :--- | :--- | :--- |
| `exibicao` / `display` | `display` | `exibicao flex` |
| `posicao` / `pos` | `position` | `posicao absoluta` |
| `indice-z` / `z` | `z-index` | `indice-z 10` |

#### Distribuição Flexbox

| Sintaxe SWLS | Especificação W3C CSS | Exemplo de Implementação Prática |
| :--- | :--- | :--- |
| `justificacao` | `justify-content` | `justificacao centro` |
| `alinhamento-item` | `align-items` | `alinhamento-item centro` |
| `direcao` | `flex-direction` | `direcao coluna` |
| `envolvimento` | `flex-wrap` | `envolvimento envolver` |
| `flex` | `flex` | `flex 1` |

#### Estrutura Grid CSS

| Sintaxe SWLS | Especificação W3C CSS | Exemplo de Implementação Prática |
| :--- | :--- | :--- |
| `colunas` | `grid-template-columns` | `colunas repetir(3, 1fr)` |
| `linhas` | `grid-template-rows` | `linhas auto 1fr auto` |
| `coluna-gap` | `column-gap` | `coluna-gap 1rem` |
| `linha-gap` | `row-gap` | `linha-gap 1rem` |
| `gap` / `lacuna` | `gap` | `gap 20px` |

#### Interpolações, Transições e Dinâmicas

| Sintaxe SWLS | Especificação W3C CSS | Exemplo de Implementação Prática |
| :--- | :--- | :--- |
| `transformacao` | `transform` | `transformacao rotate(45deg)` |
| `transformacao-origem` | `transform-origin` | `transformacao-origem centro` |
| `transicao` | `transition` | `transicao all 0.3s ease` |
| `animar` | `animation` | `animar deslizar 1s ease-in-out` |

### 2. Formatação de Valores e Unidades Nativas

O interpretador aceita todas as unidades padrão de mercado (`px`, `em`, `rem`, `%`, `vh`, `vw`, `deg`, `ms`, `s`), traduzindo-as e removendo espaços fantasmas automaticamente para assegurar a escrita limpa de funções estruturais do CSS.

```swls
// Definições de preenchimento cromático suportadas
(div.HUD-painel:
  fundo #ffffff
  fundo rgb(255, 255, 255)
  fundo rgba(0, 0, 0, 0.5)
)
```
#### Valores Semânticos Comuns do Dicionário

| Atributo Avaliado | Valores Suportados no Dicionário Semântico |
| :--- | :--- |
| `exibicao` / `display` | `nenhum`, `bloco`, `inline`, `inline-bloco`, `flex`, `grid` |
| `posicao` / `pos` | `estatica`, `relativa`, `absoluta`, `fixa`, `pegajosa` |
| `alinhamento-texto` | `esquerda`, `centro`, `direita`, `justificado` |
| `peso` | `normal`, `bold`, valores numéricos de `100` a `900` |
| `transformacao-texto` | `maiuscula`, `minuscula`, `capitalizar` |
| `cursor` | `ponteiro`, `mao`, `nao-permitido`, `texto`, `movimento` |

---

## Padrões Arquiteturais Avançados

### 1. Aplicação da Metodologia Semântica BEM

O caractere de ancoragem `&` permite encadear os seletores do padrão BEM (Block, Element, Modifier) mantendo a coesão sintática e o isolamento de escopo do bloco principal.

```swls
(.bloco-produto:
  padding 1rem
  borda 1px solida #e0e0e0
  
  // Elemento: __imagem
  (&__imagem:
    largura 100%
    altura 200px
    objeto-fit cover
  )
  
  // Elemento: __titulo
  (&__titulo:
    tamanho 1.25rem
    peso bold
  )
  
  // Elemento: __preco
  (&__preco:
    cor @cor-primaria
    tamanho 1.5rem
  )
  
  // Modificador: --destaque
  (&--destaque:
    borda-largura 2px
    sombra @sombra-destaque
  )
  
  // Modificador: --desabilitado
  (&--desabilitado:
    opacidade 0.5
    cursor nao-permitido
  )
)
```

### 2. Criação de Sistemas de Componentes e Variantes

```swls
// Arquivo: componentes/alerta.swls

(.componente-alerta:
  padding 1rem
  margem-inferior 1rem
  borda-raio 4px
  borda 1px solida transparente
  
  // Variante: Sucesso
  (&.sucesso:
    fundo #d4edda
    borda-cor #c3e6cb
    cor #155724
  )
  
  // Variante: Erro
  (&.erro:
    fundo #f8d7da
    borda-cor #f5c6cb
    cor #721c24
  )
  
  // Variante: Aviso
  (&.aviso:
    fundo #fff3cd
    borda-cor #ffeeba
    cor #856404
  )
  
  // Elemento: ícone aninhado
  (&__icone:
    margem-direita 0.5rem
  )
  
  // Elemento: mensagem aninhada
  (&__mensagem:
    exibicao bloco
  )
)
```

### 3. Gerenciamento de Temas Dinâmicos (`@tema`)

A diretiva `@tema` é processada para isolar variáveis customizadas injetando-as diretamente no escopo do atributo do documento no `:root`, eliminando a necessidade de sobreposições manuais de seletores.

```swls
// Definições contidas no índice global _gpai.swls

@tema claro (
  fundo-pagina: #ffffff
  texto-principal: #1a1a1a
  texto-secundario: #666666
)

@tema escuro (
  fundo-pagina: #1a1a1a
  texto-principal: #ffffff
  texto-secundario: #b0b0b0
)
```

```swls
// Consumo estrutural no arquivo de estilos do software

(body:
  fundo var(--fundo-pagina)
  cor var(--texto-principal)
)
```

### 4. Construção de Classes Utilitárias (Utility Classes)

```swls
// Arquivo: utilidades.swls

// Classes Utilitárias de Margem e Preenchimento
.m-0 { margem 0 }
.m-1 { margem 0.5rem }
.m-2 { margem 1rem }
.m-4 { margem 2rem }

.p-0 { padding 0 }
.p-1 { padding 0.5rem }
.p-2 { padding 1rem }

// Classes Utilitárias de Tipografia
.text-center { alinhamento-texto centro }
.text-left { alinhamento-texto esquerda }
.text-right { alinhamento-texto direita }

.font-bold { peso bold }
.font-normal { peso normal }

.text-sm { tamanho 0.875rem }
.text-base { tamanho 1rem }
.text-lg { tamanho 1.125rem }

// Classes Utilitárias de Exibição
.flex { exibicao flex }
.grid { exibicao grid }
.hidden { exibicao nenhum }
.block { exibicao bloco }
```

---

## Diretrizes de Engenharia e Otimização de Escrita

### 1. Processamento e Minificação de Código
O motor concentra seu pipeline na higienização sintática estável e na colagem de parênteses de funções. Para compressão em esteiras de distribuição, configure a flag via instanciação programática da API Node.js:

```javascript
// Instanciação programática da API com parâmetros de otimização
const Compiler = require("swl-core");
const compiler = new Compiler({ minify: true });
```

### 2. Geração de Source Maps
Para auditoria léxica e rastreabilidade de erros sintáticos diretamente em ambiente de desenvolvimento, ative o mapeamento de origem através da configuração do compilador:

```json
// Habilitado no arquivo swls.config.json do seu projeto
{
  "sourcemap": true
}
```

### 3. Organização Arquitetural de Projetos de Grande Escala

Abaixo está detalhada a topologia recomendada para mitigar colisões na tabela de símbolos e acelerar as varreduras do Linter:

```text
estilos/
├── _gpai.swls           # Índice invisível global de variáveis persistidas
├── base/
│   ├── reset.swls       # Normalização global e resets de margens
│   ├── tipografia.swls  # Padrões tipográficos e fontes base
│   └── cores.swls       # Paletas e mapeamentos cromáticos
├── componentes/
│   ├── botao.swls       # Componentes atômicos de botão com variantes
│   ├── formulario.swls  # Caixas de texto e entradas estruturadas
│   └── card.swls        # Estruturas de encapsulamento de cartões
├── layouts/
│   ├── header.swls      # Estrutura do cabeçalho
│   ├── footer.swls      # Estrutura do rodapé
│   └── grid.swls        # Sistemas de malhas responsivas
└── main.swls            # Centralizador de distribuição das folhas
```
---

### 4. Reaproveitamento Estrutural de Variáveis

O uso sistemático da tabela de símbolos impede a pulverização de valores fixos (*magic numbers*) ao longo dos arquivos fonte, centralizando alterações globais de layout.

```swls
// Definições recomendadas no arquivo de escopo global _gpai.swls
@cor-primaria: #2563eb
@cor-primaria-escura: #1d4ed8
@cor-primaria-clara: #dbeafe

(button.btn-acao:
  fundo @cor-primaria
  
  &:pairado (
    fundo @cor-primaria-escura
  )
  
  &:focado (
    sombra 0 0 0 3px @cor-primaria-clara
  )
)

(a.link-item:
  cor @cor-primaria
  
  &:visitado (
    cor @cor-primaria-escura
  )
)
```

### 5. Prevenção Contra Aninhamento Excessivo

Evite mapear a árvore física inteira do HTML por pura redundância textual. Isole os componentes de forma lógica para gerar seletores CSS nativos mais curtos, eficientes e de processamento veloz.

```swls
// Abordagem Não Recomendada: Gera seletores finais excessivamente longos no CSS
(section.modulo-hud:
  (div.HUD-container:
    (div.HUD-painel:
      (div.hud-slot:
        // Acoplamento excessivo
      )
    )
  )
)

// Abordagem Recomendada: Escrita isolada e desacoplada
(div.hud-container-base:
  // Estrutura de posicionamento principal
)

(div.hud-slot-item:
  // Componente atômico separado logicamente
)
```

---

## Boas Práticas Profissionais de Estilização

### 1. Padrões de Nomenclatura Semântica

A nomenclatura deve priorizar termos descritivos em caixa baixa separados por hífen (*kebab-case*), evitando abreviações ambíguas que prejudicam a legibilidade técnica do código.

```swls
// Exemplos de Nomenclatura Recomendada
.btn-primario-grande { }
.campo-entrada-texto { }
.alerta-erro-visivel { }

// Exemplos de Nomenclatura Não Recomendada
.btn { }
.txt { }
.x { }
```

### 2. Organização e Ordenação Interna de Blocos

As declarações de propriedades devem ser agrupadas de forma ordenada (propriedades de layout, propriedades visuais, seguidas por estados de eventos e variantes de classes) para otimizar as varreduras de depuração.

```swls
// Abordagem Recomendada: Ordenação lógica e sequencial
(button.btn-acao:
  // Definições visuais e estruturais base
  fundo @cor-primaria
  cor branco
  borda-raio 4px
  
  // Estados de Eventos
  &:pairado ( )
  &:focado ( )
  &:ativo ( )
  
  // Modificadores e Variantes de Classe
  (&.pequeno: )
  (&.grande: )
)

// Abordagem Não Recomendada: Declarações desordenadas e confusas
(button.btn-acao:
  (&.pequeno: )
  &:pairado ( )
  fundo @cor-primaria
  (&.grande: )
  &:focado ( )
  cor branco
)
```

### 3. Aplicação de Comentários Técnicos Úteis

O código deve ser documentado de forma limpa utilizando os delimitadores de linha simples `//` ou blocos multilinha `/* */` processados nativamente pelo Tokenizer.

```swls
// Comentário técnico de linha única

/*
  Comentário estruturado de bloco multilinha
  Útil para delimitar seções principais da folha
*/

// Componente: Botão Principal de Conversão
(button.btn-primario:
  fundo @cor-primaria
  
  // Estado de hover interceptado com curva de transição suave
  &:pairado (
    fundo @cor-primaria-escura
    transicao fundo-cor 0.2s ease
  )
)
```

### 4. Manutenibilidade Através de Abstração

```swls
// Abordagem Recomendada: Alterações ágeis e parametrizadas por variáveis
@cor-primaria: #2563eb
@cor-primaria-escura: #1d4ed8
@padding-base: 8px
@padding-grande: 16px

(button.btn-acao:
  padding (@padding-base, @padding-grande)
  fundo @cor-primaria
  
  &:pairado (
    fundo @cor-primaria-escura
  )
)

// Abordagem Não Recomendada: Valores travados de forma crua (Hardcoded)
(button.btn-acao:
  padding (8px, 16px)
  fundo #2563eb
  
  &:pairado (
    fundo #1d4ed8
  )
)
```

### 5. Abordagem Técnica Mobile-First

Inicie o desenvolvimento aplicando as propriedades básicas voltadas para resoluções de telas móveis compactas. Na sequência, aninhe as consultas de mídia com o critério `min-largura` para expandir o comportamento de layout em telas progressivamente maiores.

```swls
// Mobile First: Configuração de estilos bases para dispositivos móveis
(div.hud-grid-layout:
  tamanho 14px
  padding 1rem
  colunas 1fr
  
  // Ampliação do escopo para Tablets (min-width)
  @media screen e (min-largura: 768px) (
    (div.hud-grid-layout:
      tamanho 16px
      padding 1.5rem
      colunas repetir(2, 1fr)
    )
  )
  
  // Ampliação do escopo para Desktops (min-width)
  @media screen e (min-largura: 1024px) (
    (div.hud-grid-layout:
      tamanho 18px
      padding 2rem
      colunas repetir(3, 1fr)
    )
  )
)
```
---

## Cenários Práticos de Fixação (Exercícios)

### Exercício 1: Modelagem de Componente de Botão Estruturado
**Objetivo**: Instanciar um componente reutilizável aplicando variáveis e modificadores de estado.
* **Critérios de Aceitação**: O componente deve suportar 3 escalas de tamanho (`pequeno`, `medio`, `grande`), 3 variantes cromáticas (`primario`, `secundario`, `perigo`), interceptar 4 estados de eventos (`pairado`, `focado`, `ativo`, `desabilitado`) e aplicar curvas de transição parametrizadas.

**Solução Homologada na Sintaxe MX v2.0.0:**
```swls
// Definições de suporte persistidas no índice _gpai.swls
@cor-primaria: #2563eb
@cor-primaria-escura: #1d4ed8
@pad-pequeno: (6px, 12px)
@pad-medio: (8px, 16px)
@pad-grande: (12px, 24px)

(button.btn-reutilizavel:
  borda nenhum
  borda-raio 4px
  cursor ponteiro
  transicao all 0.2s ease
  
  // Modificadores de Escala de Tamanho
  (&.pequeno: padding @pad-pequeno)
  (&.medio: padding @pad-medio)
  (&.grande: padding @pad-grande)
  
  // Variante Cromática: Escopo Primário
  (&.primario:
    fundo @cor-primaria
    cor branco
    
    &:pairado (
      fundo @cor-primaria-escura
    )
  )
  
  // Interceptação de Estado Desabilitado
  &:desabilitado (
    opacidade 0.5
    cursor nao-permitido
  )
)
```

### Exercício 2: Configuração de Grade Responsiva (Grid CSS)
**Objetivo**: Implementar uma malha de distribuição de elementos que adapte o número de colunas conforme o breakpoint do dispositivo.
* **Critérios de Aceitação**: 1 coluna em resoluções móveis (`< 480px`), 2 colunas em tablets (`480px` a `768px`) e 3 colunas em desktops (`> 768px`), aplicando lacunas espaciais uniformes.

**Solução Homologada na Sintaxe MX v2.0.0:**
```swls
(div.grid-dinamico:
  exibicao grid
  gap 16px
  colunas 1fr // Configuração base Mobile-First
  
  // Condição para Tablets
  @media screen e (min-largura: 480px) (
    (div.grid-dinamico:
      colunas repetir(2, 1fr)
    )
  )
  
  // Condição para Desktops
  @media screen e (min-largura: 768px) (
    (div.grid-dinamico:
      colunas repetir(3, 1fr)
    )
  )
)
```

### Exercício 3: Inversão Dinâmica de Temas Claro e Escuro
**Objetivo**: Estruturar variáveis de propriedades vinculadas à diretiva nativa de inversão cromática.

**Solução Homologada na Sintaxe MX v2.0.0:**
```swls
// Definições persistidas no índice _gpai.swls
@tema claro (
  fundo-corpo: #ffffff
  texto-corpo: #1a1a1a
)

@tema escuro (
  fundo-corpo: #1a1a1a
  texto-corpo: #ffffff
)
```
```swls
// Invocação estrutural na folha de estilos do software
(body:
  fundo var(--fundo-corpo)
  cor var(--texto-corpo)
)
```

---

## Tabela de Referência Rápida

### Comandos do Barramento da CLI

```bash
# Inicialização do escopo de controle do projeto local (Gera o _gpai.swls)
node cli/swls.js init

# Compilação síncrona da árvore do projeto baseada no arquivo de entrada
node cli/swls.js build

# Compilação modular de um arquivo unitário exibindo progresso em tempo real
node cli/swls.js build meu-arquivo.swls

# Ativação do barramento de monitoramento em segundo plano (Watcher)
node cli/swls.js watch

# Acionamento do analisador estático para verificação de erros e escopo
node cli/swls.js lint

# Execução de rotinas de diagnóstico das variáveis de ambiente locais
node cli/swls.js doctor

# Exibição da versão oficial ativa do compilador
node cli/swls.js version

# Painel de instruções e ajuda da interface de linha de comando
node cli/swls.js --help
```

### Arquitetura Mínima Exigida para Inicialização

```text
escopo-projeto/
├── _gpai.swls       # Índice global obrigatório para carga da tabela de símbolos
├── estilos.swls     # Módulo fonte de desenvolvimento de regras
└── estilos.css      # Código transcrito CSS nativo resultante (gerado)
```

### Palavras-Chave Frequentes do Dicionário Semântico

| Propriedade SWLS | Mapeamento CSS W3C | Finalidade Técnica |
| :--- | :--- | :--- |
| `cor` | `color` | Aplica coloração ao preenchimento de textos |
| `fundo` / `bg` | `background-color` | Aplica coloração ao preenchimento de fundos |
| `padding` / `p` | `padding` | Define os espaçamentos internos da caixa |
| `margem` / `m` | `margin` | Define os espaçamentos externos da caixa |
| `largura` / `w` | `width` | Define a dimensão horizontal do elemento |
| `altura` / `h` | `height` | Define a dimensão vertical do elemento |
| `tamanho` | `font-size` | Define a escala tipográfica do caractere |
| `peso` | `font-weight` | Define a espessura da fonte tipográfica |
| `alinhamento-texto` | `text-align` | Define a orientação horizontal do texto |
| `exibicao` / `display` | `display` | Define o modelo de comportamento da caixa |

---

## Próximos Passos Operacionais

1. Conclua os cenários propostos nos exercícios práticos de fixação estrutural.
2. Acesse o arquivo `DOCUMENTACAO_TECNICA.md` para compreender o pipeline síncrono e o funcionamento interno do Parser e Tokenizer.
3. Utilize as tabelas informativas do arquivo `README.md` como manual de consulta rápida para grafia de propriedades.
4. Inicialize o seu ambiente de design executando os comandos automáticos atados à CLI de produção.

---

Documentação em Português • Referência e Soluções Homologadas • MIT License • v2.0.0

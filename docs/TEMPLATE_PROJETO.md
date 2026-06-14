# Estrutura Base de Projeto — SWLS Core MX v2.0.0

Diretrizes de arquitetura de diretórios e arquivos recomendada para inicialização de softwares.

---

## Mapeamento de Diretórios do Projeto

```text
projeto-swls/
├── src/
│   ├── _gpai.swls              # Variáveis globais do índice persistido
│   ├── main.swls               # Módulo centralizador de importações
│   ├── base/
│   │   ├── reset.swls          # Rotinas de reset de box model e margens
│   │   ├── tipografia.swls     # Definições tipográficas bases
│   │   └── cores.swls          # Mapa e variáveis complementares de paletas
│   ├── componentes/
│   │   ├── botao.swls          # Especificação do componente de botão herdado
│   │   ├── formulario.swls     # Componentes atômicos de formulário
│   │   ├── card.swls           # Estruturas de encapsulamento de cartões
│   │   ├── modal.swls          # Componentes flutuantes de interface
│   │   └── badge.swls          # Elementos de marcação de status
│   ├── layouts/
│   │   ├── header.swls         # Estrutura do cabeçalho
│   │   ├── footer.swls         # Estrutura do rodapé
│   │   ├── sidebar.swls        # Estrutura da barra lateral de navegação
│   │   └── grid.swls           # Sistemas de malhas e layouts responsivos
│   ├── utilities/
│   │   ├── espacamento.swls    # Classes utilitárias de margin e padding calculated
│   │   ├── tipografia.swls     # Atalhos e modificadores textuais
│   │   └── display.swls        # Modificadores de exibição e visibilidade
│   └── themes/
│       ├── tema-claro.swls     # Declaração do mapeamento claro
│       └── tema-escuro.swls    # Declaração do mapeamento escuro
├── dist/
│   └── estilos.css             # Arquivo CSS de distribuição final gerado
├── package.json                # Manifesto de controle de pacotes locais Node.js
├── swls.config.json            # Especificações operacionais do compilador local
└── README.md                   # Documentação descritiva específica do software
```

---

## Especificação de Arquivo: `src/_gpai.swls`

```swls
// ============================================================================
// ÍNDICE DE VARIÁVEIS GLOBAIS SWLS
// Arquivo: src/_gpai.swls
// ============================================================================

// Paletas de Cores Principais
// ────────────────────────────────────────────────────────────────────────────
@cor-primaria: #2563eb
@cor-primaria-escura: #1d4ed8
@cor-primaria-clara: #dbeafe

@cor-secundaria: #f59e0b
@cor-secundaria-escura: #d97706
@cor-secundaria-clara: #fef3c7

@cor-sucesso: #10b981
@cor-sucesso-escura: #059669
@cor-sucesso-clara: #d1fae5

@cor-aviso: #f59e0b
@cor-aviso-escura: #d97706
@cor-aviso-clara: #fef3c7

@cor-erro: #ef4444
@cor-erro-escura: #dc2626
@cor-erro-clara: #fee2e2

// Paletas de Cores Neutras
// ────────────────────────────────────────────────────────────────────────────
@cor-fundo-claro: #ffffff
@cor-fundo-escuro: #1a1a1a

@cor-texto-primario: #1f2937
@cor-texto-secundario: #6b7280
@cor-texto-claro: #ffffff
@cor-texto-escuro: #f3f4f6

@cor-borda: #e5e7eb
@cor-borda-escura: #374151

// Famílias Tipográficas
// ────────────────────────────────────────────────────────────────────────────
@fonte-principal: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
@fonte-mono: "Fira Code", "Courier New", monospace
@fonte-serif: Georgia, "Times New Roman", serif

// Escala de Tamanhos de Fonte
// ────────────────────────────────────────────────────────────────────────────
@tamanho-xs: 12px
@tamanho-sm: 14px
@tamanho-base: 16px
@tamanho-lg: 18px
@tamanho-xl: 20px
@tamanho-2xl: 24px
@tamanho-3xl: 30px
@tamanho-4xl: 36px

// Escala de Pesos de Fonte
// ────────────────────────────────────────────────────────────────────────────
@peso-leve: 300
@peso-normal: 400
@peso-medio: 500
@peso-semibold: 600
@peso-bold: 700
@peso-extrabold: 800

// Escala de Altura de Linha
// ────────────────────────────────────────────────────────────────────────────
@altura-linha-apertada: 1.2
@altura-linha-normal: 1.5
@altura-linha-relaxada: 1.75
@altura-linha-solta: 2

// Escala de Espaçamento de Letras
// ────────────────────────────────────────────────────────────────────────────
@letra-espacamento-apertado: -0.5px
@letra-espacamento-normal: 0
@letra-espacamento-largo: 1px
@letra-espacamento-muito-largo: 2px

// Malha de Espaçamentos Base (Mecanismo Multiplicador)
// ────────────────────────────────────────────────────────────────────────────
@espaco-0: 0
@espaco-1: 4px
@espaco-2: 8px
@espaco-3: 12px
@espaco-4: 16px
@espaco-5: 20px
@espaco-6: 24px
@espaco-7: 28px
@espaco-8: 32px
@espaco-10: 40px
@espaco-12: 48px
@espaco-16: 64px
@espaco-20: 80px
@espaco-24: 96px

// Escala de Arredondamento (Border Radius)
// ────────────────────────────────────────────────────────────────────────────
@raio-nenhum: 0
@raio-xs: 2px
@raio-sm: 4px
@raio-base: 6px
@raio-md: 8px
@raio-lg: 12px
@raio-xl: 16px
@raio-2xl: 24px
@raio-completo: 9999px

// Sombras Estruturais (Box Shadow)
// ────────────────────────────────────────────────────────────────────────────
@sombra-nenhum: nenhum
@sombra-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
@sombra-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
@sombra-base: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
@sombra-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
@sombra-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
@sombra-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

// Espessura de Bordas
// ────────────────────────────────────────────────────────────────────────────
@bordura-nenhum: nenhum
@bordura-1: 1px solida
@bordura-2: 2px solida
@bordura-4: 4px solida

// Temporizadores de Transição
// ────────────────────────────────────────────────────────────────────────────
@transicao-rapida: 75ms
@transicao-normal: 150ms
@transicao-lenta: 300ms
@transicao-muito-lenta: 500ms

// Curvas de Interpolação (Easing)
// ────────────────────────────────────────────────────────────────────────────
@easing-linear: linear
@easing-ease: ease
@easing-ease-in: ease-in
@easing-ease-out: ease-out
@easing-ease-in-out: ease-in-out

// Pontos de Quebra Responsivos (Breakpoints)
// ────────────────────────────────────────────────────────────────────────────
@bp-xs: 320px
@bp-sm: 480px
@bp-md: 768px
@bp-lg: 1024px
@bp-xl: 1280px
@bp-2xl: 1536px

// Índices de Empilhamento (Z-Index)
// ────────────────────────────────────────────────────────────────────────────
@z-oculto: -1
@z-base: 0
@z-dropdown: 1000
@z-sticky: 1010
@z-fixo: 1020
@z-modal-fundo: 1030
@z-modal: 1040
@z-popover: 1050
@z-tooltip: 1060

// Duração de Ciclos de Animação
// ────────────────────────────────────────────────────────────────────────────
@duracao-curta: 150ms
@duracao-normal: 300ms
@duracao-longa: 500ms
@duracao-muito-longa: 1000ms

// ============================================================================
// FIM DO ÍNDICE DE VARIÁVEIS GLOBAIS
// ============================================================================
```
---

## Especificação de Arquivo: `src/main.swls`

```swls
// ============================================================================
// COMPILADOR CENTRAL DE MÓDULOS SWLS
// Arquivo: src/main.swls
// ============================================================================

// Importações Estruturais de Base
// ────────────────────────────────────────────────────────────────────────────
@importar "./base/reset.swls"
@importar "./base/tipografia.swls"
@importar "./base/cores.swls"

// Importações Atômicas de Componentes
// ────────────────────────────────────────────────────────────────────────────
@importar "./componentes/botao.swls"
@importar "./componentes/formulario.swls"
@importar "./componentes/card.swls"
@importar "./componentes/modal.swls"
@importar "./componentes/badge.swls"

// Importações de Sistemas de Layout
// ────────────────────────────────────────────────────────────────────────────
@importar "./layouts/header.swls"
@importar "./layouts/footer.swls"
@importar "./layouts/sidebar.swls"
@importar "./layouts/grid.swls"

// Importações de Módulos Utilitários
// ────────────────────────────────────────────────────────────────────────────
@importar "./utilities/espacamento.swls"
@importar "./utilities/tipografia.swls"
@importar "./utilities/display.swls"

// ============================================================================
// FIM DO MÓDULO CENTRAL
// ============================================================================
```

---

## Especificação de Arquivo: `src/base/reset.swls`

```swls
// ============================================================================
// RESET CSS - Normalização Global e Resets de Box Model
// Arquivo: src/base/reset.swls
// ============================================================================

(html:
  tamanho 16px
)

(body:
  margem 0
  familia @fonte-principal
  tamanho @tamanho-base
  altura-linha @altura-linha-normal
  cor @cor-texto-primario
  fundo @cor-fundo-claro
  transicao all @transicao-normal ease
)

(h1: tamanho @tamanho-4xl peso @peso-bold altura-linha @altura-linha-apertada margem 0)
(h2: tamanho @tamanho-3xl peso @peso-bold altura-linha @altura-linha-apertada margem 0)
(h3: tamanho @tamanho-2xl peso @peso-bold altura-linha @altura-linha-apertada margem 0)
(h4: tamanho @tamanho-xl peso @peso-bold altura-linha @altura-linha-apertada margem 0)
(h5: tamanho @tamanho-lg peso @peso-bold altura-linha @altura-linha-apertada margem 0)
(h6: tamanho @tamanho-base peso @peso-bold altura-linha @altura-linha-apertada margem 0)

(p:
  margem 0
  altura-linha @altura-linha-normal
)

(a:
  cor @cor-primaria
  decoracao nenhum
  transicao cor @transicao-normal ease
  
  &:pairado (
    cor @cor-primaria-escura
    decoracao underline
  )
)

(button:
  fundo transparente
  borda nenhum
  cursor ponteiro
  familia herdar
)

(input:
  familia herdar
)

(textarea:
  familia herdar
)
```

---

## Especificação de Arquivo: `src/componentes/botao.swls`

```swls
// ============================================================================
// ESPECIFICAÇÃO DE COMPONENTE: Botão Estrutural
// Arquivo: src/componentes/botao.swls
// ============================================================================

(button.btn-acao:
  exibicao inline-bloco
  padding (@espaco-2, @espaco-4)
  tamanho @tamanho-base
  peso @peso-semibold
  alinhamento-texto centro
  cursor ponteiro
  borda nenhum
  borda-raio @raio-md
  transicao all @transicao-normal ease
  
  // Variante: Comportamento Primário
  (&.primario:
    fundo @cor-primaria
    cor @cor-texto-claro
    
    &:pairado (
      fundo @cor-primaria-escura
      sombra @sombra-md
    )
    
    &:ativo (
      transformacao scale(0.98)
    )
    
    &:desabilitado (
      opacidade 0.6
      cursor nao-permitido
    )
  )
  
  // Variante: Comportamento Secundário
  (&.secundario:
    fundo @cor-borda
    cor @cor-texto-primario
    
    &:pairado (
      fundo @cor-borda-escura
    )
  )
  
  // Variante: Comportamento Perigo
  (&.perigo:
    fundo @cor-erro
    cor @cor-texto-claro
    
    &:pairado (
      fundo @cor-erro-escura
    )
  )
  
  // Escala de Tamanho: Compacto
  (&.pequeno:
    padding (@espaco-1, @espaco-2)
    tamanho @tamanho-sm
  )
  
  // Escala de Tamanho: Expandido
  (&.grande:
    padding (@espaco-3, @espaco-6)
    tamanho @tamanho-lg
  )
  
  // Modificador de Bloco (Largura Total)
  (&.bloco:
    exibicao bloco
    largura 100%
  )
)
```
---

## Especificação de Arquivo: `swls.config.json`

O manifesto de configuração define os parâmetros operacionais consumidos de forma direta pelo gerenciador de automação da CLI:

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

## Especificação de Arquivo: `package.json`

O arquivo de controle do Node.js mapeia as chamadas físicas da CLI local e vincula a dependência estável do compilador do núcleo:

```json
{
  "name": "projeto-swls",
  "version": "1.0.0",
  "description": "Projeto de estilos baseado no ecossistema SWLS Core MX",
  "main": "dist/estilos.css",
  "scripts": {
    "build": "node cli/swls.js build src/main.swls -o dist/estilos.css",
    "watch": "node cli/swls.js watch",
    "lint": "node cli/swls.js lint",
    "doctor": "node cli/swls.js doctor",
    "dev": "npm run watch"
  },
  "keywords": [
    "swls",
    "css",
    "stylesheets",
    "compiler"
  ],
  "author": "Desenvolvedor",
  "license": "MIT",
  "devDependencies": {
    "swl-core": "^2.0.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

---

## Protocolo de Implantação do Template

### 1. Inicialização do Diretório Local
Crie a pasta de trabalho do seu software e navegue para o escopo interno via console:
```bash
mkdir meu-projeto
cd meu-projeto
```

### 2. Estruturação dos Módulos
Monte a árvore de pastas e crie os arquivos de amostragem conforme a especificação do mapeamento estrutural.

### 3. Instalação das Dependências de Desenvolvimento
Dispare o gerenciador de pacotes para ler o manifesto e atar o compilador local:
```bash
npm install
```

### 4. Ativação do Ambiente de Desenvolvimento
Inicie o barramento de monitoramento em tempo real (Watcher) para processar alterações em segundo plano:
```bash
npm run dev
```

### 5. Geração de Builds de Distribuição
Execute a diretiva de compilação final para gerar a folha de estilos limpa de produção:
```bash
npm run build
```

---

## Diretrizes de Engenharia e Melhores Práticas

### Organização de Arquivos
* Aloque uma única responsabilidade lógica ou componente por arquivo físico `.swls`.
* Centralize a declaração de variáveis globais e tokens de design no arquivo `_gpai.swls`.
* Consolide as inclusões de módulos e heranças de forma ordenada no ponto de entrada `main.swls`.

### Padrões de Nomenclatura
* Adote nomes puramente descritivos e em caixa baixa separados por hífen (kebab-case).
* Utilize prefixos específicos para identificar componentes estruturais (.btn-, .card-).
* Utilize modificadores de estado claros baseados no padrão semântico adotado (--desabilitado, --ativo).

### Otimização e Desempenho
* Limite a profundidade do aninhamento de seletores ao teto máximo recomendado de 3 níveis.
* Evite declarações duplicadas ou propriedades redundantes dentro do mesmo bloco sintático.
* Fragmente folhas de estilo robustas em módulos acoplados para acelerar as varreduras do Linter.

---

## Matriz de Validação Pré-Produção (Checklist Final)

* [ ] Todos os módulos .swls executam o pipeline de compilação sem apresentar falhas sintáticas.
* [ ] A varredura do comando `npm run lint` retorna sinal verde sem acusar warnings ou variáveis órfãs.
* [ ] A folha de estilos gerada no diretório final é semanticamente válida e interpretável pelos navegadores.
* [ ] A totalidade de variáveis globais consumidas está centralizada no arquivo de controle `_gpai.swls`.
* [ ] O ecossistema está livre de dependências ou importações cíclicas e loops de arquivo.
* [ ] As consultas de mídia aninhadas respondem perfeitamente aos critérios de responsividade estabelecidos.

---

## Referências Documentais Relacionadas

* README.md — Manual de referência rápida, instalação e comandos de linha de comando.
* MANUAL_ESTUDO.md — Manual de treinamento progressivo e boas práticas de estilização.
* DOCUMENTACAO_TECNICA.md — Especificação profunda da arquitetura de engenharia do software.

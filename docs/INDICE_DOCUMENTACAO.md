# Índice de Navegação Documental — SWLS Core MX v2.0.4

Mapeamento centralizado e roteamento das especificações técnicas do ecossistema.

---

## Diretrizes de Iniciação Rápida

Para usuários em fase de primeiro contato com o ecossistema SWLS, recomenda-se seguir o fluxo cronológico estabelecido abaixo:

1. **README.md (Tempo estimado: 5 minutos)**
   * Visão geral do projeto arquitetural.
   * Instruções de instalação automatizada global.
   * Exemplos práticos de sintaxe basilar.

2. **MANUAL_ESTUDO.md (Tempo estimado: 30-60 minutos)**
   * Fundamentos passo a passo de estilização declarativa.
   * Assimilação dos conceitos de escopo e blocos.
   * Exercícios guiados de fixação lógica.

3. **DOCUMENTACAO_TECNICA.md (Formato: Consulta sob demanda)**
   * Referência técnica profunda de engenharia do motor.
   * Especificações detalhadas da API pública do módulo.
   * Detalhamento de sub-rotinas e pipelines internos.

---

## Especificações do Catálogo Documental

### 1. README.md — Manual de Operação Principal
* **Tempo Estimado de Leitura**: 10 a 15 minutos.
* **Conteúdo Programático**: Visão geral do ecossistema, instruções de instalação via NPM, guia de início rápido em 5 minutos, mapeamento de sintaxe básica, dicionário de comandos da CLI, instanciação programática como biblioteca, topologia de projetos, amostragem de blocos práticos, tratamento de exceções (troubleshooting) e links eletrônicos oficiais.
* **Critérios de Aplicação**: Primeira interação com o compilador, consultas rápidas de propriedades do dicionário, resolução de falhas comuns de terminal e checagem de argumentos da CLI.

### 2. MANUAL_ESTUDO.md — Tutorial de Capacitação Progressiva
* **Tempo Estimado de Leitura**: 60 a 120 minutos.
* **Conteúdo Programático**: Introdução comparativa entre paradigmas de estilização, fundamentos do processamento declarativo, detalhamento de escopo léxico, sintaxe de aninhamento e seletores compostos, padrões de design arquiteturais avançados, boas práticas profissionais de engenharia de estilos, exercícios de fixação com gabaritos oficiais e tabelas de referência rápida.
* **Conceitos Cobertos**: Seletores simples de tags e classes, aninhamento estrutural (Nesting), persistência de variáveis e gerenciamento de pilhas de símbolos, pseudo-classes e pseudo-elementos via caractere de referência `&`, consultas de mídia integradas, modularização via importações, sistemas de componentes estruturados, aplicação da metodologia BEM, mapeamento de temas em blocos e criação de classes utilitárias calculated.
* **Cenários Práticos de Fixação**: Modelagem de componentes de botão com variantes, estruturação de malhas de grid responsivas e controle de variáveis em temas claros e escuros.

### 3. DOCUMENTACAO_TECNICA.md — Referência Arquitetural de Engenharia
* **Tempo Estimado de Leitura**: Consulta modularizada por seção técnica.
* **Conteúdo Programático**: Visão geral da arquitetura do compilador, mapeamento detalhado do pipeline de ciclo de vida, engenharia interna dos subsistemas primários, API pública do módulo, sistema formal de tipos, funcionamento interno do Tokenizer, Parser, Linter estático em duas passagens e Generator de CSS, gerenciamento de caminhos de arquivos de imports, tratamento de erros léxicos e sintáticos, critérios de extensibilidade e métricas de desempenho.
* **Critérios de Aplicação**: Submissão de melhorias para o núcleo do compilador, extensão de funcionalidades do software, auditoria técnica do pipeline e otimização do tempo de processamento do build.

---

## Mapeamento de Diretórios do Ecossistema

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
    ├── snippets/              # Modelos de expansão de código e preenchimento automático
    ├── src/                   # Provedor do IntelliSense e save-listener do editor
    ├── syntaxes/              # Gramática TextMate para realce de sintaxe atualizado
    ├── language-configuration.json # Configuração de auto-fechamento e comportamento do ENTER
    └── package.json           # Manifesto de registro da extensão na versão 2.0.0
```

---

## Cronograma de Progresso e Aprendizado (Roadmap)

### Nível 1: Fundamentos e Operação Básica (2 a 3 horas)
* [ ] Leitura completa e assimilação do arquivo `README.md`.
* [ ] Instalação e verificação do ambiente global via NPM (`npm install swl-core -g`).
* [ ] Criação e inicialização de um projeto local através do comando `node cli/swls.js init`.
* [ ] Compilação de uma folha de estilo unitária simples avaliando o arquivo de saída.
* [ ] Compreensão e manipulação de variáveis de escopo global.

### Nível 2: Integração Intermediária e Padrões (4 a 6 horas)
* [ ] Execução das lições e tutoriais contidos no arquivo `MANUAL_ESTUDO.md`.
* [ ] Domínio prático de aninhamento estrutural de seletores compostos (Nesting).
* [ ] Implementação de consultas de mídia acionadas diretamente no escopo do design.
* [ ] Modelagem de blocos funcionais atômicos utilizando a diretiva `@componente`.
* [ ] Fragmentação de arquivos em múltiplos módulos acoplados por `@importar`.

### Nível 3: Domínio Avançado e Otimização (8 a 12 horas)
* [ ] Leitura analítica do arquivo de especificações `DOCUMENTACAO_TECNICA.md`.
* [ ] Compreensão profunda das fases do pipeline (Análise Léxica, Sintática e Geração).
* [ ] Integração programática das funcionalidades do compilador via API pública do módulo.
* [ ] Implementação de sistemas de design complexos com inversão de temas via `@tema`.
* [ ] Otimização arquitetural de projetos de larga escala mitigando refações cíclicas.

### Nível 4: Engenharia do Núcleo e Especialização
* [ ] Submissão de melhorias documentadas para o núcleo do compilador através de Pull Requests.
* [ ] Desenvolvimento de utilitários auxiliares ou plugins acoplados à esteira da AST.
* [ ] Auditoria e manutenção contínua das métricas de desempenho e tempo de build.
* [ ] Documentação e consolidação de padrões sintáticos próprios do seu software.
---

## Mapeamento Temático de Referência Cruzada

### Infraestrutura, Instalação e Setup
* **README.md** ── Seção: Diretrizes de Instalação e Inicialização
* **MANUAL_ESTUDO.md** ── Seção: Configuração do Ambiente Passo a Passo

### Gramática e Sintaxe SWLS
* **README.md** ── Seção: Especificação de Sintaxe (MX v2.0.0)
* **MANUAL_ESTUDO.md** ── Seção: Conceitos Estruturais Fundamentais
* **MANUAL_ESTUDO.md** ── Seção: Catálogo de Especificação Sintática

### Variáveis e Tabela de Símbolos
* **README.md** ── Seção: Declaração de Variáveis Globais (Índice _gpai.swls)
* **MANUAL_ESTUDO.md** ── Seção: Gerenciamento de Variáveis e Armazenamento
* **DOCUMENTACAO_TECNICA.md** ── Seção: Mecanismos de Resolução de Variáveis e Escopo

### Aninhamento e Seletores Compostos (Nesting)
* **MANUAL_ESTUDO.md** ── Seção: Arquitetura de Aninhamento Estrutural
* **DOCUMENTACAO_TECNICA.md** ── Seção: Processamento Léxico de Seletores Simples e Compostos

### Consultas de Mídia e Responsividade
* **README.md** ── Seção: Consulta de Mídia Integrada
* **MANUAL_ESTUDO.md** ── Seção: Responsividade e Filtros de Tela
* **MANUAL_ESTUDO.md** ── Seção: Abordagem Técnico Mobile-First

### Sistemas de Módulos e Importações
* **README.md** ── Seção: Importação de Módulos Modulares
* **MANUAL_ESTUDO.md** ── Seção: Arquitetura Modular Baseada em Arquivos
* **DOCUMENTACAO_TECNICA.md** ── Seção: Subsistema de Resolução de Importações e Caminhos Relativos

### Sistemas de Componentes e Reaproveitamento
* **README.md** ── Seção: Componentes Isolados e Herança Real
* **MANUAL_ESTUDO.md** ── Seção: Implementação da Metodologia Semântica BEM
* **MANUAL_ESTUDO.md** ── Seção: Blocos Reutilizáveis Polimórficos e Componentização

### Interface de Linha de Comando (CLI)
* **README.md** ── Seção: Comandos da CLI de Produção
* **MANUAL_ESTUDO.md** ── Seção: Operação de Rotinas Essenciais do Terminal

### Integração Programática e Módulos Node.js
* **README.md** ── Seção: Consumo do Compilador Programaticamente
* **DOCUMENTACAO_TECNICA.md** ── Seção: Especificação da API Pública do Módulo

### Validação, Linter e Exceções
* **README.md** ── Seção: Resoluções de Comportamentos Inesperados (Troubleshooting)
* **MANUAL_ESTUDO.md** ── Seção: Higienização de Código via Analisador Estático
* **DOCUMENTACAO_TECNICA.md** ── Seção: Funcionamento Interno do Linter em Duas Passagens
* **DOCUMENTACAO_TECNICA.md** ── Seção: Políticas de Tratamento e Captura de Erros Léxicos

### Métricas de Desempenho e Otimização
* **MANUAL_ESTUDO.md** ── Seção: Diretrizes de Engenharia e Otimização de Escrita
* **DOCUMENTACAO_TECNICA.md** ── Seção: Avaliação de Performance e Tempo de Build

### Práticas de Engenharia e Convenções
* **MANUAL_ESTUDO.md** ── Seção: Boas Práticas Profissionais de Estilização
* **DOCUMENTACAO_TECNICA.md** ── Seção: Extensibilidade e Convenções Arquiteturais

---

## Guia de Resolução Rápida por Demanda

* **Para instalar o compilador global e dependências**:
  Consulte: `README.md` — Seção: Instalação e Inicialização

* **Para compreender a declaração e passagem de parâmetros de variáveis**:
  Consulte: `MANUAL_ESTUDO.md` — Seção: Gerenciamento de Variáveis

* **Para aplicar a sintaxe correta de aninhamento de seletores compostos**:
  Consulte: `MANUAL_ESTUDO.md` — Seção: Arquitetura de Aninhamento

* **Para entender o comportamento do orquestrador interno de módulos**:
  Consulte: `DOCUMENTACAO_TECNICA.md` — Seção: Sistema de Módulos

* **Para estender as funcionalidades do compilador através da API pública**:
  Consulte: `DOCUMENTACAO_TECNICA.md` — Seção: API Pública

* **Para otimizar um projeto de larga escala mitigando refações**:
  Consulte: `MANUAL_ESTUDO.md` — Seção: Otimização e Performance

* **Para auditar um código que exibe comportamentos inesperados**:
  Consulte: `README.md` — Seção: Resoluções de Comportamentos Inesperados (Troubleshooting)

---

## Métricas Gerais de Volume Documental

| Arquivo Analisado | Densidade Textual | Total de Seções | Blocos de Amostragem | Tempo Estimado |
| :--- | :--- | :--- | :--- | :--- |
| **README.md** | ~6.000 palavras | 20+ blocos | 25+ exemplos | 10 a 15 minutos |
| **MANUAL_ESTUDO.md** | ~12.000 palavras | 50+ blocos | 40+ exemplos | 60 a 120 minutos |
| **DOCUMENTACAO_TECNICA.md** | ~8.000 palavras | 30+ blocos | 50+ exemplos | Formato de Consulta |
| **Métricas Consoladas** | ~26.000 palavras | 100+ blocos | 115+ exemplos | 80 a 150 minutos |

---

## Endereços Eletrônicos Oficiais de Referência

* **Repositório GitHub Mestre**: [https://github.com](https://github.com)
* **Pacote NPM Oficial**: [https://npmjs.com](https://npmjs.com)
* **Visual Studio Marketplace**: [https://visualstudio.com](https://visualstudio.com)
* **Perfil do Desenvolvedor**: [https://github.com](https://github.com)

---

## Critérios de Qualidade e Metas Editoriais

* **Completude Estrutural**: Cobertura integral das diretivas lógicas introduzidas na especificação MX.
* **Acessibilidade Linguística**: Redação técnica padronizada em vernáculo português para facilidade de absorção.
* **Abordagem Empírica**: Inclusão de blocos práticos aplicados e gabaritos de validação lógica.
* **Rigidez Arquitetural**: Sincronização estrita com as assinaturas estáveis da versão 2.0.0.

---

## Convenções de Notação de Código

As amostragens contidas nos manuais são catalogadas conforme os escopos abaixo:

* **Blocos Declarativos SWLS**: Indicam o código-fonte puro na extensão de desenvolvimento.
```swls
// Escopo de código fonte SWLS puro
```

* **Blocos de Saída CSS**: Indicam o código transcrito gerado de forma automatizada pelo motor.
```css
/* Escopo de saída CSS nativa resultante */
```

* **Blocos de API JavaScript**: Indicam a instanciação de rotinas programáticas em Node.js.
```javascript
// Escopo de execução da API pública Node.js
```

* **Diretivas Bash/Terminal**: Indicam comandos de entrada para acionamento dos binários locais.
```bash
# Diretiva de comando de terminal
```

---

## Protocolo de Progressão de Usuários

### Usuários de Nível Inicial
1. Estude o conteúdo de inicialização contido no arquivo `README.md`.
2. Siga as lições práticas estabelecidas no arquivo `MANUAL_ESTUDO.md`.
3. Conclua os exercícios de fixação lógica.
4. Realize a instalação e validação da extensão oficial avançada no Visual Studio Code.

### Desenvolvedores Integradores
1. Utilize o arquivo `README.md` como guia de consulta rápida para grafia de propriedades.
2. Analise os fluxos do ciclo de vida descritos no arquivo `DOCUMENTACAO_TECNICA.md`.
3. Estude a árvore de herança e polimorfismo de componentes.

### Especialistas do Núcleo
1. Conclua a leitura unificada de toda a suíte de documentação técnica.
2. Execute auditorias de performance avaliando o tempo de build em milissegundos.
3. Submeta melhorias documentadas para a folha de estilos central da linguagem.


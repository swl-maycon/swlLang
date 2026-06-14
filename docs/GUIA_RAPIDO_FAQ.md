# Guia de Inicialização Rápida e Perguntas Frequentes (FAQ) — SWLS Core MX v2.0.0

---

## Processo de Inicialização de 5 Minutos

### Etapa 1: Instalação das Dependências Globais
Execute o comando abaixo para instalar o compilador oficial via NPM. Certifique-se de que o ambiente local possui o Node.js igual ou superior à versão 16.x.
```bash
npm install swl-core -g
node --version
```

### Etapa 2: Inicialização do Projeto
Crie o diretório do seu software e acione o inicializador nativo da CLI para estruturar os manifestos de controle.
```bash
mkdir meu-projeto
cd meu-projeto
node cli/swls.js init
```

### Etapa 3: Desenvolvimento do Código Fonte
Abra ou crie o arquivo `estilos.swls` e estruture as suas regras utilizando parênteses como delimitadores oficiais de bloco:
```swls
(body:
  fundo #ffffff
  familia Arial, sans-serif
)

(button.btn-acao:
  fundo #2563eb
  cor branco
  padding (8px, 16px)
  borda-raio 4px
  
  &:pairado (
    fundo #1d4ed8
  )
)
```

### Etapa 4: Execução do Compilador
Dispare a diretiva de build informando o arquivo de entrada para gerar a folha de estilos correspondente.
```bash
node cli/swls.js build estilos.swls
```

### Etapa 5: Validação do Resultado
O arquivo compilado estará disponível no caminho `estilos.css`, contendo a transcrição nativa e com as funções coladas de forma otimizada para o navegador.

---

## Comandos Operacionais da CLI

```bash
# Inicialização do escopo de controle do projeto local (Gera o _gpai.swls)
node cli/swls.js init

# Ativação do barramento de monitoramento contínuo em segundo plano (Watcher)
node cli/swls.js watch

# Compilação modular de um arquivo unitário exibindo progresso em tempo real
node cli/swls.js build meu-arquivo.swls

# Execução do analisador estático para verificação de erros e escopo (sem gerar CSS)
node cli/swls.js lint

# Execução de rotinas de diagnóstico das variáveis de ambiente locais
node cli/swls.js doctor

# Exibição da versão oficial ativa do compilador
node cli/swls.js version
```

---

## Central de Respostas para Dúvidas Frequentes (FAQ)

### Infraestrutura e Instalação

#### P: O compilador SWLS possui compatibilidade com o sistema operacional Windows?
**R:** Sim. O ecossistema opera de forma estável em plataformas Windows, macOS e Linux, exigindo unicamente o runtime Node.js em versão igual ou superior à 16.x.

#### P: Quais comandos devem ser executados para auditar a integridade da instalação?
**R:** Para verificar a versão ativa e rodar as rotinas de verificação de permissões do ambiente, execute os comandos:
```bash
node cli/swls.js version
node cli/swls.js doctor
```

#### P: É mandatório realizar a instalação utilizando a flag global (-g)?
**R:** Não. O pacote pode ser atado localmente às dependências de desenvolvimento do seu projeto. Para ambientes locais, utilize o prefixo npx para invocar os binários correspondentes:
```bash
npm install swl-core --save-dev
npx swls init
npx swls watch
```

#### P: É possível integrar o compilador em um projeto de software já existente?
**R:** Sim. Ao disparar o comando `node cli/swls.js init` na raiz do seu projeto existente, a CLI gerará de forma segura o índice global `_gpai.swls` e o arquivo `swls.config.json` sem sobrescrever seus arquivos atuais.

---

### Diretrizes de Sintaxe e Escopo

#### P: Qual é o padrão gramatical para declaração e consumo de variáveis?
**R:** As variáveis globais devem ser registradas no arquivo de índice `_gpai.swls` utilizando o caractere `@` seguido de dois-pontos:
```swls
@cor-primaria: #2563eb
@fonte-tamanho: 16px
```
Após o registro, a tabela de símbolos as propaga automaticamente para qualquer módulo do ecossistema:
```swls
(button.btn-acao:
  fundo @cor-primaria
  tamanho @fonte-tamanho
)
```

#### P: Como o compilador diferencia pseudo-classes de pseudo-elementos estruturais?
**R:** Ambas as estruturas são interceptadas dentro do aninhamento através do caractere de referência `&`. O gerador traduz o token aplicando um ou dois pontos conforme a especificação CSS:
```swls
(a.link-item:
  &:pairado (
    cor azul
  )
  
  &:depois (
    conteudo "→"
  )
)
```

#### P: Qual é a sintaxe oficial para declaração de consultas de mídia (Media Queries)?
**R:** As mídias devem ser declaradas dentro do escopo do seletor que receberá a responsividade, envelopando a sub-regra calculated com parênteses:
```swls
(div.container-HUD:
  largura 1200px
  
  @media screen e (max-largura: 768px) (
    (div.container-HUD:
      largura 100%
    )
  )
)
```

#### P: Como funciona o aninhamento seguro de seletores (Nesting)?
**R:** Regras declaradas de forma interna herdam o seletor do bloco pai por concatenação direta. O motor MX v2.0.0 garante o isolamento total de propriedades, recomendando um limite máximo de 3 a 4 níveis de profundidade:
```swls
(nav.menu-principal:
  fundo #333333
  
  (ul.lista-itens:
    cor branco
    
    (a.link:
      decoracao nenhum
    )
  )
)
```

#### P: Como funciona a modularização via importação de arquivos externos?
**R:** Arquivos complementares de estilização ou definições de mixins devem ser anexados através do comando `@importar` informando o caminho relativo exato:
```swls
@importar "./layout/grid.swls"
@importar "./componentes/botoes.swls"
```

---

### Processamento e Compilação

#### P: Como direcionar o resultado da compilação para um caminho físico específico?
**R:** Utilize o argumento de saída `-o` seguido do caminho completo do destino final do arquivo CSS:
```bash
node cli/swls.js build estilos.swls -o saida/styles.css
```

#### P: O compilador possui suporte nativo para minificação de código?
**R:** O motor foi projetado para priorizar a integridade sintática e a faxina de strings de funções compostas. Para minificação em pipelines complexos, configure o argumento via instanciação programática da API:
```javascript
const Compiler = require("swl-core");
const compiler = new Compiler({ minify: true });
```

#### P: Quais estratégias devem ser adotadas caso o tempo de compilação apresente lentidão?
**R:** Recomenda-se fragmentar folhas de estilo massivas em pequenos arquivos modulares acoplados por `@importar`, diminuir a profundidade de aninhamentos de seletores e rodar o utilitário `node cli/swls.js lint` para expurgar referências cíclicas ou erros na tabela de símbolos antes de disparar o build final.
### Gerenciamento de Variáveis e Controle de Escopo

#### P: Como o compilador gerencia o ciclo de vida e o escopo de uma variável?
**R:** O motor adota duas políticas de visibilidade baseadas na árvore sintática:
* **Escopo Global**: Variáveis registradas no índice `_gpai.swls` são carregadas automaticamente na tabela de símbolos mestre, ficando visíveis em todos os módulos de forma invisível.
* **Escopo Local**: Variáveis declaradas na raiz de um arquivo `.swls` convencional ou bloco interno ficam restritas àquele arquivo ou subárvore, tornando-se acessíveis por outros módulos apenas após a invocação explícita da diretiva `@importar`.

#### P: É possível realizar a sobrescrita sequencial de variáveis no mesmo escopo?
**R:** Não é recomendado. O pipeline do compilador adota a política de persistência do último valor lido na tabela de símbolos. Declarações duplicadas no mesmo bloco geram sobreposição indesejada de valores, devendo ser evitadas para manter a previsibilidade do build:
```swls
// Prática não recomendada (Evite duplicidade no mesmo bloco)
@cor-alerta: #ffffff
@cor-alerta: #000000
```

---

### Desenvolvimento Baseado em Componentes

#### P: Qual é a sintaxe correta para estruturar um componente isolado e reutilizável?
**R:** Os componentes devem ser declarados na raiz utilizando a diretiva `@componente`, envelopando suas propriedades e seletores de modificação dentro de parênteses estruturais:
```swls
@componente BotaoAcao (
  padding (8px, 16px)
  fundo @cor-primaria
  cor branco
  borda-raio 4px
  
  (&.btn-grande:
    padding (12px, 24px)
    tamanho 18px
  )
  
  &:pairado (
    fundo escuro
  )
)
```

#### P: Como aplicar a metodologia BEM (Block, Element, Modifier) utilizando a referência '&'?
**R:** O caractere `&` atua como um concatenador textual estrito do seletor superior. O aninhamento do motor MX v2.0.0 resolve a junção de elementos e modificadores sem quebrar a estrutura do bloco principal:
```swls
(.hud-card:
  fundo branco
  
  (&__header:
    padding 1rem
    borda-inferior 1px solida #cccccc
  )
  
  (&--destaque:
    borda 2px solida @cor-primaria
  )
  
  (&--desabilitado:
    opacidade 0.5
  )
)
```

#### P: Qual é a arquitetura ideal para estruturar temas claros e escuros nativos?
**R:** Recomenda-se utilizar a diretiva `@tema` para injetar as variáveis correspondentes no escopo `:root` do documento através do seletor de atributos calculado:
```swls
// Declarado em qualquer módulo estrutural do projeto
@tema escuro (
  fundo-card: #1a1a1a
  texto-card: #ffffff
)

(div.hud-card:
  fundo var(--fundo-card)
  cor var(--texto-card)
)
```

---

### Diagnóstico, Erros e Validação

#### P: O linter acusou a falha "Variavel nao definida". Quais etapas de validação devo seguir?
**R:** Siga o protocolo de auditoria em três passos:
1. Certifique-se de que a variável foi devidamente registrada no arquivo global `_gpai.swls`.
2. Verifique se a grafia do nome está correta (o compilador adota distinção estrita de maiúsculas e minúsculas).
3. Caso a variável pertença a um arquivo utilitário isolado, certifique-se de que a diretiva `@importar` foi executada antes da chamada da propriedade.

#### P: O compilador retornou o erro "Arquivo importado nao encontrado". Como corrigir?
**R:** Valide a precisão gramatical do caminho relativo informado, certifique-se de incluir a extensão obrigatória `.swls` e confirme se a grafia de pastas e arquivos respeita o padrão *case-sensitive* do sistema operacional:
```swls
// Exemplo inválido (Falta de extensão e erro de caixa)
@importar "variaveis"
@importar "./VARIAVEIS.swls"

// Exemplo válido (Caminho relativo explícito e íntegro)
@importar "./variaveis.swls"
```

#### P: De que forma é possível ativar o barramento de validação em modo estrito (Strict Mode)?
**R:** No modo estrito, todos os avisos do analisador estático (*warnings*) passam a ser tratados como erros fatais, abortando imediatamente o pipeline. O comportamento pode ser ativado via terminal ou programaticamente:
```bash
node cli/swls.js build meu-arquivo.swls --strict
```
```javascript
const Compiler = require("swl-core");
const compiler = new Compiler({ strict: true });
```

#### P: Como extrair o relatório completo de diagnósticos sem gerar arquivos CSS de saída?
**R:** Invoque o motor do analisador estático diretamente através do terminal:
```bash
node cli/swls.js lint
```

---

### Integração com o Editor (Visual Studio Code)

#### P: Quais os procedimentos oficiais para realizar a instalação da extensão avançada?
**R:** O plugin pode ser instalado diretamente através do painel de extensões do editor buscando pelo termo `Stellar Web Language Styling (SWLS) Tools`, ou de forma automatizada invocando o identificador oficial no console do sistema:
```bash
code --install-extension swl-maycon-developer.swls-language-support
```

#### P: Quais recursos inteligentes de produtividade o plugin injeta no ecossistema de desenvolvimento?
**R:** O suporte avançado da versão 2.0.0 integra cinco microsserviços integrados à API do VS Code:
* Realce de sintaxe (*Syntax Highlighting*) baseado em gramática TextMate Grammar otimizada.
* Modelos de preenchimento rápido (*Snippets*) para expansão simétrica de estruturas dinâmicas.
* Autocompletar inteligente de propriedades, valores e pseudo-classes em português.
* Validação estática e monitoramento de salvamento invisível em segundo plano (*On-Save Build*).
* Painel flutuante de documentação instantânea (*Hover*) exibindo as traduções em tempo real.

#### P: Como utilizar os atalhos de preenchimento rápido (Snippets) de forma produtiva?
**R:** Digite o prefixo identificador da estrutura e pressione a tecla **TAB** para expandir o bloco completo com os pontos de parada do cursor devidamente ordenados:
* `regra` ou `(` ── Exibe o esqueleto base de uma regra sintática envelopada.
* `@se` ── Injeta a estrutura completa de uma avaliação condicional em tempo de compilação.
* `@repetir` ── Expande o laço iterativo multiplicador com variáveis matemáticas.
* `@mixin` ── Instancia um bloco reutilizável de propriedades polimórficas.
* `@componente` ── Gera a assinatura isolada de um componente CSS estável.

---

### Métricas de Performance e Otimização de Código

#### P: Quais diretrizes arquiteturais devem ser adotadas para otimizar folhas de estilo em larga escala?
**R:** Para manter o tempo de resposta do compilador abaixo de milissegundos em projetos robustos, adote as seguintes práticas recomendadas:
1. **Modularização Estrita**: Aloque um componente isolado por arquivo físico `.swls`.
2. **Controle de Aninhamento**: Limite a profundidade de nesting ao teto recomendado de 3 níveis para evitar seletores finais hiper-específicos e pesados para o navegador.
3. **Persistência de Símbolos**: Reutilize propriedades repetitivas atando-as à tabela de variáveis globais.

#### P: O compilador impõe algum teto ou limite físico para o tamanho dos arquivos fonte?
**R:** Não há restrição técnica ou limitação de memória imposta pelo interpretador. Contudo, recomenda-se manter arquivos individuais abaixo do limite de 1000 linhas físicas para garantir a legibilidade do código e otimizar as varreduras de análise do Linter.

#### P: Como gerar arquivos de distribuição finais minificados para ambientes de produção?
**R:** O motor concentra o seu processamento na higienização sintática e colagem de parênteses de funções nativas. Para compressão avançada em esteiras de deploy, acople utilitários externos de pós-processamento diretamente na saída do build:
```bash
node cli/swls.js build estilos.swls && npx csso estilos.css -o estilos.min.css
```
### Integração e Extensibilidade

#### P: De que forma é possível consumir o compilador programaticamente como uma biblioteca Node.js?
**R:** Instancie a classe central do compilador através do pacote oficial e submeta o código fonte bruto ao método de compilação síncrona:
```javascript
const Compiler = require("swl-core");

const compiler = new Compiler();
const result = compiler.compile(codigoFonteBruto);

if (result.success) {
  console.log(result.css);
} else {
  console.error(result.error);
}
```

#### P: É possível executar o compilador SWLS diretamente no ambiente de runtime dos navegadores?
**R:** O motor Core MX foi arquitetado para atuar estritamente em tempo de build (build-time), processando a Árvore Sintática Abstrata (AST) no lado do servidor. Para a execução direta em navegadores (browser runtime) utilizando interpreters puros por baixo, as diretivas estão sendo estruturadas para o roadmap de atualizações futuras.

---

### Governança e Contribuição

#### P: Quais os procedimentos para submeter contribuições e melhorias ao projeto?
**R:** O fluxo de contribuição segue o padrão estabelecido pela comunidade de código aberto:
1. Realize o Fork do repositório oficial no GitHub.
2. Crie uma branch de funcionalidade isolada (feature branch).
3. Submeta commits documentados com descrições claras e impessoais.
4. Execute o push da sua branch e abra um Pull Request detalhando as alterações.

#### P: Encontrei uma falha de processamento léxico ou sintático. Como reportar?
**R:** Abra uma notificação oficial de erro (Issue) diretamente no canal de engenharia do repositório: [https://github.com/swl-maycon/swlLang/issues](https://github.com/swl-maycon/swlLang/issues). Certifique-se de incluir a descrição técnica do comportamento esperado, o bloco de código fonte SWLS que causou a falha, a versão exata do compilador e as especificações do sistema operacional utilizado.

---

## Matriz de Avaliação Técnica (Checklists de Progresso)

### Nível Inicial: Fundamentos e Operação
* [ ] Validação do ambiente local atendendo ao requisito do Node.js igual ou superior à versão 16.x.
* [ ] Instalação bem-sucedida do pacote utilitário global via NPM (`npm install swl-core -g`).
* [ ] Inicialização de um escopo de controle local de projeto através da diretiva `swls init`.
* [ ] Manipulação de variáveis de escopo global no arquivo de índice `_gpai.swls`.
* [ ] Estruturação de regras de estilo básicas utilizando delimitadores de parênteses `()`.
* [ ] Execução bem-sucedida do pipeline de compilação através do comando `swls build`.
* [ ] Auditoria e validação visual do código CSS nativo gerado no arquivo de saída.
* [ ] Instalação e ativação da extensão oficial avançada no Visual Studio Code.
* [ ] Monitoramento automatizado de arquivos em tempo de design utilizando o comando `swls watch`.
* [ ] Implementação de estruturas modulares simples através da diretiva `@importar`.

### Nível Intermediário: Integração e Arquitetura
* [ ] Domínio prático de estruturas com aninhamento profundo (Nesting) sem sobreposição de chaves.
* [ ] Gerenciamento avançado de pilhas de escopo local de variáveis em sub-regras de terceira camada.
* [ ] Modelagem de classes utilitárias e componentes isolados aplicando a metodologia semântica BEM.
* [ ] Implementação de mapas de variáveis de temas customizados acionados via diretiva `@tema`.
* [ ] Estruturação de projetos em escala complexa utilizando múltiplos arquivos físicos interligados.
* [ ] Execução contínua do analisador estático `swls lint` para higienização e prevenção de erros.
* [ ] Implementação de blocos funcionais reutilizáveis polimórficos através de `@mixin` e `@incluir`.

### Nível Avançado: Engenharia e Otimização do Núcleo
* [ ] Leitura completa e compreensão dos fluxos estabelecidos no arquivo `DOCUMENTACAO_TECNICA.md`.
* [ ] Entendimento absoluto das fases do pipeline de compilação (Análise Léxica, Sintática e Geração).
* [ ] Integração e manipulação programática da API pública do compilador em microsserviços Node.js.
* [ ] Desenvolvimento ou customização de regras gramaticais TextMate para realce de sintaxe no editor.
* [ ] Otimização do tempo de resposta do build através de boas práticas e arquiteturas limpas.
* [ ] Compreensão e capacidade de manutenção nos módulos internos: Tokenizer, Parser e Generator.

---

## Endereços Eletrônicos Oficiais de Referência

* **Repositório GitHub**: [https://github.com/swl-maycon/swlLang](https://github.com/swl-maycon/swlLang)
* **Pacote NPM Oficial**: [https://www.npmjs.com/package/swl-core](https://www.npmjs.com/package/swl-core)
* **Visual Studio Marketplace**: [https://marketplace.visualstudio.com/items?itemName=swl-maycon-developer.swls-language-support](https://marketplace.visualstudio.com/items?itemName=swl-maycon-developer.swls-language-support)
* **Perfil do Autor**: [https://github.com/swl-maycon](https://github.com/swl-maycon)

---

## Fontes Complementares de Aprendizado e Suporte

### Documentação Escrita
* `README.md` — Manual de referência rápida, instalação e comandos de linha de comando.
* `MANUAL_ESTUDO.md` — Tutorial progressivo passo a passo focado em design patterns e treinamento.
* `DOCUMENTACAO_TECNICA.md` — Especificação profunda da arquitetura de engenharia do software.

### Suporte Comunitário
* **GitHub Issues**: Canal aberto para submissão de relatórios de falhas, dúvidas arquiteturais e propostas de novas funcionalidades técnicos.
* **Repositório de Exemplos**: Consulta ao arquivo `TEMPLATE_PROJETO.md` para clonagem de esqueletos de produção homologados.

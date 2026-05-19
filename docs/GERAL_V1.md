
# SkyRunner Analytics — Documentação do Sistema

Este documento apresenta a especificação funcional, o projeto arquitetural e a organização estrutural do projeto **SkyRunner Analytics**, desenvolvido para a disciplina de Desenvolvimento de Aplicações Distribuídas (DAD) do curso de Engenharia de Computação da Universidade Federal do Ceará (UFC).

---

## 1. Visão Geral do Projeto

O **SkyRunner Analytics** é um sistema distribuído de suporte à decisão projetado para atletas de atividades ao ar livre (corrida, ciclismo, trilhas). Diferente de sistemas meteorológicos tradicionais que apenas exibem dados brutos, esta plataforma atua correlacionando variáveis ambientais em tempo real com **limiares dinâmicos de conforto e segurança** parametrizados individualmente pelos usuários.

O objetivo do sistema é converter dados meteorológicos complexos em respostas binárias ou qualitativas diretas (*"Sinal Verde/Amarelo/Vermelho"*) para a prática esportiva, mitigando riscos de estresse térmico, acidentes por rajadas de vento ou exposição a índices críticos de radiação UV.

---

## 2. Cenário de Uso (Caso de Uso Principal)

1. **Parametrização:** Um ciclista se cadastra na plataforma e define suas restrições de treino: *Velocidade máxima do vento: 18km/h; Temperatura máxima: 32°C; Probabilidade de chuva: < 20%*.
2. **Análise de Viabilidade:** Ao planejar um treino para o dia seguinte, o usuário consulta o mapa interativo. O sistema busca a previsão local e aplica o motor de regras.
3. **Decisão Automatizada:** Se a previsão indicar ventos de 22km/h para o horário escolhido, a interface exibirá um alerta visual vermelho ("Não Recomendado") especificamente para a modalidade de ciclismo desse usuário, sugerindo horários alternativos onde os limites de segurança não sejam violados.

---

## 3. Requisitos Funcionais

*   **RF01 - Gestão de Perfis e Autenticação:** Cadastro, login e persistência segura de usuários e suas respectivas sessões.
*   **RF02 - Configuração de Limiares Esportivos:** Interface para o usuário definir limites personalizados de temperatura, umidade, vento e chuva por modalidade.
*   **RF03 - Painel Geográfico Interativo:** Visualização cartográfica com marcadores e mapas de calor coloridos indicando a adequação de locais favoritos.
*   **RF04 - Sincronização Meteorológica Autônoma:** Coleta periódica automatizada de dados climáticos via integração com APIs públicas externas.
*   **RF05 - Geração de Relatórios em Background (Blobs):** Compilação assíncrona de relatórios semanais agregados de condições climáticas em formato PDF para download.

---

## 4. Arquitetura de Infraestrutura AWS (Sistemas Distribuídos)

A aplicação adota uma arquitetura totalmente desacoplada e distribuída na **Amazon Web Services (AWS)**, segregando armazenamento de arquivos estáticos, lógica de microsserviços, persistência estruturada e computação orientada a eventos (*Serverless*).


```

```
                  +-----------------------------+
                  |     Usuário (Navegador)     |
                  +--------------+--------------+
                                 |
          +----------------------+----------------------+
          | (Acesso HTTP/S)                             | (Requisições REST API)
          v                                             v

```

+-----------+-----------+                     +-----------+-----------+
|    Amazon CloudFront  |                     |  EC2 Instância 01     |
+-----------+-----------+                     |  (Node.js / Express)  |
|                                 +-----+-----+-----+-----+
v                                       |     |     |
+-----------+-----------+                           |     |     +--------+
|  Amazon S3 Bucket     |                           |     |              | (AWS SDK)
|  (Static Web Hosting) |                           |     |              v
+-----------------------+                           |     |   +----------+----------+
|     |   |  Amazon S3 Bucket   |
+-----------------------------------------+     |   |  (PDF Blobs / Logs) |
| (Mongoose Connection)                         |   +---------------------+
v                                               v
+---------+-----------+                       +-----------+-----------+
|  EC2 Instância 02   | <---------------------+      AWS Lambda       |
|  (MongoDB Server)   |  (Atualização Ingest) |  (Cron EventBridge)   |
+---------------------+                       +-----------+-----------+
|
v
+-----------+-----------+
| External Weather API  |
+-----------------------+

```

### Detalhamento dos Componentes

| Componente | Tecnologia Utilizada | Justificativa Arquitetural |
| :--- | :--- | :--- |
| **Frontend Hosting** | **Amazon S3** | Armazena o *build* estático do React de forma agnóstica e barata, sem consumir processamento de servidores de aplicação. |
| **Edge Delivery (CDN)** | **Amazon CloudFront** | Distribui globalmente os arquivos do front por meio de réplicas em *Edge Locations*, provê cache, reduz latência de entrega e injeta criptografia SSL (HTTPS). |
| **Servidor de Aplicação**| **Amazon EC2 (Instância 01)**| Instância Linux rodando o ambiente Node.js. Isola a lógica de rotas, processamento de regras do motor e orquestração de microsserviços. |
| **Camada de Dados** | **Amazon EC2 (Instância 02)**| Servidor dedicado para o ecossistema MongoDB. Garante o isolamento físico dos dados de usuários, índices e regras estruturadas, respondendo apenas a requisições internas da rede. |
| **Processamento Serverless**| **AWS Lambda** | Função assíncrona ativada por tempo via *Amazon EventBridge*. Isola o fluxo pesado de ingestão e normalização da API externa de clima, eliminando processos concorrentes concorrendo por recursos na EC2 principal. |
| **Armazenamento de Objetos**| **Amazon S3 (Blobs) + SDK**| Utilizado para salvar os relatórios em PDF de forma desacoplada. O backend manipula esse repositório de arquivos usando a biblioteca nativa `@aws-sdk/client-s3`, salvando apenas referências textuais (URLs) no banco de dados. |
| **Políticas de Segurança** | **AWS IAM Roles** | Camada de governança que atribui permissões granulares de execução às máquinas virtuais e lambdas sem a necessidade de expor chaves ou credenciais estáticas dentro do código-fonte. |

---

## 5. Dinâmica e Fluxos de Dados do Sistema

O sistema opera sob três fluxos distribuídos assíncronos principais:

### Fluxo A: Ingestão de Dados Meteorológicos (Background)
1. O **Amazon EventBridge** dispara um evento de gatilho a cada 60 minutos.
2. A **AWS Lambda** é inicializada, consome os dados em tempo real da *OpenWeather API*, calcula os índices esportivos básicos baseados em geolocalização e grava os registros normalizados diretamente no **MongoDB (EC2-02)**.
3. A Lambda encerra sua execução, retornando ao estado dormente.

### Fluxo B: Consumo de Dados pelo Usuário (Síncrono)
1. O usuário requisita o dashboard a partir do cliente (servido pelo **CloudFront/S3**).
2. O frontend dispara uma requisição HTTP REST para o **Backend (EC2-01)**.
3. O Backend consulta os limiares do usuário logado e os dados meteorológicos atuais no **MongoDB (EC2-02)**, executa o cruzamento de dados e responde ao cliente com a avaliação final processada.

### Fluxo C: Geração de Relatórios de Mídia (Blob via SDK)
1. O usuário solicita a exportação do histórico climático da semana.
2. A API em Node.js compila os dados históricos em um arquivo binário binário (PDF) em memória.
3. Através do método `PutObjectCommand` do **AWS SDK**, o backend envia o PDF para o bucket de armazenamento de Blobs no **Amazon S3**.
4. O S3 retorna o sucesso da operação e o backend disponibiliza uma URL segura para o usuário realizar o download do arquivo de forma direta.

---

## 6. Organização do Repositório (Monorepo)

O projeto adota uma estrutura unificada de controle de versão para facilitar a interoperabilidade de tipos, documentação comum e deploy automatizado:

```text
skyrunner-analytics/
├── frontend/            # Single Page Application desenvolvida em React.js + TypeScript
│   ├── src/             # Componentes, rotas, hooks e integração com mapas (Leaflet)
│   ├── public/          # Ativos e ícones estáticos locais
│   └── package.json     # Scripts de build do frontend (Vite)
├── backend/             # API RESTful desenvolvida em Node.js + Express + TypeScript
│   ├── src/             # Controllers, Middlewares de Auth, Schemas de dados e Serviços
│   │   └── services/    # Módulos de integração usando o AWS SDK Client S3
│   └── package.json     # Gerenciamento de dependências do servidor de aplicação
├── lambda/              # Script serverless autônomo em Node.js para tarefas em background
│   ├── index.ts         # Ponto de entrada do script de sincronização cronometrada
│   └── package.json     # Dependências exclusivas do worker de processamento
├── infra/               # Esquemas de arquitetura, políticas IAM e configurações cloud
├── .gitignore           # Regras globais recursivas de exclusão do Git
└── README.md            # Guia de documentação principal do projeto

```

---

## 7. Estratégia de Segurança e Isolamento de Rede

Para garantir a conformidade com as diretrizes de desenvolvimento seguro e sistemas distribuídos, a comunicação interna obedecerá as seguintes regras de *Security Groups*:

* A **Instância de Banco de Dados (EC2-02)** fechará sua porta de conexão (ex: `27017`) para a internet pública, aceitando conexões exclusivamente originadas pelo IP privado da **Instância de API (EC2-01)** e da **AWS Lambda**.
* A comunicação com o bucket de blobs do S3 não usará credenciais estáticas de usuário (`AWS_ACCESS_KEY_ID`); em vez disso, será autorizada dinamicamente por uma **IAM Instance Profile** vinculada nativamente ao hardware virtual da EC2 de aplicação.

```

```
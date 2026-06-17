
# SkyRunner Analytics — Documentação do Sistema

Este documento apresenta a especificação funcional e o projeto arquitetural do projeto **SkyRunner Analytics**, desenvolvido para a disciplina de Desenvolvimento de Aplicações Distribuídas (DAD) do curso de Engenharia de Computação da Universidade Federal do Ceará (UFC).

> **Nota:** este documento foi atualizado para refletir a arquitetura atualmente em uso. A versão original descrevia um desenho baseado em AWS (S3/CloudFront/EC2/Lambda/EventBridge) que foi abandonado — ver seção 4.

---

## 1. Visão Geral do Projeto

O **SkyRunner Analytics** é um sistema de suporte à decisão projetado para atletas de atividades ao ar livre (corrida, ciclismo, calistenia, surf, kitesurf). Diferente de sistemas meteorológicos tradicionais que apenas exibem dados brutos, esta plataforma atua correlacionando variáveis ambientais em tempo real com **limiares dinâmicos de conforto e segurança** parametrizados individualmente pelos usuários.

O objetivo do sistema é converter dados meteorológicos complexos em respostas qualitativas diretas (*"Recomendado / Atenção / Não Recomendado"*) para a prática esportiva, considerando temperatura, umidade, vento, heat index e wind chill.

---

## 2. Cenário de Uso (Caso de Uso Principal)

1. **Parametrização:** Um ciclista se cadastra na plataforma e define suas restrições de treino (temperatura, umidade e vento máximos por modalidade), com a opção de usar limites padrão por esporte.
2. **Análise de Viabilidade:** Ao planejar um treino, o usuário consulta o mapa interativo e seleciona um ponto ou desenha uma rota. O sistema busca a previsão local (via Open-Meteo) e aplica o motor de pontuação de conforto.
3. **Decisão Automatizada:** A interface exibe um veredito (Excelente/Bom/Moderado/Ruim) e o score de conforto para a modalidade escolhida, coloridos no mapa por variável (temperatura, umidade, vento, heat index, wind chill ou conforto).

---

## 3. Requisitos Funcionais

* **RF01 - Gestão de Perfis e Autenticação:** Cadastro, login e persistência de usuários via JWT.
* **RF02 - Configuração de Limiares Esportivos:** Interface para o usuário definir limites personalizados de temperatura, umidade e vento por modalidade.
* **RF03 - Painel Geográfico Interativo:** Visualização cartográfica (Leaflet) com locais favoritos, busca de endereços e mapa colorido por variável climática.
* **RF04 - Avaliação de Pontos e Rotas:** Avaliação de um ponto único ou de uma rota (com trechos críticos identificados) para uma modalidade esportiva.
* **RF05 - Geração de Relatórios:** Geração de relatórios (semanal/mensal/personalizado) a partir do histórico de avaliações.
* **RF06 - Histórico de Buscas e Favoritos:** Persistência de locais favoritos (pontos e rotas) e histórico de buscas por usuário.

---

## 4. Arquitetura Atual

A aplicação é composta por dois projetos independentes que rodam localmente (sem dependência de infraestrutura cloud):

```
┌─────────────────────────┐        /api (proxy Vite)        ┌──────────────────────────┐
│  sky-for-athletes/       │ ─────────────────────────────▶ │  SportsWeather-Back/      │
│  frontend (React + Vite) │ ◀───────────────────────────── │  API (Express + TS)       │
└─────────────────────────┘             JSON                └──────────────┬───────────┘
                                                                             │ Mongoose
                                                                             ▼
                                                              ┌──────────────────────────┐
                                                              │  MongoDB 8 (Docker)       │
                                                              └──────────────┬───────────┘
                                                                             │
                                                                             ▼
                                                              ┌──────────────────────────┐
                                                              │  Open-Meteo API           │
                                                              │  (sem API key)            │
                                                              └──────────────────────────┘
```

### Detalhamento dos Componentes

| Componente | Tecnologia | Observação |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + TailwindCSS + Leaflet | Em `sky-for-athletes/frontend/`. Dev server na porta 5173, proxy `/api` → `localhost:8080`. |
| **Backend / API** | Express 5 + TypeScript + Mongoose | Em `SportsWeather-Back/` (repositório separado). Roda na porta 8080. |
| **Banco de dados** | MongoDB 8 via Docker Compose | Definido em `SportsWeather-Back/SportsWeather-Database/`. |
| **Provedor de clima** | Open-Meteo (gratuito, sem API key) | Implementado em `SportsWeather-Back/src/services/openmeteo.service.ts`. |

`sky-for-athletes/backend` e `sky-for-athletes/lambda` (desenho anterior baseado em AWS) foram removidos — a API ativa é a `SportsWeather-Back`.

---

## 5. Fluxos de Dados do Sistema

### Fluxo A: Avaliação de Ponto/Rota (Síncrono)
1. O usuário seleciona um ponto ou desenha uma rota no mapa do frontend.
2. O frontend chama `GET /api/weather/evaluate` (ponto) ou `POST /api/weather/evaluate-route` (rota) na API.
3. A API busca a previsão atual no Open-Meteo, calcula heat index, wind chill e o score de conforto para a modalidade, e responde com o veredito.

### Fluxo B: Favoritos e Histórico
1. O usuário salva um local ou rota como favorito (`POST /api/locations/favorites`).
2. Buscas de endereço (Nominatim) e seleções de favoritos são registradas no histórico de busca do usuário.

### Fluxo C: Geração de Relatórios
1. O usuário solicita um relatório (`POST /api/reports/generate`).
2. A API compila os dados e disponibiliza o relatório para download (`GET /api/reports/download`).

---

## 6. Organização do Repositório

Ver `sky-for-athletes/docs/ORGANIZACAO.md` para a estrutura de diretórios do frontend, e `SportsWeather-Back/AGENTS.md` para a estrutura completa da API.

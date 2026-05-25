# SkyRunner Analytics — Organização do Projeto

## 1. Estrutura de Diretórios

```
sky-for-athletes/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Handlers de req/res (auth, thresholds, reports)
│   │   ├── middlewares/        # Auth JWT, error handler, validação
│   │   ├── models/            # Schemas Mongoose (User, Threshold, WeatherData, Report)
│   │   ├── routes/            # Definição de rotas Express
│   │   ├── services/          # Lógica de negócio + AWS S3 SDK
│   │   ├── types/             # Interfaces e tipos compartilhados
│   │   ├── utils/             # Helpers (geração PDF, cálculos)
│   │   └── index.ts           # Entry point (bootstrap Express)
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis (Map, Marker, Card, Button)
│   │   ├── pages/             # Páginas da SPA (Login, Dashboard, Settings, Reports)
│   │   ├── hooks/             # Custom hooks (useAuth, useWeather, useThresholds)
│   │   ├── services/          # Chamadas Axios para API backend
│   │   ├── contexts/          # React Context (AuthContext, ThemeContext)
│   │   ├── types/             # Interfaces compartilhadas do cliente
│   │   ├── utils/             # Helpers de formatação e validação
│   │   ├── App.tsx            # Componente raiz com React Router
│   │   └── main.tsx           # Entry point (renderiza App)
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── lambda/
│   ├── src/
│   │   ├── handlers/          # Handlers dos triggers (syncWeather)
│   │   ├── services/          # Cliente OpenWeather API
│   │   ├── types/             # Tipos específicos da Lambda
│   │   └── index.ts           # Entry point do handler principal
│   ├── package.json
│   └── tsconfig.json
│
├── infra/                     # Esquemas de arquitetura, IAM, Security Groups
│
└── docs/
    ├── GERAL_V1.md            # Especificação funcional e arquitetural
    └── ORGANIZACAO.md         # Este documento
```

---

## 2. Propósito de Cada Pasta

### Backend (`backend/src/`)

| Pasta | Responsabilidade |
|---|---|
| `controllers/` | Receber requisições HTTP, extrair dados, delegar a serviços, montar resposta |
| `middlewares/` | Interceptar req/res (autenticação JWT, validação de entrada, tratamento de erros) |
| `models/` | Definir schemas Mongoose com validação e tipos嵌入 |
| `routes/` | Mapear endpoints HTTP para controllers |
| `services/` | Lógica de negócio pura (motor de regras, cálculos, integração AWS SDK S3) |
| `types/` | Interfaces TypeScript (IUser, IThreshold, IWeatherData) |
| `utils/` | Funções auxiliares (gerar PDF, converter unidades, formatar datas) |

### Frontend (`frontend/src/`)

| Pasta | Responsabilidade |
|---|---|
| `components/` | Componentes React reutilizáveis (Mapa Leaflet, Cartão de Clima, Indicador Verde/Amarelo/Vermelho) |
| `pages/` | Páginas completas associadas a rotas (Login, Dashboard, Configurações, Relatórios) |
| `hooks/` | Custom hooks para lógica com estado (autenticação, dados climáticos, limites do usuário) |
| `services/` | Módulos Axios com chamadas para API REST do backend |
| `contexts/` | Contextos React para estado global (ex: usuário logado) |
| `types/` | Interfaces e enums do lado cliente (correspondem aos tipos do backend) |
| `utils/` | Helpers de formatação de data, validação de inputs |

### Lambda (`lambda/src/`)

| Pasta | Responsabilidade |
|---|---|
| `handlers/` | Funções handler invocadas pelo EventBridge (ex: sincronizar clima a cada 60min) |
| `services/` | Integração com APIs externas (OpenWeather) |
| `types/` | Tipos específicos da resposta da API externa |

---

## 3. Mapeamento Requisitos Funcionais ↔ Módulos

| RF | Descrição | Backend | Frontend |
|---|---|---|---|
| RF01 | Gestão de Perfis e Autenticação | `controllers/auth`, `models/User`, `middlewares/auth` | `pages/Login`, `contexts/AuthContext`, `services/api.ts` |
| RF02 | Configuração de Limiares Esportivos | `controllers/thresholds`, `models/Threshold`, `services/ruleEngine` | `pages/Settings`, `hooks/useThresholds` |
| RF03 | Painel Geográfico Interativo | `services/weather` (servir dados) | `pages/Dashboard`, `components/Map`, `hooks/useWeather` |
| RF04 | Sincronização Meteorológica Autônoma | `lambda/handlers/syncWeather`, `lambda/services/openWeather` | — |
| RF05 | Geração de Relatórios em Background | `controllers/reports`, `services/report` (PDF + S3) | `pages/Reports`, `services/api.ts` |

---

## 4. Fluxos de Dados por Arquivo

### Fluxo A: Ingestão de Dados Meteorológicos (Background)

```
EventBridge (60min)
  → lambda/src/handlers/syncWeather.ts
    → lambda/src/services/openWeather.ts (fetch OpenWeather API)
      → MongoDB (EC2-02) — coleção weather_data
```

### Fluxo B: Consumo de Dados pelo Usuário (Síncrono)

```
Navegador → frontend/src/pages/Dashboard.tsx
  → frontend/src/hooks/useWeather.ts
    → frontend/src/services/api.ts (GET /api/weather)
      → backend/src/routes/weather.ts
        → backend/src/controllers/weather.ts
          → backend/src/services/ruleEngine.ts (cruzamento limiares + dados)
            → backend/src/models/ (User, Threshold, WeatherData)
              → Resposta JSON → frontend → componente indicador
```

### Fluxo C: Geração de Relatórios (Blob via SDK)

```
Usuário → frontend/src/pages/Reports.tsx
  → frontend/src/services/api.ts (POST /api/reports)
    → backend/src/controllers/reports.ts
      → backend/src/services/report.ts (compila PDF)
        → AWS SDK PutObjectCommand → S3 Bucket
          → URL de download → resposta → frontend
```

---

## 5. Convenções

### Nomenclatura
- **Arquivos**: `camelCase.ts` (ex: `authController.ts`, `ruleEngine.ts`)
- **Classes/Interfaces**: `PascalCase` (ex: `IUser`, `AuthController`)
- **Pastas**: `kebab-case` (ex: `rule-engine/` se houver múltiplos arquivos, senão `services/`)
- **Rotas REST**: plural, kebab-case (ex: `/api/users`, `/api/weather-data`)

### Exports
- Preferir `export default` para o elemento principal do arquivo (um controller, um service)
- Usar `export named` para tipos, interfaces, utilitários

### Tipagem
- Manter tipos sincronizados entre `backend/src/types/` e `frontend/src/types/`
- Usar interfaces com prefixo `I` (ex: `IUser`, `IThreshold`)
- Schemas Mongoose devem ter tipagem estrita com interface associada

---

## 6. Scripts de Desenvolvimento

```bash
# Backend (usando tsx para hot-reload)
cd backend && npx tsx watch src/index.ts

# Frontend
cd frontend && npm run dev

# Lambda (teste local)
cd lambda && npx tsx src/index.ts
```

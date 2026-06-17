# SkyRunner Analytics — Organização do Projeto

> Este documento cobre apenas `sky-for-athletes/frontend`. A API ativa (`SportsWeather-Back`) é um repositório separado — ver `SportsWeather-Back/AGENTS.md` para sua estrutura, rotas e setup de banco de dados.

## 1. Estrutura de Diretórios

```
sky-for-athletes/
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis (mapa Leaflet, modais, seletor de esporte, toggle de variável, etc.)
│   │   ├── pages/             # Páginas da SPA (LandingPage, Login, Signup, Dashboard, Settings, Reports)
│   │   ├── hooks/              # Custom hooks (useAuth, useWeather, useFavorites, useSearchHistory, useLocationPicker)
│   │   ├── services/          # Chamadas Axios para a API (auth, location, weather, report, user)
│   │   ├── contexts/          # AuthContext (estado de autenticação global)
│   │   ├── types/             # Interfaces e tipos compartilhados do lado cliente
│   │   ├── utils/             # Helpers (color scale do mapa, mensagens de erro, geocoding Nominatim)
│   │   ├── App.tsx            # Componente raiz com React Router
│   │   └── main.tsx           # Entry point (renderiza App)
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts          # Proxy de /api → http://localhost:8080
│
└── docs/
    ├── GERAL_V1.md             # Especificação funcional e arquitetural
    └── ORGANIZACAO.md          # Este documento
```

---

## 2. Propósito de Cada Pasta (`frontend/src/`)

| Pasta | Responsabilidade |
|---|---|
| `components/` | Mapa (Leaflet), modais (Preferências, Relatórios), seletor de esporte, toggle de variável climática, histórico de busca, planejador de rota |
| `pages/` | Páginas completas associadas a rotas (LandingPage, Login, Signup, Dashboard, Settings, Reports) |
| `hooks/` | Lógica com estado (autenticação, avaliação climática, favoritos, histórico de busca, seleção de local) |
| `services/` | Módulos Axios com chamadas para a API REST (`SportsWeather-Back`) |
| `contexts/` | Contexto React de autenticação (usuário logado, token) |
| `types/` | Interfaces e enums do lado cliente (esportes, variáveis climáticas) |
| `utils/` | Helpers de formatação, color scale do mapa e geocoding (Nominatim) |

---

## 3. Mapeamento Requisitos Funcionais ↔ Módulos

| RF | Descrição | Frontend |
|---|---|---|
| RF01 | Gestão de Perfis e Autenticação | `pages/Login`, `pages/Signup`, `contexts/AuthContext`, `services/auth.service.ts` |
| RF02 | Configuração de Limiares Esportivos | `pages/Settings`, `components/SettingsModal`, `components/PreferenceForm` |
| RF03 | Painel Geográfico Interativo | `pages/Dashboard`, `components/WeatherMap`, `components/LocationPicker`, `components/VariableToggle` |
| RF04 | Avaliação de Pontos e Rotas | `hooks/useWeather`, `components/RoutePlanner`, `components/RouteResult` |
| RF05 | Geração de Relatórios | `pages/Reports`, `components/ReportsModal`, `services/report.service.ts` |
| RF06 | Histórico de Buscas e Favoritos | `hooks/useFavorites`, `hooks/useSearchHistory`, `components/FavoriteLocations`, `components/SearchHistory` |

---

## 4. Fluxo de Dados por Arquivo (Avaliação de Ponto)

```
Navegador → frontend/src/pages/Dashboard.tsx
  → frontend/src/hooks/useWeather.ts
    → frontend/src/services/weather.service.ts (GET /api/weather/evaluate)
      → SportsWeather-Back (Express, repositório separado)
        → Open-Meteo API
          → Resposta JSON → frontend → WeatherMap / WeatherCard
```

---

## 5. Convenções

### Nomenclatura
- **Arquivos**: `PascalCase.tsx` para componentes/páginas, `camelCase.ts` para hooks/services/utils
- **Tipos/Interfaces**: `PascalCase` (ex: `WeatherEvaluation`, `FavoriteLocation`)
- **Rotas REST consumidas**: plural, kebab-case (ex: `/api/locations/favorites`)

### Exports
- Preferir `export default` para o elemento principal do arquivo (um componente, uma página)
- Usar `export` nomeado para tipos, interfaces e utilitários

---

## 6. Scripts de Desenvolvimento

```bash
# Frontend
cd frontend && npm run dev      # Vite dev server (porta 5173)
cd frontend && npm run lint     # ESLint
cd frontend && npm run build    # tsc -b && vite build
```

Para o setup completo (banco de dados + API), ver `SportsWeather-Back/AGENTS.md` e a raiz do projeto (`CLAUDE.md`).

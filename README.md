# organiza-ai

Plataforma de organização e gestão financeira pessoal.

## Estrutura

- `/backend`: API Node.js com Express, Prisma, autenticação JWT e CRUD completo.
- `/frontend`: Aplicação React com login, dashboard e telas de gestão financeira.

## Backend

1. `cd /home/runner/work/organiza-ai/organiza-ai/backend`
2. Copie `.env.example` para `.env` se necessário.
3. Execute `npm run prisma:migrate`
4. Execute `npm run dev`

## Frontend

1. `cd /home/runner/work/organiza-ai/organiza-ai/frontend`
2. Configure `VITE_API_URL` (opcional, padrão `http://localhost:3000/api`)
3. Execute `npm run dev`

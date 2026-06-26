# organiza-ai

Plataforma de organização e gestão financeira pessoal.

## Estrutura

- `/backend`: API Node.js com Express, Prisma, autenticação JWT e CRUD completo.
- `/frontend`: Aplicação React com login, dashboard e telas de gestão financeira.

## Backend

1. `cd backend`
2. Execute `npm install`
3. Copie `.env.example` para `.env` se necessario.
4. Execute `npm run prisma:migrate`
5. Execute `npm run dev`

### Seed local

- Execute `npm run seed` para criar ou atualizar um usuario local de teste.
- Credenciais: `testuser` / `Test1234!`

## Frontend

1. `cd frontend`
2. Configure `VITE_API_URL` (opcional, padrão `http://localhost:3000/api`)
3. Execute `npm run dev`

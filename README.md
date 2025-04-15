# Horus API

Este é o projeto da API e frontend do Horus, um sistema de monitoramento e métricas de aplicações.

## Funcionalidades

- API para receber e armazenar métricas e logs do Horus
- Interface web para visualização de métricas e logs
- Integração com o middleware Horus

## Tecnologias

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (ORM)
- PostgreSQL

## Estrutura do Projeto

```
src/
  ├── app/           # Rotas e páginas da aplicação
  ├── components/    # Componentes React reutilizáveis
  ├── lib/          # Utilitários e configurações
  ├── prisma/       # Schema e migrações do banco de dados
  └── types/        # Definições de tipos TypeScript
```

## Pré-requisitos

- Node.js 18.x ou superior
- PostgreSQL 12.x ou superior
- npm ou yarn

## Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/horus-api.git
cd horus-api
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/horus_db?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

5. Execute as migrações do banco de dados:
```bash
npm run prisma:migrate
# ou
yarn prisma:migrate
```

6. Popule o banco de dados com dados de exemplo:
```bash
npm run prisma:seed
# ou
yarn prisma:seed
```

7. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

8. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Métricas
- `POST /api/metrics` - Recebe métricas do Horus
  ```json
  {
    "appName": "nome-da-app",
    "endpoint": "/api/endpoint",
    "method": "GET",
    "duration": 150.5,
    "status": 200,
    "metadata": {}
  }
  ```
- `GET /api/metrics` - Lista métricas armazenadas
  - Query params:
    - `page`: número da página (padrão: 1)
    - `limit`: itens por página (padrão: 10)
    - `appName`: filtrar por aplicação

### Logs
- `POST /api/logs` - Recebe logs do Horus
  ```json
  {
    "appName": "nome-da-app",
    "level": "INFO",
    "message": "Mensagem do log",
    "context": {},
    "trace": "Stack trace (opcional)"
  }
  ```
- `GET /api/logs` - Lista logs armazenados
  - Query params:
    - `page`: número da página (padrão: 1)
    - `limit`: itens por página (padrão: 10)
    - `appName`: filtrar por aplicação
    - `level`: filtrar por nível (ERROR, WARN, INFO)

## Integração com o Horus

Para integrar sua aplicação com o Horus, você precisa:

1. Instalar o middleware Horus em sua aplicação
2. Configurar o endpoint da API do Horus para apontar para este projeto
3. Enviar métricas e logs através dos endpoints `/api/metrics` e `/api/logs`

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.


# Encurtador de links - API

## RF (Requisitos funcionais)

  - [x]  Deve ser possível criar um link;
  - [x]  Deve ser possível deletar um link;
  - [x]  Deve ser possível obter a URL original por meio de uma URL encurtada;
  - [x]  Deve ser possível listar todas as URL’s cadastradas;
  - [x]  Deve ser possível incrementar a quantidade de acessos de um link;
  - [x]  Deve ser possível exportar os links criados em um CSV.

## RN (Regras de negócio)

  - [x]  Não deve ser possível criar um link com URL encurtada mal formatada;
  - [x]  Não deve ser possível criar um link com URL encurtada já existente.

## RNF (Requisitos não funcionais)

  - [ ]  Deve ser possível acessar o CSV por meio de uma CDN (Amazon S3, Cloudflare R2, etc);
  - [ ]  Deve ser gerado um nome aleatório e único para o arquivo;
  - [ ]  Deve ser possível realizar a listagem de forma performática;
  - [x]  O CSV deve ter campos como, URL original, URL encurtada, contagem de acessos e data de criação;
  - [x] Obrigatório o uso de TypeScript;
  - [x] Obrigatório o uso de Fastify;
  - [ ] Obrigatório o uso de Drizzle;
  - [ ] Obrigatório o uso de Postgres.
    
# Projeto Node.js com Knex.js e Express

## Configuração

#### Para iniciar o projeto sem problemas siga os passos abaixo:

1. Instalar ad dependencias:

   ```shell
   cd <projeto>
   npm install

2. Instalar Knex:

    ```shell
    npm install -g knex

3. Instalar nodemon:
    ```shell
    npm install -g nodemon

4. Iniciar projeto
    ```shell
    npm start

### Migrations

O projeto usa o knex para controlar o versionamento de banco de dados. A nossa base (Postgres) se encontra hospedada em um servidor online conforma descrito no arquivo .env, caso seja necessário usar a base de dados, siga os passos abaixo:

1. Criar migration:

```shell
knex migrate:make nome-migration
```

2. Commit migration:
```shell
knex migrate:up

Após rodar o projeto e abrir no navegador efetuar login com o usuário abaixo:

- Login: "rommel.teste@pucminas.com"
- Senha: "Teste@123"

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Descrição

Este é um repositório inicial do framework [Nest](https://github.com/nestjs/nest) em TypeScript.

## Configuração do Projeto

Existem duas maneiras de instalar e configurar este projeto: **Normalmente** ou utilizando **Docker**. Escolha o método que for mais conveniente para você.
<details>
  <summary style="position:relative">Instalação Normal<img width="30" alt="Descrição da imagem" style="position: absolute; top: 50%; left: 163px; top:10px; transform: translate(-50%, -50%);" src="https://www.svgrepo.com/show/528592/settings.svg"></summary>


Siga estes passos para instalar o projeto diretamente na sua máquina:

1.  **Clone o repositório:**

    Abra o terminal, navegue até a pasta onde deseja salvar o projeto e execute o seguinte comando:

    ```bash
    git clone git@github.com:EduardoMG12/apiFrellaWillianAppMarket.git
    cd ./frellaWillianAppMarket
    ```

2.  **Instale as dependências:**

    Com o terminal já dentro da pasta do projeto, execute o comando:

    ```bash
    pnpm install
    ```
    Este comando irá instalar todas as dependências listadas no arquivo `package.json` criando um arquivo node_modules que nao deve ser commitado.

3.  **Configure o Banco de Dados:**

    *   **Crie o banco de dados:** Utilize sua ferramenta de gerenciamento de banco de dados preferida (ex: DBeaver, MySQL Workbench, pgAdmin) para criar um novo banco de dados.
    *   **Copie o arquivo `.env.example`:**  Na raiz do projeto, você encontrará um arquivo chamado `.env.example`. Copie este arquivo e cole-o na mesma pasta, **renomeando a cópia para `.env`**.
    *   **Configure as variáveis de ambiente:** Abra o arquivo `.env` e configure as variáveis de ambiente de banco de dados (host, porta, usuário, senha, nome do banco) com as credenciais que você definiu ao criar o banco de dados. **Utilize os valores padrão fornecidos no arquivo `.env.example` como referência.**
    ---
    > ⚠️ **Importante:**  O arquivo `.env` contém informações sensíveis como senhas e credenciais de banco de dados. **Nunca commite o arquivo `.env` para o repositório.** Ele já deve estar listado no `.gitignore` para evitar este problema.

4.  **Execute as Migrações (Opcional, mas recomendado):**

    Após configurar o banco de dados, você pode executar as migrações para criar a estrutura inicial do banco de dados (tabelas, colunas, etc.).

    *   **Para gerar uma nova migração (caso não exista):**

        ```bash

        # Se as entidades ja existirem na pasta src/entidades e a pasta 
        # migrations tambem ja possuir um arquivo entao voce nao precisa 
        # rodar esse comando
        pnpm migration:generate

        ```

    *   **Para executar as migrações existentes e popular o banco de dados:**

        ```bash

            # comando interessante de ser rodado apos a criacao do banco de dados ele cria as tabelas e colunas no banco de dados com base na migration/*.ts

        pnpm migration:run
        ```
        Este comando irá executar todos os arquivos de migração pendentes na pasta `migrations` e aplicar as alterações no banco de dados.

    *   **Para reverter as migrações (excluir tabelas):**

        ```bash
        pnpm migration:revert
        ```
        > ⚠️ **Cuidado:** Este comando irá desfazer as últimas migrações aplicadas, potencialmente **excluindo tabelas e dados do seu banco de dados.** Use com cautela.

</details>

<details>
  <summary style="position:relative">Instalação com Docker<img width="30" alt="Descrição da imagem" style="position: absolute; top: 50%; left: 193px; top:10px; transform: translate(-50%, -50%);" src="https://www.svgrepo.com/show/528592/settings.svg"></summary>


Se você preferir utilizar Docker para executar o projeto, siga estes passos:

1.  **Pré-requisitos:**

    *   **WSL2 (Windows Subsystem for Linux 2):**  É altamente recomendado utilizar o WSL2, especialmente se você estiver no Windows.  [**Tutorial de instalação do WSL2**](https://www.youtube.com/watch?v=o1_E4PBl30s)
    *   **Docker:** Certifique-se de ter o Docker instalado na sua máquina.
        *   **Em distribuições Devian como o ubuntu (como no WSL):** Creio que este comando pode funcionar `sudo apt install docker.io` (o nome do pacote pode variar dependendo da sua distribuição Linux).
    *   **Verifique a instalação do Docker:** Após a instalação, execute `docker -v && docker-compose -v` no terminal para confirmar se o Docker foi instalado corretamente.
    *   **Configure as permissões do Docker (opcional, mas recomendado):**  Para evitar problemas de permissão e a necessidade de usar `sudo` a cada comando Docker, siga as instruções de pós-instalação do Docker para configurar as permissões do usuário. Isso também evita erros relacionados ao *daemon* do Docker.

2.  **Execute o projeto com Docker Compose:**

    *   **Navegue até a pasta do projeto:** Abra o terminal e utilize o comando `cd` para entrar na pasta raiz do seu projeto, onde se encontra o arquivo `docker-compose.yml`.
    *   **Inicie os serviços Docker:** Execute o seguinte comando para iniciar os serviços definidos no `docker-compose.yml` (geralmente o banco de dados e o backend da aplicação):

        ```bash
        docker-compose up -d
        ```
        *   O comando `docker-compose up` inicia os serviços definidos no arquivo `docker-compose.yml`.
        *   A flag `-d` (detached mode) faz com que os containers rodem em segundo plano, liberando o terminal. **Se você quiser acompanhar os logs em tempo real, remova a flag `-d`.**
        *   **Para iniciar serviços específicos (opcional):** Se você quiser iniciar apenas um serviço específico (ex: apenas o banco de dados), você pode especificar o nome do serviço após o `up`:

            ```bash
            docker-compose up <nome_do_servico> -d
            ```
            > **Substitua `<nome_do_servico>` pelo nome do serviço desejado, conforme definido no `docker-compose.yml`. Se você não especificar nenhum serviço, o Docker Compose irá iniciar todos os serviços definidos no arquivo.**

</details>

## Executando o Projeto

Após a configuração (seja normal ou com Docker), você pode executar o projeto utilizando os seguintes comandos:

```bash
# caso voce queira pode optar por rodar o projeto apenas no docker com um dos comandos

# se o banco de dados ja estiver online
$ docker-compose up api

# caso queira rodar o banco de dados e depois a api
$ docker-compose up api

# Modo de desenvolvimento (com hot-reloading) sem docker
pnpm run start:dev

# Modo de produção
pnpm run start:prod

```
**Extensão Recomendada para VSCode:**

*   **Biome:** Para manter a qualidade e padronização do código, recomenda-se instalar a extensão [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) no VSCode. O Biome é um linter e formatter de código extremamente rápido e eficiente, que ajudará a manter o código do projeto consistente e seguindo as melhores práticas.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

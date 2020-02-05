# FastFeet

**|||||||||| 25%** Concluído...

## Projeto Final Bootcamp GoStack.

Etapa 1 | 4 do projeto de conclusão.

O desafio pode ser encontrado [aqui](https://github.com/Rocketseat/bootcamp-gostack-desafio-02)

###  { Backend 1.0 }

#### Mas e aí, o que foi feito?

**Proposta:**

1. No **Backend** deve ser utilizado o **framework Express** e o **ORM Sequelize**
2. Desenvolver uma estrutura para manter a **padronização do código** entre todos os devs envolvidos no projeto **independente do sistema operacional** utilizado;
3. Utilizar um **banco de dados Relacional**
4. **Autenticação** de usuário para **restringir o acesso** de rotas e ações.
5. **Validação** das informações fornecidas pelo usuário.

<hr>
  
**Resolução:**

1. Designer Pattern **MVC**. Abordagem **Code First** com **migrations** para manter a integridade do banco de dados e **seeders** para popular a tabela users com um super usuário admin.
2. Neste caso foram utilizadas bibliotecas para estruturação e organização do código: <br>
  2.1. **Sucrase** para modernizar o método de *importação e exportação* do Node; <br>
  2.2. **Nodemon** para manter o server de desenvolvimento sempre ativo; <br>
  2.3. **ESLint**, **Prettier** e **EditorConfig** para manter a padronização de código do airbnb;
3. Com **Docker** utilizei uma imagem do **PostgreSQL** para criar um container e persistir os dados.
4. **JWT** *(Json Web Token)* para restringir o acesso à **API**
5. Foi utilizada a biblioteca **YUP** para validar e garantir a integridade do dados antes de persistir no banco.

<hr>

## Considerações:

- Este projeto está em desenvolvimento.
- A descrição será atualizada apenas com o término de cada desafio.
- Informações de como instalar e rodar essa aplicação serão passadas apenas ao final do projeto!


## Continua....

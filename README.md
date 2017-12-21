# ml-finder

## Como executar
`git clone https://github.com/batagliao/ml-finder.git` <br />
`npm install`
<br />
`npm start`

## Server

No lado servidor foi definido uma API utilizando NodeJS, com o uso do Express.

Para manter as coisas simples, foi utilizado o [DiskDB](https://github.com/arvindr21/diskDB) para persistência de dados. Ele possui uma API muito próxima a do MongoDB.

Também com o intuito de manter a solução simples, como pedido, a diferenciação do usuário **Administrador** ou usuário **Comum** é feita através do envio da diretiva `x-admin` no cabeçalho HTTP.

Dessa forma, quando for recebido o cabeçalho `x-admin` no request HTTP, entendemos que se trata de um usuário administrador, caso contrário, é um usuário comum.

### Estrutura
A estrutura do projeto **Server** está organizada da seguinte forma:

\- server &nbsp;&nbsp;  *pasta raiz do projeto server*  <br />
 |- api &nbsp;&nbsp; *pasta contendo itens da api em si* <br />
 |  &nbsp; |- controllers &nbsp;&nbsp; *contém os controller que executarão as ações da API* <br />
 | &nbsp; |- data &nbsp;&nbsp; *contém o banco e classes de repositório referente as entidades*  <br />
 | &nbsp; |- models &nbsp;&nbsp; *contém as entidades utilizadas pela API* <br />
 | &nbsp; |- routes &nbsp;&nbsp; *contém as definições de rotas da API* <br />
 |- test &nbsp;&nbsp; *contém os testes para a API*
 | &nbsp; |- data &nbsp;&nbsp; *contém o banco de testes*

 

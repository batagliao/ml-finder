# ml-finder

## Como executar
`git clone https://github.com/batagliao/ml-finder.git` <br />
`npm install`
<br />
`npm start`

## Solução
A solução é dividida em duas partes: Server e Client. <br />
Os scripts npm no diretório raiz delegam a execução a scripts homônimos dentro de cada projeto. Ex: `npm install` irá executar `npm install` no projeto server e no projeto client.

## Server

No lado servidor foi definido uma API utilizando NodeJS, com o uso do Express.

Para manter as coisas simples, foi utilizado o [DiskDB](https://github.com/arvindr21/diskDB) para persistência de dados. Ele possui uma API muito próxima a do MongoDB.

Também com o intuito de manter a solução simples, como pedido, a diferenciação do usuário **Administrador** e usuário **Comum** é feita através do envio da diretiva `x-admin` no cabeçalho HTTP.

Dessa forma, quando for recebido o cabeçalho `x-admin` no request HTTP, entendemos que se trata de um usuário administrador, caso contrário, é um usuário comum.

### Estrutura
A estrutura do projeto **Server** está organizada da seguinte forma:

\- server &nbsp;&nbsp;  *pasta raiz do projeto server*  <br />
 |- api &nbsp;&nbsp; *pasta contendo itens da api em si* <br />
 |  &nbsp; |- controllers &nbsp;&nbsp; *contém os controller que executarão as ações da API* <br />
 | &nbsp; |- data &nbsp;&nbsp; *contém o banco e classes de repositório referente as entidades*  <br />
 | &nbsp; |- models &nbsp;&nbsp; *contém as entidades utilizadas pela API* <br />
 | &nbsp; |- routes &nbsp;&nbsp; *contém as definições de rotas da API* <br />
 |- test &nbsp;&nbsp; *contém os testes para a API e repositórios* <br />
 | &nbsp; |- data &nbsp;&nbsp; *contém o banco de testes*

 ### Nota sobre a modelagem
 Preferi vincular os produtos com a loja de forma aparentemente 'inversa'. Na minha modelagem, os produtos possuem o ponteiro para as lojas e não as lojas ponteiro para seus produtos. Na perspectiva do cliente ele deseja o produto, independente de qual loja ele se encontre, e essa informação é relevante. Na perspectiva do adminstrador, poder cadastrar o produto apenas 1 vez e especificar em qual loja está disponível ao invés de cadastrar o mesmo produto para cada loja.


 ## Client
 No projeto client, foi utilizado Angular com Bootstrap e FontAwesome.
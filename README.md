# ml-finder

## Como executar
`git clone https://github.com/batagliao/ml-finder.git` <br />
`npm install`
<br />
`npm start`

Acesse https://localhost:4200

## Solução
A solução é dividida em duas partes: Server e Client. <br />
Os scripts npm no diretório raiz delegam a execução a scripts homônimos dentro de cada projeto. Ex: `npm install` irá executar `npm install` no projeto server e no projeto client.

Detalhes de melhorias e os objetivos que não consegui alcançar a tempo se encontram no final

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
 No projeto client, foi utilizado Angular com Bootstrap e FontAwesome. <br />
 A localização é obtida pelo browser do usuário e o geocoding do CEP é feito através da API do Google Maps.


 ## Pontos não realizados
 Infelizmente há alguns pontos que não consegui realizar dentro do tempo proposto, e em virtude disso optei por alguns caminhos para entregar o projeto o mais completo possível.

 ### Cadastro de administrador
 Não consegui realizar a interface do cadastro de administrador de lojas e produtos <br />
 A ideia era o cadastro de loja já buscar a localização do CEP da loja no momento do cadastro, para que o momento da consulta do usuário o tempo de resposta fosse mais curto.

 #### Dados
 Como não consegui concluir o cadastro a tempo, criei dados diretamente o arquivo json representando os dados através do DiskDB.

 ### Localização
 Para obter a localização do usuário, além de solicitar a permissão do mesmo no browser, deve haver uma estratégia de fallback. <br />
 Há também a necessidade de usar o Fallback quando a página não é servida em HTTP, pois a maioria dos browsers rejeitará o pedido de localização nesses casos. <br />
 Como não consgui completar essa etapa a tempo, fiz com que a página fosse servida através de HTTPS, com um certificado de desenvolvimento, para que fosse possível coletar a posição do usuário pelo browser.
 O Fallback que seria desenvolvido é: no caso de não obter a localização pelo browser, oferecer um diálogo onde o usuário pudesse informar seu CEP e então fazer o geocoding do CEP para obter a localização.

### Testes
A API do lado servidor foi concebida criando primeiramente os testes. Exceto a parte de geolocalização, por acreditar que não conseguiria terminar todo o projeto realizer a funcionalidade primeiro. <br />
Na parte client, não escrevi primeiramente os testes por falta de familiaridade e receio de não consegui entregar nada além dos testes pelo tempo

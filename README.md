# Universidade Estadual de Campinas
# Instituto da Computação

# Disciplina: MC855-2s2021

## Professor e Assistente

| Nome                     | Email                   |
| ------------------------ | ------------------------|
| Professora Juliana Borin | jufborin@unicamp.br     |
| Assistente Paulo Kussler | paulo.kussler@gmail.com |


## Equipe

| Nome               | RA               | Email                  | ID Git                |
| ------------------ | ---------------- | ---------------------- |---------------------- |
| Gustavo Henrique Libraiz Teixeira                   | 198537                 | g198537@dac.unicamp.br                     |   nugnu                    |
| Lucas Henrique Machado Domingues                   | 182557                 | l182557@dac.unicamp.br                    |   lhmdomingues                   ||                    |                  |                        |                       |
| Matheus Vicente Mazon                   | 203609                | m203609@dac.unicamp.br                     |   matheusmazon                    |
| Pietro Pugliesi                   | 185921               | p185921@dac.unicamp.br                     |   pietro1704                   |
| Caio Lucas Silveira de Sousa                  | 165461                | c165461@dac.unicamp.br                     |   caiolucasw                    |
| Thomas Gomes Ferreira                  | 224919                | t224919@dac.unicamp.br                     |   Desnord                   |

## LINK DO ZIP: https://drive.google.com/file/d/1KTts2tRrIhKoRsp5dHrPAeMYldIGmMxf/view?usp=sharing
## Específico sobre esse repositório: 
Esse repositório faz parte do projetos da plataforma de Match de Projetos desenvolvido no 2s/2021 para a disciplina MC-855 na Unicamp (https://github.com/orgs/855matchprojeto/repositories). Neste repositório se encontra a implementação do front-end (site) para o projeto.
O site pode ser acessado pelo link: https://match-projetos.herokuapp.com/home ou rodando os comandos `npm install` e depois `npm start` na pasta raíz do respositório.

## Descrição do projeto:
Nosso projeto é uma plataforma em que os usuários cadastrados (da Unicamp, vide políticas de acesso), alunos ou professores, podem cadastrar projetos (com título, imagem, descrição, cursos e áreas envolvidas), e disponibilizar na plataforma para outro usuário "dar match", isso é, mostrar interesse. O usuário também tem, na sua página "Home", uma lista de projetos disponíveis que podem ser do seu interesse.

Desse modo, ocorre a conexão entre as pessoas interessadas no projeto, tornando o processo de divulgação do projeto mais centralizado e simplificado.

## Prints das telas com descrição das funcionalidades. 
<img width="883" alt="Captura de Tela 2021-11-25 às 11 30 52" src="https://user-images.githubusercontent.com/45739756/143462405-238cd087-ae71-44a5-99f8-b36f93cffae6.png">

### página de detalhes do projeto, seja ele criado pelo usuário atual ou por outro, onde o usuário pode mostrar interesse no projeto

<img width="892" alt="Captura de Tela 2021-11-25 às 11 30 46" src="https://user-images.githubusercontent.com/45739756/143462565-9e591210-bd22-48cb-875c-32a5907d1603.png">

### página de perfil do usuário atual, permitindo edição dos dados

<img width="939" alt="Captura de Tela 2021-11-25 às 11 30 38" src="https://user-images.githubusercontent.com/27248223/164270517-16d554f6-822f-457a-8289-983dc001fd74.png">

### página de edição de projeto criado pelo usuário atual


## Tecnologias, ferramentas, dependências, versões. etc. 
### Específico sobre o front-end
O front-end foi desenvolvido em Javascript, principalmente com uso da biblioteca Material-UI do React. O uso do `npm install` já adiciona no projeto local as bibliotecas importadas.

## Como colocar no ar, como testar, etc
Acesso ao site pelo link: https://match-projetos.herokuapp.com/
OBS: o primeiro acesso pode demorar um pouco até o Heroku responder. Favor continuar atualizando a página

### executar localmente
1 - Faça clone do projeto para alguma pasta de sua preferência.
2 - Instale o npm, gerenciador de pacotes do node.js.

3 - No diretório raiz do projeto, digite o comando (instalar pacotes):
#### `npm install`

4 - Em seguida, digite outro comando (inicia React-App:
#### `npm start`

## Como acessar, quem pode se cadastrar(regras de acessos), etc.
Acesso com usuário com nome de usuário "admin" e senha "admin123", ou realizar cadastro próprio. A regra de acesso é que o email cadastrado no usuário deve ser de domínio da Unicamp, isto é, de final "unicamp.br"

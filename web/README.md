
# Encurtador de links - SPA

## RF (Requisitos funcionais)

  - [x]  Deve ser possível criar um link;
  - [x]  Deve ser possível deletar um link;
  - [x]  Deve ser possível obter a URL original por meio do encurtamento;
  - [x]  Deve ser possível listar todas as URL’s cadastradas;
  - [x]  Deve ser possível incrementar a quantidade de acessos de um link;
  - [x]  Deve ser possível baixar um CSV com o relatório dos links criados.

## RN (Regras de negócio)

  - [x]  Não deve ser possível criar um link com encurtamento mal formatado;
  - [x]  Não deve ser possível criar um link com encurtamento já existente;
  - [x]  Siga o mais fielmente possível o layout do Figma;
  - [x]  Deve possuir três páginas:
    - [x]  A página raiz (/) que exibe o formulário de cadastro e a listagem dos links cadastrados;
    - [x]  A página de redirecionamento (/:url-encurtada) que busca o valor dinâmico da URL e faz a pesquisa na API por aquela URL encurtada;
    - [x]  A página de recurso não encontrado (qualquer página que não seguir o padrão acima) que é exibida caso o usuário digite o endereço errado ou a url encurtada informada não exista.
    

## RNF (Requisitos não funcionais)

  - [x]  É obrigatória a criação de uma aplicação React no formato SPA utilizando o Vite como `bundler`;
  - [x]  Trabalhe com elementos que tragam uma boa experiência ao usuário (`empty state`, ícones de carregamento, bloqueio de ações a depender do estado da aplicação);
  - [x]  Foco na responsividade: essa aplicação deve ter um bom uso tanto em desktops quanto em celulares;
  - [x]  Obrigatório o uso de Typescript;
  - [x]  Obrigatório o uso de React;
  - [x]  Obrigatório o uso de Vite sem framework.

Lista de Compras
Uma aplicação web para gerenciar listas de compras, com autenticação baseada em cookies, chat em tempo real via WebSocket, e histórico de ações. Desenvolvida com Node.js, Express, Bootstrap 5.3.3, e hospedada no Render.
Funcionalidades

Autenticação: Login com email e senha, usando cookies para sessões.
Dashboard: Adicionar, editar, excluir itens (nome, preço, categoria, localização).
Admin: Gerenciar todos os itens (exclusivo para administradores).
Chat: Comunicação em tempo real, com limite de 5 mensagens iniciais e pareamento de usuários.
Resumo: Visualizar histórico de ações (adição, atualização, exclusão).
Responsividade: Interface adaptável com Bootstrap e estilos personalizados.

Tecnologias

Front-end: HTML5, CSS3, JavaScript, Bootstrap 5.3.3, Font Awesome 6.5.1
Back-end: Node.js, Express.js, WebSocket (ws)
Banco de Dados: JSON (db.json)
Outras: cookie-parser, Render

Pré-requisitos

Node.js (v16 ou superior)
npm
Navegador moderno (Chrome, Firefox, Edge)

Instalação

Clone o repositório:git clone https://github.com/<seu-usuario>/projeto-pagina-web.git
cd projeto-pagina-web


Instale as dependências:npm install


Inicie o servidor:node server/app.js


Acesse: http://localhost:3000

Uso

Login:
Acesse /login.
Use:
Email: admin@exemplo.com, Senha: 123456 (admin)
Email: joao@exemplo.com, Senha: 123456 (usuário)




Dashboard (/): Adicione/editar/excluir itens.
Admin (/admin): Gerencie todos os itens (apenas admin).
Chat (/chat): Envie até 5 mensagens, depois conecte com outro usuário.
Resumo (/resumo): Veja o histórico de ações (apenas admin).

Deploy no Render

Crie um repositório no GitHub e faça push do projeto.
No Render, crie um serviço Web e vincule o repositório.
Configure a variável de ambiente PORT (se necessário).
Execute o build com:npm install && node server/app.js


Acesse: https://<app>.onrender.com

Estrutura do Projeto
projeto-pagina-web/
├── public/
│   ├── css/
│   │   └── estilo.css      # Estilos personalizados
│   ├── admin.html          # Painel de administração
│   ├── dashboard.html      # Dashboard do usuário
│   ├── chat.html           # Chat em tempo real
│   ├── resumo.html         # Histórico de ações
│   └── login.html          # Página de login
├── server/
│   ├── app.js              # Servidor Express e WebSocket
│   ├── routes.js           # Rotas da API
│   └── db.json             # Banco de dados JSON
├── package.json            # Dependências e scripts
└── README.md               # Este arquivo

Testes
Testes manuais foram realizados para:

Login com credenciais válidas/inválidas.
CRUD de itens no dashboard e admin.
Chat (limite de mensagens e pareamento).
Histórico em /resumo.
Responsividade em dispositivos variados.

Para testar:
node server/app.js
# Acesse http://localhost:3000/login e siga os fluxos

Contribuição

Faça um fork do repositório.
Crie uma branch: git checkout -b minha-feature.
Commit suas mudanças: git commit -m 'Adiciona feature'.
Push para a branch: git push origin minha-feature.
Abra um Pull Request.

Licença
MIT License. Veja LICENSE para detalhes.


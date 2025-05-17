const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const routes = require('./routes');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Eu sirvo o dashboard para usuários normais
app.get('/', (req, res) => {
    console.log('Eu estou servindo dashboard.html para /');
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Eu sirvo o dashboard para administradores
app.get('/admin', (req, res) => {
    console.log('Eu estou servindo admin.html');
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Eu sirvo a página de chat
app.get('/chat', (req, res) => {
    console.log('Eu estou servindo chat.html');
    res.sendFile(path.join(__dirname, '../public/chat.html'));
});

// Eu sirvo a página de resumo
app.get('/resumo', (req, res) => {
    console.log('Eu estou servindo resumo.html');
    res.sendFile(path.join(__dirname, '../public/resumo.html'));
});

// Eu uso as rotas da API
app.use('/api', routes);

// Eu gerencio o chat via WebSocket
const waitingUsers = [];
const userConnections = new Map();
const messageCounts = new Map();

function generateResponse(message) {
    const msg = message.toLowerCase();
    if (msg.includes('olá') || msg.includes('oi')) {
        return 'Olá! Como posso ajudar você hoje?';
    } else if (msg.includes('como vai') || msg.includes('tudo bem')) {
        return 'Estou bem, e você?';
    } else if (msg.includes('compra') || msg.includes('item')) {
        return 'Você quer falar sobre a lista de compras? Adicione itens no dashboard!';
    } else if (msg.includes('tempo') || msg.includes('clima')) {
        return 'Não tenho dados do clima, mas está ensolarado na sua lista de compras?';
    } else if (msg.includes('ajuda') || msg.includes('o que fazer')) {
        return 'Tente adicionar itens na lista ou ver o resumo dos gastos!';
    } else {
        return 'Hmm, interessante! Pode mandar mais detalhes?';
    }
}

wss.on('connection', (ws, req) => {
    const userId = Date.now().toString();
    const username = req.url.split('username=')[1] || 'Anônimo';
    console.log('Eu conectei um usuário:', username);
    
    userConnections.set(userId, ws);
    messageCounts.set(userId, 0);
    ws.send(JSON.stringify({ type: 'system', text: `Bem-vindo, ${username}! Envie sua primeira mensagem.` }));

    ws.on('message', (message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            console.log('Eu recebi uma mensagem inválida:', message.toString());
            return;
        }
        const msg = data.text;
        let count = messageCounts.get(userId) || 0;

        if (count < 5) {
            count++;
            messageCounts.set(userId, count);
            const serverResponse = generateResponse(msg);
            ws.send(JSON.stringify({ type: 'user', text: msg, from: username }));
            ws.send(JSON.stringify({ type: 'server', text: serverResponse }));
            console.log(`Eu recebi a mensagem ${count}/5 de ${userId}: ${msg}`);
            console.log(`Eu respondi: ${serverResponse}`);

            if (count === 5) {
                ws.send(JSON.stringify({ type: 'system', text: 'Você atingiu o limite de 5 mensagens. Aguardando outro usuário...' }));
                waitingUsers.push({ userId, ws, username });

                if (waitingUsers.length >= 2) {
                    const user1 = waitingUsers.shift();
                    const user2 = waitingUsers.shift();
                    user1.ws.send(JSON.stringify({ type: 'system', text: `Conectado a ${user2.username}!` }));
                    user2.ws.send(JSON.stringify({ type: 'system', text: `Conectado a ${user1.username}!` }));

                    user1.ws.on('message', (msg) => {
                        let data;
                        try {
                            data = JSON.parse(msg);
                        } catch (error) {
                            return;
                        }
                        if (user2.ws.readyState === WebSocket.OPEN) {
                            const message = { type: 'user', text: data.text, from: user1.username };
                            user2.ws.send(JSON.stringify(message));
                            user1.ws.send(JSON.stringify(message));
                        }
                    });

                    user2.ws.on('message', (msg) => {
                        let data;
                        try {
                            data = JSON.parse(msg);
                        } catch (error) {
                            return;
                        }
                        if (user1.ws.readyState === WebSocket.OPEN) {
                            const message = { type: 'user', text: data.text, from: user2.username };
                            user1.ws.send(JSON.stringify(message));
                            user2.ws.send(JSON.stringify(message));
                        }
                    });
                }
            }
        }
    });

    ws.on('close', () => {
        userConnections.delete(userId);
        const index = waitingUsers.findIndex(u => u.userId === userId);
        if (index !== -1) waitingUsers.splice(index, 1);
        console.log(`Eu desconectei o usuário: ${userId}`);
    });
});

// Eu inicializo o banco de dados
const dbPath = path.join(__dirname, 'db.json');
if (!fs.existsSync(dbPath) || fs.readFileSync(dbPath).length === 0) {
    fs.writeFileSync(dbPath, JSON.stringify({
        items: [],
        history: []
    }));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Eu iniciei o servidor em: http://localhost:${PORT}`));
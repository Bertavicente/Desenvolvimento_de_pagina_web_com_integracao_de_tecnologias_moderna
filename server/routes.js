const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, 'db.json');

function readDB() {
    return JSON.parse(fs.readFileSync(dbPath));
}

function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Eu listo os itens
router.get('/items', (req, res) => {
    const db = readDB();
    const userId = req.query.userId || 'user';
    console.log('Eu estou listando itens para userId:', userId);
    if (userId === 'admin') {
        res.json(db.items);
    } else {
        res.json(db.items.filter(item => item.userId === userId));
    }
});

// Eu adiciono um item
router.post('/items', (req, res) => {
    const db = readDB();
    const item = {
        id: Date.now().toString(),
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        location: req.body.location || '',
        userId: req.body.userId || 'user'
    };
    console.log('Eu recebi um item para adicionar:', item);
    db.items.push(item);
    db.history.push({
        id: Date.now().toString(),
        action: 'add',
        itemId: item.id,
        userId: item.userId,
        timestamp: new Date().toISOString()
    });
    writeDB(db);
    console.log('Eu adicionei o item:', item.id);
    res.status(201).json(item);
});

// Eu atualizo um item
router.put('/items/:id', (req, res) => {
    const db = readDB();
    const itemId = req.params.id;
    const userId = req.body.userId || 'user';
    const itemIndex = db.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
        console.log('Eu não encontrei o item:', itemId);
        return res.status(404).json({ message: 'Eu não encontrei esse item' });
    }
    console.log('Eu estou atualizando o item:', itemId);
    db.items[itemIndex] = {
        ...db.items[itemIndex],
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        location: req.body.location || ''
    };
    db.history.push({
        id: Date.now().toString(),
        action: 'update',
        itemId: itemId,
        userId: userId,
        timestamp: new Date().toISOString()
    });
    writeDB(db);
    console.log('Eu atualizei o item:', itemId);
    res.json(db.items[itemIndex]);
});

// Eu removo um item
router.delete('/items/:id', (req, res) => {
    const db = readDB();
    const itemId = req.params.id;
    const userId = req.query.userId || 'user';
    const itemIndex = db.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
        console.log('Eu não encontrei o item:', itemId);
        return res.status(404).json({ message: 'Eu não encontrei esse item' });
    }
    console.log('Eu estou removendo o item:', itemId);
    db.items.splice(itemIndex, 1);
    db.history.push({
        id: Date.now().toString(),
        action: 'delete',
        itemId: itemId,
        userId: userId,
        timestamp: new Date().toISOString()
    });
    writeDB(db);
    console.log('Eu removi o item:', itemId);
    res.status(204).send();
});

// Eu listo o histórico
router.get('/history', (req, res) => {
    const db = readDB();
    console.log('Eu estou listando o histórico');
    res.json(db.history);
});

module.exports = router;
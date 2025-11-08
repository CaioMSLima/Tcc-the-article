const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// servir o frontend buildado
app.use(express.static(path.join(__dirname, 'dist')));

// suas rotas de API
const artigosRoute = require('./routes/artigos');
app.use('/api/artigos', artigosRoute);

// fallback do Vue Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

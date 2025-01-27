require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ursRouter =  require('./app/routes/users');
const notesRouter =  require('./app/routes/Notes')
var cors = require('cors')


// Variáveis de ambiente
const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL;

// Conectar ao MongoDB na nuvem
mongoose
  .connect(DB_URL, { })
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.use(cors())

app.use(express.json());
app.use('/users', ursRouter )
app.use('/notes', notesRouter )

module.exports = app;
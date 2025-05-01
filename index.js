// Importações
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Inicialização do aplicativo
const app = express();

// Carregar variáveis de ambiente
dotenv.config();

// Configurações
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI; 
const VIEWS_PATH = path.join(__dirname, '/pages');
const PUBLIC_PATH = path.join(__dirname, 'public');

// Verificar se MONGODB_URI está definido
if (!MONGODB_URI) {
    console.error('Erro: A variável de ambiente MONGODB_URI não está definida no arquivo .env');
    process.exit(1);
}

// Configuração de middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', VIEWS_PATH);
app.use('/public', express.static(PUBLIC_PATH));

// Conexão com o MongoDB
async function connectToMongoDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB conectado com sucesso!');
    } catch (err) {
        console.error('Erro ao conectar no MongoDB:', err);
        process.exit(1);
    }
}

// Rotas
const routes = require('./routes/index');

// Middleware de rotas
app.use('/', routes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err.stack);
    res.status(500).send('Erro interno do servidor');
});

// Iniciar o servidor
async function startServer() {
    await connectToMongoDB();
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

startServer();
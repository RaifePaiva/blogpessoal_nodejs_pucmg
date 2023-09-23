require('dotenv').config()
const express = require ('express')
const cors = require('cors');
const path = require ('path')
const app = express ()
const apiRouter = require('./api/routes/apiRoutes')
const appRouter = require('./api/routes/appRoutes')
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('', __dirname);

// Configurar o diretório "public" para servir arquivos estáticos
app.use(express.static(__dirname + '/public'));

app.locals.base_url = '';

// Middleware para capturar o host global
app.use((req, res, next) => {
    app.locals.base_url = `${req.protocol}://${req.headers.host}`;
    next();
});

// app.use('/app', express.static (path.join (__dirname, '/public')))

// Iniciando servidor
let port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

app.use ('/api', apiRouter)
app.use ('/app', appRouter)
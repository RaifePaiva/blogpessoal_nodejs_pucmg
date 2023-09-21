require('dotenv').config()
const express = require ('express')
const cors = require('cors');
const path = require ('path')
const app = express ()
const apiRouter = require('./api/routes/apiRoutes')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/app', express.static (path.join (__dirname, '/public')))

// Iniciando servidor
let port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

app.use ('/api', apiRouter)
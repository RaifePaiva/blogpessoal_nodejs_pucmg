const express = require("express");
const app = express();
const appRouter = express.Router();
const UsuarioController = require("../src/usuarios");
const PostController = require("../src/posts");

const endpoint = "/";
// Defina uma variável global para o host

//apiRouter.post(endpoint + "usuarios", UsuarioController.createUser);

// Rota para a página inicial
appRouter.get(endpoint, (req, res) => {
  const header = res.render("index", {
    titulo: "Blog",
    menu: "home",
  });
});

// Rota para a página "Sobre"
appRouter.get(endpoint + "about", (req, res) => {
  res.render("about", { titulo: "Sobre Nós", menu: "about" });
});

module.exports = appRouter;

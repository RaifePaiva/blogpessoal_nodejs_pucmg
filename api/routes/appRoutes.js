const express = require("express");
const app = express();
const appRouter = express.Router();
const segRouter = require("./segRouter");
const PostController = require("../src/posts");
const moment = require('moment');
const endpoint = "/";
// Defina uma variável global para o host
    
//apiRouter.post(endpoint + "usuarios", UsuarioController.createUser);

// Rota para a página inicial
appRouter.get(endpoint, (req, res) => {
  PostController
    .listPostsBlog()
    .then((posts) => {
        let postsBlog = [];
        posts.map((post,i) => {
            post.data_criacao = moment(post.data_criacao).format('DD/MM/YYYY HH:mm:ss');
            postsBlog[i] = post;
        });
        res.render("index", {
            titulo: "Blog",
            menu: "home",
            posts: posts,
        });
    });
});

// Rota para a página "Sobre"
appRouter.get(endpoint + "about", (req, res) => {
  res.render("about", { titulo: "Sobre Nós", menu: "about" });
});

// Rota para a página "Login"
appRouter.get(endpoint + "login", (req, res) => {
  res.render("dash/login", { titulo: "Sobre Nós", menu: "about", autenticado: true });
});

// Rota para a página "Login"
appRouter.get(endpoint + "dashboard",segRouter.isAuthenticated,(req, res) => {
        PostController
        .listPostsBlog()
        .then((posts) => {
            segRouter.checkToken;
            let postsBlog = [];
            posts.map((post,i) => {
                post.data_criacao = moment(post.data_criacao).format('DD/MM/YYYY HH:mm:ss');
                postsBlog[i] = post;
            });
            res.render("dash/dashboard", {
                titulo: "Blog",
                menu: "home",
                posts: posts,
            }); });
  });

module.exports = appRouter;

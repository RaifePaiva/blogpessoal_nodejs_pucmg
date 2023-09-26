const express = require("express");

const apiRouter = express.Router();
const UsuarioController = require('../src/usuarios');
const PostController = require('../src/posts');
const segRouter = require('./segRouter');

const endpoint = "/";

/**
 * Routes para Usuario.
 */

apiRouter.post(endpoint + "login", (req, res) => {
    console.log(req.body);
});

apiRouter.post(endpoint + "usuarios", UsuarioController.createUser);
apiRouter.get(endpoint + "usuarios/:id", UsuarioController.getUserById);
apiRouter.get(endpoint + "usuarios", UsuarioController.getAllUsers);
apiRouter.delete(endpoint + "usuarios/:id", UsuarioController.deleteUsuario);

/**
 * Routes para Posts.
 */
apiRouter.post(endpoint + "posts", PostController.createPost);
apiRouter.put(endpoint + "posts/:id", PostController.updatePost);
apiRouter.get(endpoint + "posts", PostController.listPosts);
apiRouter.get(endpoint + "posts/:id", PostController.getPostById);
apiRouter.get(endpoint + "posts/usuario/:id", PostController.listPostsByUsuarioID);
apiRouter.delete(endpoint + "posts/:id", PostController.deletePost);

module.exports = apiRouter;

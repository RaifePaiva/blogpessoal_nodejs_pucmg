const express = require("express");

const apiRouter = express.Router();
const UsuarioController = require('../src/usuarios');
const PostController = require('../src/posts');
const segRouter = require('./segRouter');

const endpoint = "/";

/**
 * Routes para Usuario.
 */

apiRouter.post(endpoint + "login", segRouter.login);

apiRouter.post(endpoint + "usuarios", UsuarioController.createUser);
apiRouter.get(endpoint + "usuarios/:id", UsuarioController.getUserById);
apiRouter.get(endpoint + "usuarios", UsuarioController.getAllUsers);
apiRouter.delete(endpoint + "usuarios/:id", UsuarioController.deleteUsuario);

/**
 * Routes para Posts.
 */
apiRouter.post(endpoint + "posts", segRouter.checkToken, PostController.createPost);
apiRouter.put(endpoint + "posts/:id", segRouter.checkToken, PostController.updatePost);
apiRouter.get(endpoint + "posts", segRouter.checkToken, PostController.listPosts);
apiRouter.get(endpoint + "posts/:id", segRouter.checkToken, PostController.getPostById);
apiRouter.get(endpoint + "posts/usuarios/:id", segRouter.checkToken, PostController.listPostsByUsuarioID);
apiRouter.delete(endpoint + "posts/:id", segRouter.checkToken, PostController.deletePost);

module.exports = apiRouter;

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

apiRouter.post(endpoint + "usuarios", segRouter.checkToken, UsuarioController.createUser);
apiRouter.get(endpoint + "usuarios/:id", segRouter.checkToken, UsuarioController.getUserById);
apiRouter.get(endpoint + "usuarios", segRouter.checkToken, UsuarioController.getAllUsers);
apiRouter.delete(endpoint + "usuarios/:id", segRouter.checkToken, UsuarioController.deleteUsuario);
apiRouter.put(endpoint + "usuarios/:id", segRouter.checkToken, UsuarioController.updateUser);

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

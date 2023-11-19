const knex = require("knex")(require("../../knexfile").development);
const { attachPaginate } = require("knex-paginate");
attachPaginate();

exports.createPost = async (req, resp) => {
  const { titulo, conteudo } = req.body;
  const fk_usuario = req.token.id;
  try {
    const post = await knex("posts")
      .insert({ titulo, conteudo, fk_usuario })
      .returning(["id", "data_criacao"]);

    resp.status(201).json({
      id: post[0].id,
      titulo: titulo,
      conteudo: conteudo,
      fk_usuario: fk_usuario,
      data_criacao: post[0].data_criacao,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Falha ao salvar post.",
    });
  }
};

exports.updatePost = async (req, resp) => {
  const postId = req.params.id;
  const { titulo, conteudo } = req.body;

  try {
    const updatedPost = await knex("posts")
      .where({ id: postId })
      .update({ titulo, conteudo })
      .returning("*");

    if (updatedPost.length === 0) {
      resp.status(404).json({ message: "Post não encontrado" });
    } else {
      resp.status(200).json(updatedPost[0]);
    }
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: "Falha ao atualizar o post." });
  }
};

exports.listPostsBlog = () => {
  return knex
    .select("posts.*", "usuarios.nome")
    .from("posts")
    .innerJoin("usuarios", "posts.fk_usuario", "usuarios.id");
};

exports.listPosts = async (req, resp) => {
  try {
    const posts = await knex
      .select("*")
      .from("posts")
      .orderBy(req.query.orderBy || "id", req.query.order || "asc")
      .paginate({
        perPage: req.query.limit || 1000,
        currentPage: req.query.page || 1,
      });
    let dataPost = [];
    if (posts.data.length > 0) {
      posts.data.map((post, i) => {
        dataPost[i] = {
          id: post.id,
          titulo: post.titulo,
          conteudo: post.conteudo,
          data_criacao: post.data_criacao,
          links: [
            {
              rel: "self",
              href: process.env.BASE + "api/posts/" + post.id,
            },
            {
              rel: "postsPorUsuarios",
              href: process.env.BASE + "api/posts/usuarios/" + post.fk_usuario,
            },
          ],
        };
      });
    }
    resp.status(200).json({
      data: dataPost,
      pagination: {
        ...posts.pagination,
        orderBy: req.query.orderBy,
        order: req.query.order,
      },
    });
  } catch (err) {
    resp.status(500).json({
      message: "Erro ao recuperar posts - " + err.message,
    });
  }
};

exports.getPostById = async (req, resp) => {
  try {
    const post = await knex
      .select("*")
      .from("posts")
      .where("id", req.params.id)
      .first();

    if (!post) {
      resp.status(404).json({ message: "Post não encontrado" });
    } else {
      const dataPost = {
        id: post.id,
        titulo: post.titulo,
        conteudo: post.conteudo,
        data_criacao: post.data_criacao,
        links: [
          {
            rel: "self",
            href: process.env.BASE + "api/posts/" + post.id,
          },
          {
            rel: "posts",
            href: process.env.BASE + "api/posts",
          },
        ],
      };
      resp.status(200).json({ data: dataPost });
    }
  } catch (err) {
    resp.status(500).json({
      message: "Erro ao recuperar post - " + err.message,
    });
  }
};

exports.listPostsByUsuarioID = async (req, resp) => {
  try {
    const usuario = await knex
      .select("*")
      .from("usuarios")
      .where("id", req.params.id)
      .first();

    if (!usuario) {
      resp.status(404).json({ message: "Usuario não encontrado." });
      return;
    }

    const posts = await knex
      .select("*")
      .from("posts")
      .where("fk_usuario", req.params.id)
      .orderBy(req.query.orderBy || "id", req.query.order || "asc")
      .paginate({
        perPage: req.query.limit || 1000,
        currentPage: req.query.page || 1,
      });
    let dataPost = [];
    posts.data.map((post, i) => {
      dataPost[i] = {
        id: post.id,
        titulo: post.titulo,
        conteudo: post.conteudo,
        data_criacao: post.data_criacao,
        links: [
          {
            rel: "self",
            href: process.env.BASE + "api/posts/usuarios/" + post.fk_usuario,
          },
          {
            rel: "posts",
            href: process.env.BASE + "api/posts",
          },
          {
            rel: "postsPorId",
            href: process.env.BASE + "api/posts/" + post.id,
          },
        ],
      };
    });
    resp.status(200).json({ 
        data: dataPost,
      pagination: {
        ...posts.pagination,
        orderBy: req.query.orderBy,
        order: req.query.order,
      },
     });
  } catch (err) {
    resp.status(500).json({
      message: "Erro ao recuperar posts - " + err.message,
    });
  }
};

exports.deletePost = async (req, resp) => {
  try {
    const post = await knex
      .select("*")
      .from("posts")
      .where("id", req.params.id)
      .first();

    if (!post) {
      resp.status(404).json({ message: "Post não encontrado." });
      return;
    }
    await knex("posts").where("id", req.params.id).del();
    resp.status(204).send();
  } catch (err) {
    resp.status(500).json({
      message: "Erro ao deletar post - " + err.message,
    });
  }
};

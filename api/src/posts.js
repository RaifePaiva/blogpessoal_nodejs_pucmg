const knex = require("knex")(require("../../knexfile").development);
const segRouter = require('..routes/segRouter');

exports.createPost = segRouter.checkToken, async (req, resp) =>{
    const {titulo, conteudo, fk_usuario} = req.body
    try{
        const post = await knex("posts")
            .insert({titulo, conteudo, fk_usuario})
            .returning('id');

        resp.status(201).json({
            id: post[0].id,
        })
    }catch (error){
        console.log(error)
        resp.status(500).json({
            message: "Falha ao salvar post."
        })
    }
}

exports.listPosts = async (req, resp) =>{
    try{
        const posts = await knex
            .select("*")
            .from("posts")

        resp.status(200).json({ data: posts });
    } catch (err) {
        resp.status(500).json({
          message: "Erro ao recuperar posts - " + err.message,
        });
    }
}

exports.getPostById = async (req, resp) =>{
    try {
        const post = await knex
          .select("*")
          .from("posts")
          .where("id", req.params.id)
          .first();
    
        if (!post) {
          resp.status(404).json({ message: "Post não encontrado" });
        } else {
          resp.status(200).json({ data: post });
        }
    } catch (err) {
        resp.status(500).json({
          message: "Erro ao recuperar post - " + err.message,
        });
    }
}

exports.listPostsByUsuarioID = segRouter.checkToken, async (req, resp) =>{
    try{
        const usuario = await knex
            .select("*")
            .from("usuarios")
            .where("id", req.params.id)
            .first();

        if(!usuario){
            resp.status(404).json({ message: "Usuario não encontrado." });
            return        
        }

        const posts = await knex
            .select("*")
            .from("posts")
            .where("fk_usuario", req.params.id);

        resp.status(200).json({ data: posts });
    } catch (err) {
        resp.status(500).json({
          message: "Erro ao recuperar posts - " + err.message,
        });
    }
}

exports.deletePost = segRouter.checkToken, async (req, resp) =>{
    try{
        const post = await knex
            .select("*")
            .from("posts")
            .where("id", req.params.id)
            .first();

        if(!post){
            resp.status(404).json({ message: "Post não encontrado." });
            return        
        }
        await knex("posts").where("id", req.params.id).del();
        resp.status(204).send();
    } catch (err) {
        resp.status(500).json({
          message: "Erro ao deletar post - " + err.message,
        });
    }
}
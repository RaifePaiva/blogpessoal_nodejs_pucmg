
const bcrypt = require('bcryptjs');
const knex = require("knex")(require("../../knexfile").development);

exports.createUser = async (req, resp) =>{
    const {login, nome, senha, perfil} = req.body
    try{
        const user = await knex("usuarios")
            .insert({login, nome, "senha": bcrypt.hashSync(senha, 8), perfil})
            .returning('id');

        resp.status(201).json({
            id: user[0].id,
            message: "Usuario criado com sucesso!"
        })
    }catch (error){
        console.log(error)
        resp.status(500).json({
            message: "Falha ao salvar usuario."
        })
    }
};

exports.getUserById = async (req, resp) => {
    try {
        const usuario = await knex
          .select("*")
          .from("usuarios")
          .where("id", req.params.id)
          .first();
    
        if (!usuario) {
          resp.status(404).json({ message: "Usuário não encontrado" });
        } else {
            const dataPost = {
                id: usuario.id,
          login: usuario.login,
          nome: usuario.nome,
          perfil: usuario.perfil,
                links: [
                  {
                    rel: "self",
                    href: process.env.BASE + "api/usuarios/" + usuario.id,
                  },
                  {
                    rel: "usuarios",
                    href: process.env.BASE + "api/usuarios",
                  },
                ],
              };
              resp.status(200).json({ data: dataPost });
        }
    } catch (err) {
        resp.status(500).json({
          message: "Erro ao recuperar usuários - " + err.message,
        });
    }
}

exports.getAllUsers = async (req, resp) => {
    try{
        const usuarios = await knex
            .select("*")
            .from("usuarios")
            .orderBy(req.query.orderBy || "id", req.query.order || "asc")
            .paginate({
                perPage: req.query.limit || 1000,
                currentPage: req.query.page || 1,
            });
    let dataUser = [];
    if (usuarios.data.length > 0) {
      usuarios.data.map((usuario, i) => {
        dataUser[i] = {
          id: usuario.id,
          login: usuario.login,
          nome: usuario.nome,
          perfil: usuario.perfil,
          links: [
            {
              rel: "self",
              href: process.env.BASE + "api/usuarios/" + usuario.id,
            }
          ],
        };
      });
    }
    resp.status(200).json({
      data: dataUser,
      pagination: {
        ...usuarios.pagination,
        orderBy: req.query.orderBy,
        order: req.query.order,
      },
    });
    } catch (err) {
        resp.status(500).json({
          message: "Erro ao recuperar usuários - " + err.message,
        });
    }
}

exports.deleteUsuario = async (req, resp) =>{
    try{
        const usuarios = await knex
            .select("*")
            .from("usuarios")
            .where("id", req.params.id)
            .first();

        if(!usuarios){
            resp.status(404).json({ message: "Usuario não encontrado." });
            return        
        }
        await knex("usuarios").where("id", req.params.id).del();
        resp.status(204).send();
    } catch (err) {
        resp.status(500).json({
          message: "Erro ao deletar usuario - " + err.message,
        });
    }
}

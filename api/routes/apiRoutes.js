const express = require("express");

let apiRouter = express.Router();
const knex = require("knex")(require("../../knexfile").development);

const endpoint = "/";

// Recuperar produtos
apiRouter.get(endpoint + "produtos", (req, res) => {
  knex
    .select("*")
    .from("produtos")
    .then((produtos) => res.status(200).json({ data: produtos }))
    .catch((err) => {
      res.status(500).json({
        message: "Erro ao recuperar produtos - " + err.message,
      });
    });
});

// Recupera produto por id
apiRouter.get(endpoint + 'produtos/:id', (req, res) => { 
  const id = parseInt(req.params.id);
  knex
    .select("*")
    .from("produtos")
    .where("id", id)
    .then((produtos) => res.status(200).json({ data: produtos }))
    .catch((err) => {
      res.status(500).json({
        message: "Erro ao recuperar produtos - " + err.message,
      });
    });
  
})

// Insere novo produto
apiRouter.post(endpoint + "produtos", (req, res) => {
  const produto = req.body;
  knex("produtos")
    .insert(produto, "id")
    .then((produtos) => {
      let id = produtos[0];
      res
        .status(201)
        .json({ message: `Produto inserido com sucesso`, data: id });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: `Erro ao inserir produto: %{err.message}` });
    });
});

// Atualizar um produto
apiRouter.put(endpoint + 'produtos/:id', (req, res) => { 
  const id = parseInt(req.params.id);
  const updatedItem = req.body;
  console.log(updatedItem);
  knex("produtos")
  .where({id: id})
  .update(updatedItem)
.then(rows => {
  if (!rows){
    return res.status(404).json({message: `Produto não encontrado`});
  }
  return res.json({ message: `Produto atualizado com sucesso`, data: {...updatedItem,id} });
})
.catch((err) => {
  res
    .status(500)
    .json({ message: `Erro ao atualizar produto: `+ err.message});
});
})

//Deletar produto
apiRouter.delete(endpoint + 'produtos/:id', (req, res) => { 
  const id = parseInt(req.params.id);
  knex('produtos')
  .where("id", id )
  .del()
  .then((produtos) => {
    let id = produtos[0];
    res
      .status(200)
      .json({ message: `Produto excluido com sucesso`, data: id });
  })
  .catch((err) => {
    res
      .status(500)
      .json({ message: `Erro ao excluir produto: `+ err.message});
  });
 })

module.exports = apiRouter;

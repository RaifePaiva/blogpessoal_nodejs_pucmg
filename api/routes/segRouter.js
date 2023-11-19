const express = require("express");
const apiSeg = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const knex = require("knex")(require("../../knexfile").development);

apiSeg.post("/login", async (req, res) => {
  return login(req, res);
});

apiSeg.checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (token == null)
    return res.status(401).json({ mensagem: "Token inválido" });

  jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) return res.status(403).json({ mensagem: "Token inválido" });

    req.token = payload;
    next();
  });
};

apiSeg.isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.redirect("/app/login");
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      res.redirect("/app/login");
    }
    next();
  });
};

apiSeg.isAdmin = (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ mensagem: "Token inválido" });
  }

  const perfil = req.token.perfil;

  if (perfil.indexOf("ADMIN") < 0) {
    return res.status(403).json({ mensagem: "Acesso não Autorizado" });
  }
  next();
};

apiSeg.login = (req, res, next) => {
  return login(req, res);
  next();
};

async function login (req, res) {
  const { login, senha } = req.body;
  try {
    if (!login || !senha) {
      return res
        .status(401)
        .json({ mensagem: "Existem campos obrigatórios não preenchidos." });
    }

    const usuarios = await knex("usuarios").where({ login });

    if (usuarios.length === 0) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválidos" });
    }

    const senhaOk = await bcrypt.compare(senha, usuarios[0].senha);

    if (!senhaOk) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválidos" });
    }

    // Montar token JWT
    jwt.sign(
      {
        login: login,
        nome: usuarios[0].nome,
        id: usuarios[0].id,
        perfil: usuarios[0].perfil,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.status(500).json({ mensagem: "Erro ao gerar token" });
        }

        res.status(200).json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: "Erro ao efetuar login" });
  }
}

module.exports = apiSeg;

const express = require('express')
const apiSeg = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const knexEnv = process.env.NODE_ENV || 'development'
const knexConfig = require('../knexfile')[knexEnv]
const knex = require('knex')(knexConfig)

apiSeg.post('/login', (req, res) => {
    const { login, senha } = req.body;
    knex("usuarios")
        .where({login})
        .then (usuarios => {
            if (usuarios.length) {
                bcrypt.compare(usuarios[0].senha, senha)
                    .then (senhaOk => {
                        //Montar token JWT
                        jwt.sign({ "login": login, "nome": usuarios[0].nome, "perfil": usuarios[0].perfil }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                            if (err) {
                                res.status(500).json({ mensagem: "Erro ao gerar token" })
                            }
                            
                            res.status(200).json({ token })
                        })
                    })
            }
            else {
                res.status(401).json({ mensagem: "Usuário ou senha inválidos" })
            }
        })
})

apiSeg.checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer <token>
    if (token == null) return res.status(401).json({ mensagem: "Token inválido" })

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) 
            return res.status(403).json({ mensagem: "Token inválido" })

        
        req.token = payload
        next()
    })
}

apiSeg.isAdmin = (req, res, next) => {
    if (!req.token) {
        return res.status(401).json({ mensagem: "Token inválido" })
    }

    const perfil = req.token.perfil;

    if (perfil.indexOf("ADMIN") < 0) {
        return res.status(403).json({ mensagem: "Acesso não Autorizado" })
    }
    next()
}

module.exports = apiSegA
const guid = require('guid')
const repository = require('../repositories/order-repository')
const authService = require('../services/auth-service');

exports.post = async(req, res, next) => {

    try {
        await repository.create({
            customer: req.body.customer,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        })
        res.status(201).send({
                message: 'Pedido Cadastrado com Sucesso'}
        );
    } catch (error) {
        res.status(500).send({
            message: 'Erro na requisição.'
        })
    }
};

exports.get = async(req, res, next) => {
    try {
        let data = await repository.get()
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Erro na requisição.'
        })
    }
};

exports.post = async(req, res, next) => {

    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        await repository.create({
            customer: data.id,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        })
        res.status(201).send({
                message: 'Pedido Cadastrado com Sucesso'}
        );
    } catch (error) {
        res.status(500).send({
            message: 'Erro na requisição.'
        })
    }
};

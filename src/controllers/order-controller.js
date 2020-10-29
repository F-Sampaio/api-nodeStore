const guid = require('guid')
const repository = require('../repositories/order-repository')

exports.post = async(req, res, next) => {

    try {
        await repository.create({
            customer: req.body.customer,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        })
        res.status(201).send({
                message: 'Cliente Cadastrado com Sucesso'}
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

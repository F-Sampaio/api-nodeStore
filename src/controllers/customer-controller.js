const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const emailService = require('../services/email-service');


exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve ter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-Mail inválido');
    contract.hasMinLen(req.body.password, 3, 'A Senha deve ter pelo menos 3 caracteres');

    // Se contract for valido
    if(!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        })

        emailService.send(req.body.email,
             'Bem vindo à Node Store', 
             global.EMAIL_TEMPLATE.replace('{0}', 
             req.body.name));

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

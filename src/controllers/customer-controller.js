const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const authService = require('../services/auth-service');
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
            password: md5(req.body.password + global.SALT_KEY),
            roles: ["user"]
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


exports.authenticate = async(req, res, next) => {
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        }) 
        
        console.log(customer);
        if(!customer){
            res.status(404).send({
                message: 'Usuário ou Senha inválidos'
            });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        }); 
        res.status(201).send({
                token: token,
                data: {
                    email: customer.email,
                    name: customer.name
                }
        });
    } catch (error) {
        res.status(500).send({
            message: 'Erro na requisição.'
        })
    }
};

exports.refreshToken = async(req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await repository.getById(data.id) 
        
        console.log(customer);
        if(!customer){
            res.status(404).send({
                message: 'Cliente não encontrado!'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        }); 
        res.status(201).send({
                token: token,
                data: {
                    email: customer.email,
                    name: customer.name
                }
        });
    } catch (error) {
        res.status(500).send({
            message: 'Erro na requisição.'
        })
    }
};
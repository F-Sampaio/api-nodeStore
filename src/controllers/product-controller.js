const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');
const azure = require('azure-storage');
const guid = require('guid');
let config = require('../config');


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

exports.getBySlug = async(req, res, next) => {
    try {
        let data = await repository.getBySlug(req.params.slug)
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Erro na requisição.'
        })
    }
};

exports.getById = async(req, res, next) => {
    try {
        let data = await repository.getById(req.params.id)
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send({
            message: 'Erro na requisição.'
        })
    }
};

exports.getByTag = async(req, res, next) => {
    try {
        let data = await repository.getByTag(req.params.tag)
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send({
            message: 'Erro na requisição.'
        })
    }
};

exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O titulo deve ter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O Slug deve ter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A descrição deve ter pelo menos 3 caracteres');

    // Se contract for valido
    if(!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        const blobService = azure.createBlobService(config.containerConnectionString);

        let filename = guid.raw().toString() + '.jpg';
        let rawdata = req.body.image;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');

        await blobService.createBlockBlobFromText('product-images', filename, buffer, {
            contentType: type
        }, (error) => {
            if(error){
                filename = 'default-product.png'
            }
        });


        await repository.create({
            title: req.body.title,
            slug: req.body.title,
            description: req.body.description,
            price: req.body.price,
            active: true, 
            tags: req.body.tags,
            image: 'https://nodefps.blob.core.windows.net/product-images/' + filename
        })
        res.status(201).send({
                message: 'Produto Cadastrado com Sucesso'}
        );
    } catch (error) {
        res.status(500).send({
            message: 'Erro na requisição.'
        })
    }
};

exports.put = async(req, res, next) => {
    
    try {
        await repository.update(req.params.id, req.body)
        res.status(200).send({
            message: 'Produto Atualizado com Sucesso'
        })
     } catch (error) {
        res.status(500).send({
            message: 'Erro na requisição.'
        })
     }
};

exports.delete = async(req, res, next) => {
    
    try {
        await repository.delete(req.body.id)
        res.status(200).send({
            message: 'Produto removido com Sucesso'
        })
    } catch (error) {
        res.status(500).send({
            message: 'Erro na requisição.'
        })  
    }
    
};
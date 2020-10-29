const mongoose =  require('mongoose');
const Customer = mongoose.model('Customer');

exports.get = async() => {
    const res = await Customer.find({})
    return res
}

exports.create = async(data) => {
    let customer = new Customer(data);
    await customer.save()
}
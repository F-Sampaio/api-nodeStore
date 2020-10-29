let errors = [];

function validationContract(){
    errors = [];
 }

validationContract.prototype.isRequired = (value, message) => {
    if(!value || value.length <= 0){
        errors.push({ message: message });
    };
}

validationContract.prototype.hasMinLen = (value, min, message) => {
    if(!value || value.length < min){
        errors.push({ message: message });
    }
}

validationContract.prototype.hasMaxLen = (value, max, message) => {
    if(!value || value.length > max){
        errors.push({ message: message });
    }
}

validationContract.prototype.isFixedLen = (value, len, message) => {
    if(value != len){
        errors.push({ message: message });
    }
}

validationContract.prototype.isEmail = (value, message) => {
    var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(value))
        errors.push({ message: message });
}

validationContract.prototype.errors = () => {
    return errors;
}

validationContract.prototype.clear = () => {
    errors = [];
}

validationContract.prototype.isValid = () => {
    return errors.length == 0;
}

module.exports = validationContract;
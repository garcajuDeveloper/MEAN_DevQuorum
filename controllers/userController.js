const validator = require('validator');

const controller = {
    test: function(request, response){
        return response.status(200).send({
            message: "test method working" 
        });
    },

    save: function(request, response){
        let params = request.body;
        let isValid = validate(params);

        console.log('isValid = '+isValid);

        (isValid) ? response.status(200).send({ message : "Validation successfull"}) : response.status(200).send({ message : "Validation failed"}); 
    }
}

function validate (params){
    let validateName = !validator.isEmpty(params.name);
    let validateSurname = !validator.isEmpty(params.surname);
    let validateEmail = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    let validatePassword = !validator.isEmpty(params.password);

    console.log(validateName, validateSurname, validateEmail, validatePassword);

    if(validateName && validateSurname && validateEmail && validatePassword){return true;}

    return false;
}

module.exports = controller;
const secretKey = 'boda23022013';
const JWT = require('jwt-simple');
const MOMENT = require('moment');

exports.authenticated = (request, response, next) =>{

    if(!request.headers.authorization){
        return response.status(403).send({
            message : "the request ain't got the authorization header"
        });
    }
    let token = request.headers.authorization.replace(/['"]+/g, '');

    try{
        var payload = JWT.decode(token, secretKey);

        if(payload.exp <= MOMENT().unix()){
            return response.status(404).send({
                message : "expired token"
            });
        }
    }catch(exception){
        return response.status(404).send({
            message : "invalid token"
        });
    }
 
    request.user = payload;

    next();
};
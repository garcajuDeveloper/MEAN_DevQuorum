const JWT = require('jwt-simple');
const MOMENT = require('moment');

exports.createToken = (user) => {
    let payload = {
        sub : user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: MOMENT().unix(),
        exp:  MOMENT().add(30, 'days').unix
    };

    return JWT.encode(payload, 'boda23022013');
};
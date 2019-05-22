const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
var UserSchema = Schema({
    name : String,
    surname : String,
    email : String,
    password : String,
    image : String,
    role : String
});

UserSchema.methods.toJSON = function(){
    let userObject = this.toObject();
    delete userObject.password;

    return userObject;
}

module.exports = mongoose.model('User', UserSchema);
const VALIDATOR = require('validator');
const BCRYPT = require('bcrypt-nodejs');
const FILESYSTEM = require('fs');
const PATH = require('path');
const User = require('../models/user');
const jwtUser = require('../services/jwt');

const useController = {
    
    save: (request ,response) => {
        let params = request.body;

        try{
            let valid_name = !VALIDATOR.isEmpty(params.name);
            let valid_surname = !VALIDATOR.isEmpty(params.surname);
            let valid_email = !VALIDATOR.isEmpty(params.email) && VALIDATOR.isEmail(params.email);
            let valid_password = !VALIDATOR.isEmpty(params.password);
        }catch(error){
            return response.status(200).send({
                message : "Missing data.Impossible regist",
            }); 
        }
        if(valid_name && valid_surname && valid_email && valid_password){
            let newUser = new User();
 
            newUser.name = params.name; 
            newUser.surname = params.surname;
            newUser.email = params.email.toLowerCase();
            newUser.password = null;
            newUser.role = 'ROLE_USER';
            newUser.image = null;

            User.findOne({email : newUser.email}, (error, issetUser) => {
                if(error){
                    return response.status(500).send({
                        message : "User duplicity error"
                    });   
                }

                if(!issetUser){ 
                    BCRYPT.hash(params.password, null ,null , (error ,hash)=>{
                        newUser.password = hash;
                        
                        newUser.save((error, userStored) => {
                            if(error){
                                return response.status(500).send({
                                    message : "Error storing this user"
                                });  
                            }

                            if(!userStored){
                                return response.status(500).send({
                                    message : "user NOT saved"
                                });
                            }

                            return response.status(200).send({
                                status: "success",
                                user : userStored
                            });
                        });
                    });
                }else{
                    return response.status(200).send({
                        message : "User already exist"
                    });  
                }
            });
        }else{
            return response.status(400).send({
                message : "Wrong data validation",
            });
        }
    }, 

    login : (request , response) => {
        let params = request.body;

        let valid_email = !VALIDATOR.isEmpty(params.email) && VALIDATOR.isEmail(params.email);
        let valid_password = !VALIDATOR.isEmpty(params.password);

        if(!valid_email || !valid_password){
            return response.status(200).send({
                message : "Missed credential",
            });
        }
        User.findOne({email : params.email.toLowerCase()}, (error ,userFinded) =>{
            if(error ){
                return response.status(500).send({
                    message : "login action error"
                });
            }

            if(!userFinded){
                return response.status(404).send({
                    message : "this user doesn't exist"
                });
            }
            
            BCRYPT.compare(params.password, userFinded.password, (error,check) =>{
                if(error){
                    return response.status(500).send({
                        message : "Impossible to generate a login token"
                    });
                }
                if(check){
                    if(params.gettoken){
                        return response.status(200).send({
                            token : jwtUser.createToken(userFinded)
                        });
                    }else{
                        userFinded.password = undefined;

                        return response.status(200).send({
                            stauts : 'success',
                            userFinded 
                        });
                    }
                }else{
                    return response.status(200).send({
                        message : "Wrong credential",
                    });
                }
            });  
        });
    },

    update: (request,response) =>{
        let params = request.body;

        try{
            let valid_name = !VALIDATOR.isEmpty(params.name);
            let valid_surname = !VALIDATOR.isEmpty(params.surname);
            let valid_email = !VALIDATOR.isEmpty(params.email) && VALIDATOR.isEmail(params.email);
        }catch(error){
            return response.status(200).send({
                message : "Missing data.Impossible update",
            }); 
        }
   
        delete params.password;

        let userID = request.user.sub

        if(request.user.email != params.email){
            User.findOne({email : params.email.toLowerCase()}, (error ,userFinded) =>{
                if(error ){
                    return response.status(500).send({
                        message : "login action error"
                    });
                }
    
                if(userFinded && userFinded.email == params.email){
                    return response.status(404).send({
                        message : "Email address can't be modificated"
                    });
                }else{
                    User.findOneAndUpdate({_id: userID }, params, {new: true}, (error, userUpdated) =>{
                        if(error){
                            return response.status(500).send({
                                status : 'error',
                                message : "update error"
                            });
                        }
        
                        if(!userUpdated){
                            return response.status(500).send({
                                status : 'error',
                                message : "Cannot update the user"
                            });
                        }
        
                        return response.status(200).send({
                            status: 'success',
                            userUpdated
                        });
                    });
                }
            });
        }
    },

    uploadAvatar: (request, response) => {
        let fileName = 'Avatar not upload..';

        if(!request.files){
            return response.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        let file_Path = request.files.file0.path;
        let file_Split = file_Path.split('\\');
        let file_Name = file_Split[2];
        let ext_Split = file_Name.split('\.');
        let file_Extension = ext_Split[1];
        const extensions = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
        let isValidExtension = false;

        for(let i = 0; i<extensions.length; i++){
            if (file_Extension == extensions[i]) isValidExtension = true;
        }

        if(isValidExtension == false){
            FILESYSTEM.unlink(file_Path, () => {
                return response.status(200).send({
                    status: 'error',
                    message: "invalid file extension"
                });
            });
        }else{
            let userID = request.user.sub;

            User.findByIdAndUpdate({_id: userID}, {image: file_Name}, {new:true}, (error, userUpdated) => {
                if(error || !userUpdated){
                    return response.status(500).send({
                        status: 'error',
                        message: "Can't save the user with his image"
                    });
                }
                return response.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            });
        }
    },

    getAvatar: (request, response) => {
        let fileName = request.params.fileName;
        let filePath = './uploads/users/' + fileName;

        FILESYSTEM.exists(filePath, (fileExists) => {
            (fileExists) ? response.sendFile(PATH.resolve(filePath)) : response.status(404).send({ message: 'No image founded'})
        });
    },

    getUsers: (request, response) => {
        User.find().exec((error, userList) => {
            if( error || !userList){
                return response.status(404).send({
                    status: 'error',
                    message: "There's no users to show"
                });
            }

            return response.status(200).send({
                status: 'success',
                userList
            });
        });
    },

    getUser: (request, response) => {
        let userID = request.params.userID;

        User.findById(userID).exec((error, user) => {
            if( error || !user ){
                return response.status(404).send({
                    status: 'error',
                    message: "No user exists with this id"
                });
            }

            return response.status(200).send({
                status: 'success',
                user
            });
        });
    }
};

module.exports = useController;
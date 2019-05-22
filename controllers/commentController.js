const Topic = require('../models/topic');
const VALIDATOR = require('validator');

const commentController = {
    addComment : (request, response) => {
        let topicID = request.params.topicId;

        Topic.findById(topicID).exec((error, topicStored) => {
            if(error){
                return response.status(500).send({
                    status : 'error',
                    message : "Error into request"
                }); 
            }

            if(!topicStored){
                return response.status(404).send({
                    status : 'error',
                    message : "the topic doesn't exist"
                }); 
            }
            if(request.body.content){
                try{
                    var validateContent = !VALIDATOR.isEmpty(request.body.content);
                }catch(error){
                    return response.status(200).send({
                        message: 'your comment is empty'
                    }); 
                }

                if(validateContent){
                    let comment = {
                        user : request.user.sub,
                        content : request.body.content,
                    }
                    topicStored.comments.push(comment);
                    topicStored.save((error) =>{
                        if(error){
                            return response.status(500).send({
                                status : 'error',
                                message : "Error saving the comment"
                            });    
                        }
                        return response.status(200).send({
                            status : 'success',
                            topicStored
                        });
                    }); 
                }else{
                    return response.status(200).send({
                        message: 'your comment is no validated'
                    }); 
                }
            }
        });
    },

    updateComment : (request, response) => {
        let commentID = request.params.commentId;
        let params = request.body;

        try{
            var validateContent = !VALIDATOR.isEmpty(params.content);
        }catch(error){
            return response.status(200).send({
                message: 'your comment is empty'
            }); 
        }

        if(validateContent){
            Topic.findOneAndUpdate(
                {"comments._id" : commentID},
                {
                    "$set":{
                        "comments.$.content" : params.content
                    }
                },
                {new : true},
                (error, topicUpdated) => {
                    if(error){
                        return response.status(500).send({
                            status : 'error',
                            message : "Error into request"
                        }); 
                    }
        
                    if(!topicUpdated){
                        return response.status(404).send({
                            status : 'error',
                            message : "the topic doesn't exist"
                        }); 
                    }
                    return response.status(200).send({
                        status : 'success',
                        topicUpdated
                    }); 
                });
        }
    },

    deleteComment : (request, response) => {
        //conseguir id del topic y del comentario a borrar
        let topicID = request.params.topicId;
        let commentID = request.params.commentId;
        //buscar el topic
        Topic.findById(topicID, (error, topic) => {
            if(error){
                return response.status(500).send({
                    status : 'error',
                    message : "Error into request"
                }); 
            }

            if(!topic){
                return response.status(404).send({
                    status : 'error',
                    message : "the topic doesn't exist"
                }); 
            }
            //seleccionar el subdocumento (comentario)
            let comment =  topic.comments.id(commentID);
        //borrar el comentario  
            if(comment){ 
                comment.remove();
                //guardar el topic
                topic.save((error)=>{
                    if(error){
                        return response.status(500).send({
                            status : 'error',
                            message : "Error into request"
                        }); 
                    }
                    //devolver repsuesta
                    return response.status(200).send({
                        status : 'success',
                        topic
                    });
                });
            }else{
                return response.status(404).send({
                    status : 'error',
                    message : "the comment doesn't exist"
                }); 
            }
        }); 
    }
};

module.exports = commentController;
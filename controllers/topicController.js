const VALIDATOR = require('validator');
const Topic = require('../models/topic');

const topicController = {
    save: (request, response) => {
        let params = request.body;
    
        try{
            var validateTitle = !VALIDATOR.isEmpty(params.title);
            var validateContent = !VALIDATOR.isEmpty(params.content);
            var validateLang = !VALIDATOR.isEmpty(params.lang);
        }catch(error){
            return response.status(200).send({
                message: 'Missing data to send'
            }); 
        }

        if(validateContent && validateLang && validateTitle){
            let topic = new Topic();

            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang = params.lang;
            topic.user = request.user.sub;

            topic.save((error, topicStored) => {
                if(error || !topicStored){
                    return response.status(500).send({
                        status: 'error',
                        message: 'Impossible to store the topic'
                    }); 
                }
                return response.status(200).send({
                    status: 'success',
                    topic: topicStored
                }); 
            }); 
        }else{
            return response.status(500).send({
                message: 'Data not valid'
            }); 
        }
    },

    getTopics: (request, response) => {
        if(!request.params.page || request.params.page == 0 || 
                request.params.page == "0" || request.params.page == undefined)
        {
            var page = 1;
        }else{
            var page = parseInt(request.params.page);
        }
        
        let paginationOptions = {
            sort: { date: -1 },
            populate: 'user',
            limit: 5,
            page: page
        }

        Topic.paginate({}, paginationOptions, (error, topicList) =>{
            if(error){
                return response.status(500).send({
                    status: 'error',
                    message: 'Error to consult'
                }); 
            }

            if(!topicList){
                return response.status(404).send({
                    status: 'error',
                    message: 'No topics to show'
                }); 
            }

            return response.status(200).send({
                status: 'success',
                topic: topicList.docs,
                totalDocs: topicList.totalDocs,
                totalPages: topicList.totalPages
            });   
        })
    },

    getTopicsByUser: (request, response) => {
        //Conseguir el id del user
        let userID = request.params.user;

        //find con condición del id del user
        Topic.find({
            user : userID
        })
        .sort([['date', 'descending']])
        .exec((error, topics) => {
            if(error){
                return response.status(500).send({
                    status: 'error',
                    message: 'Error into request'
                }); 
            }
            
            if(!topics){
                return response.status(404).send({
                    status: 'error',
                    message: 'No topics to show'
                }); 
            }else{
                return response.status(200).send({
                    status : 'success',
                    topics
                });  
            }
        });
    },

    getTopic : (request, response) =>{
        let topicID = request.params.topicId;

        Topic.findById(topicID)
            .populate('user')
            .exec((error, topic) => {
            if(error){
                return response.status(500).send({
                    status: 'error',
                    message: 'Error searching the topic'
                }); 
            }

            if(!topic){
                return response.status(404).send({
                    status: 'error',
                    message: 'Topic not found'
                }); 
            }else{
                return response.status(200).send({
                    status : 'success',
                    topic
                }); 
            }
        });
    },

    updateTopic: (request,response) => {
        let topicID = request.params.id;
        let params = request.body;

        try{
            var validateTitle = !VALIDATOR.isEmpty(params.title);
            var validateContent = !VALIDATOR.isEmpty(params.content);
            var validateLang = !VALIDATOR.isEmpty(params.lang);
        }catch(error){
            return response.status(200).send({
                message: 'Missing data to send'
            }); 
        }

        if(validateTitle && validateContent && validateLang){
            let update = {
                title : params.title,
                content : params.content,
                code : params.code,
                lang : params.lang
            };
    
            Topic.findOneAndUpdate({_id : topicID, user: request.user.sub}, update, {new : true},
                 (error, topicUpdated) => {
                    if(error){
                        return response.status(500).send({
                            status : 'error',
                            message : 'error into request'
                        });     
                    }

                    if(!topicUpdated){
                        return response.status(404).send({
                            status : 'error',
                            message : 'topic not updated'
                        }); 
                    }

                    return response.status(200).send({
                        status : 'success',
                        topicUpdated
                    });      
            });
        }else{
            return response.status(500).send({
                status : 'error',
                message : 'incorrect data validation'
            }); 
        }
    },

    deleteTopic : (request, response) => {
        let topicID = request.params.id;

        Topic.findOneAndDelete({_id : topicID, user: request.user.sub}, (error, topicRemoved) => {
            if(error){
                return response.status(500).send({
                    status : 'error',
                    message : 'error into request'
                });     
            }

            if(!topicRemoved){
                return response.status(404).send({
                    status : 'error',
                    message : 'topic not deleted or not exists'
                }); 
            }

            return response.status(200).send({
                status : 'success',
                topicRemoved
            }); 
        })
    },

    searchTopic: (request, response) => {
        //Conseguir string de busqueda de la url
        let searchstring = request.params.search;
        //find or
        Topic.find({"$or" : [
            {"title" : {"$regex" : searchstring, "$options" : "i"}},
            {"content" : {"$regex" : searchstring, "$options" : "i"}},
            {"lang" : {"$regex" : searchstring, "$options" : "i"}},
            {"code" : {"$regex" : searchstring, "$options" : "i"}},
        ]})
        .sort([['date', 'descending']])
        .exec((error, topics)=>{
            if(error){
                return response.status(500).send({
                    status : 'error',
                    message : 'error into request'
                }); 
            }

            if(!topics){
                return response.status(404).send({
                    status : 'error',
                    message : 'topics not avalaible'
                }); 
            }
            //devolver repsuesta
            return response.status(200).send({
                status : 'success',
                topics
            }); 
        })
    }
}

module.exports = topicController;

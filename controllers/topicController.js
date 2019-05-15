const VALIDATOR = require('validator');
const Topic = require('../models/topic');

const topicController = {
    test: (request, response) => {
        return response.status(200).send({
            message: 'Hola que tal desde el topicController'
        }); 
    },

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
       //Cargar pagina actual
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
        //Find paginado
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
    }
}

module.exports = topicController;
//TODO 44. Devovler temas --> 1. Sacar temas de los usuarios
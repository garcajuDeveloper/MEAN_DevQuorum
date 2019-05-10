const controller = {
    test: function(request, response){
        return response.status(200).send({
            message: "test method working" 
        });
    }
}

module.exports = controller;
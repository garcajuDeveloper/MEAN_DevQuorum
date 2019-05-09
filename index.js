const mongoose = require('mongoose');
const mongoConnectionURI = 'mongodb://localhost:27017/forumDB'
const app = require('./App');
const backendPort = process.env.PORT || 3999;

mongoose.Promise = global.Promise;
mongoose.connect(mongoConnectionURI, { useNewUrlParser : true})
        .then(() => {
            console.log("DB online!");
            app.listen(backendPort, () =>{
                console.log("The Backend Server is listen in port: " + backendPort);
            });
        })
        .catch(error => console.log(error));
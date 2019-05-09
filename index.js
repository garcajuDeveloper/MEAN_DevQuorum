const mongoose = require('mongoose');
const mongoConnectionURI = 'mongodb://localhost:27017/forumDB'

mongoose.Promise = global.Promise;
mongoose.connect(mongoConnectionURI, { useNewUrlParser : true})
        .then(() => {
            console.log("DB online!");
        })
        .catch(error => console.log(error));
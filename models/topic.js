const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CommentSchema = Schema ({
    content : String,
    date : { type : Date, default : Date.now },
    user : { type : Schema.ObjectId, ref : 'User'}
})

const TopicSchema = Schema({
    title : String,
    content : String,
    code : String,
    lang : String,
    date : { type : Date, default : Date.now },
    user : { type : Schema.ObjectId, ref : 'User'},
    comments : [CommentSchema]
});

TopicSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Topic', TopicSchema);
// DBModel for posts

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var postSchema = new Schema({
    date: {type: Date, default: Date.now},
    author: {type: String, default: 'Anonymous'},
    title: {type: String, default: ''},
    post: {type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema);
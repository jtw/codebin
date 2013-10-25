// DBModel for posts

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var postLanguageSchema = new Schema({
    name: {type: String, required: true, unique: true, sparse: true},
    code: {type: String, required: true, unique: true, sparse: true}
});

module.exports = mongoose.model('PostLanguage', postLanguageSchema);

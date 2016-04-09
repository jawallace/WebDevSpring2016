module.exports = function(mongoose) {
   
    /*
     * This structure was adopted from 
     * https://docs.mongodb.org/ecosystem/use-cases/storing-comments/
     */
    var CommentSchema = mongoose.Schema({
        user: { type: mongoose.Schema.ObjectId, required: true },
        discussion: { type: mongoose.Schema.ObjectId, required: true },
        slug: { type: String, required: true },
        posted: { type: Date, default: Date.now },
        text: { type: String, required: true }
    }, { collection: 'project.comment' });


    return mongoose.model('Comment', CommentSchema);
}

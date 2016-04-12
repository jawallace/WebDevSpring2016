module.exports = function(mongoose) {
    'use strict';

    var DiscussionSchema = mongoose.Schema({
        topic: { type: String, required: true },
        user: { type: mongoose.Schema.ObjectId, required: true },
        reading: { type: mongoose.Schema.ObjectId, required: true },
        posted: { type: Date, default: Date.now }
    }, { collection: 'project.discussion' });

    return mongoose.model('Discussion', DiscussionSchema);

}

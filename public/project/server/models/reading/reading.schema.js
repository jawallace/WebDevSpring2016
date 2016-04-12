module.exports = function(mongoose) {
    'use strict';

    var ReadingSchema = mongoose.Schema({
        book: { type: String, required: true },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date, required: true },
        group: { type: mongoose.Schema.ObjectId, required: true }
    }, { collection: 'project.reading' });

    return mongoose.model('Reading', ReadingSchema);

}

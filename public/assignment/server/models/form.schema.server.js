module.exports = function(mongoose) {
    'use strict';

    var FieldSchema = require('./field.schema.server.js')(mongoose);

    var FormSchema = mongoose.Schema({
        userId: String,
        title: {
            type: String,
            default: "New Form"
        },
        fields: [FieldSchema],
        created: {
            type: Date,
            default: Date.now
        },
        updated: {
            type: Date,
            default: Date.now
        }
    }, { collection: 'assignment.form' });

    return FormSchema;

}

module.exports = function(mongoose) {
    'use strict';

    var FieldSchema = require('./form.schema.server.js')();

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
    });

    return FormSchema;

}

module.exports = function(mongoose) {
    'use strict';

    var FieldSchema = mongoose.Schema({
        label: String,
        type: { 
            type: String, 
            enum: [ "TEXT", "TEXTAREA", "EMAIL", "PASSWORD", "OPTIONS", "DATE", "RADIOS", "CHECKBOXES" ],
            default: "TEXT" 
        },
        placeholder: String,
        options: [{
            label: String,
            value: String
        }]
    });

    return FieldSchema;

}

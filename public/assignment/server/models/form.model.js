module.exports = function(mongoose) {
    'use strict';

    var utils = require('./util.js')();

    var FormSchema = require('./form.schema.server.js')(mongoose);
    var Form = mongoose.model('Form', FormSchema);

    var service = {
        create: utils.defer(createForm),
        findAll: utils.defer(findAllForms),
        findById: utils.defer(findFormById),
        findFormByTitle: utils.defer(findFormByTitle),
        findFormsForUser: utils.defer(findFormsForUser),
        update: utils.defer(updateForm),
        delete: utils.defer(deleteForm),

        fields: {
            create: utils.defer(createField),
            findAll: utils.defer(findAllFields),
            findById: utils.defer(findFieldById),
            update: utils.defer(updateField),
            set: utils.defer(setFields),
            delete: utils.defer(deleteField)
        }
    };

    activate();

    return service;

    //////////////////////////
    
    function activate() {
    }

    function createForm(resolve, reject, form) {
        Form.create(form, function(err, doc) {
            return err ? reject(err) : resolve(doc);
        });
    }

    function findAllForms(resolve, reject) {
        Form.find(function(err, doc) {
            return err ? reject(err) : resolve(doc);
        });
    }

    function findFormById(resolve, reject, id) {
        Form.findById(id, function(err, doc) {
            return err ? reject(err) : resolve(doc);
        });
    }

    function findFormByTitle(resolve, reject, title) {
        Form.findOne({ title: title }, function(err, doc) {
            return err ? reject(err) : resolve(doc); 
        });
    }

    function findFormsForUser(resolve, reject, userId) {
        Form.find({ userId: userId }, function(err, doc) {
            return err ? reject(err) : resolve(doc); 
        });
    }

    function updateForm(resolve, reject, id, form) {
        Form.findById(id, function(err, doc) {
            if (err) {
                reject(err);
            } else {
                utils.extend(doc, form);

                doc.save(function(err, doc) {
                    return err ? reject(err) : resolve(doc);
                });
            }
        });
    }

    function deleteForm(resolve, reject, id) {
        Form.findById(id).remove(function(err, doc) {
            if (err) {
                reject(err);
            } else {
                Form.find(function(err, doc) {
                    return err ? reject(err) : resolve(doc);
                });
            }
        });
    }

    function createField(resolve, reject, formId, field) {
        Form.findById(formId, function(err, doc) {
            if (err) {
                reject(err);
            } else {
                doc.fields.push(field);

                doc.save(function(err, doc) {
                    return err ? reject(err) : resolve(doc);
                });
            }
        });
    }

    function findAllFields(resolve, reject, formId) {
        Form.findById(formId, 'fields', function(err, doc) {
            return err ? reject(err) : resolve(doc);
        });
    }

    function findFieldById(resolve, reject, formId, id) {
        Form.findOne({ _id: formId, 'fields._id': id }, { 'fields.$': 1 }, function(err, doc) {
            if (err) {
               reject(err);
            } else {
                resolve(doc.fields[0]);
            }
        });
    }

    function updateField(resolve, reject, formId, id, field) {
        Form.findOne({ _id: formId, 'fields._id': id }, function(err, doc) {
            if (err) {
                reject(err);
            } else {
                var fieldDoc = doc.fields.id(id);
                utils.extend(fieldDoc, field);

                doc.save(function(err, doc) {
                    return err ? reject(err) : resolve(fieldDoc);
                });
            }
        });
    }
    
    function setFields(resolve, reject, formId, fields) {
        Form.findById(formId, function(err, doc) {
            if (err) {
                reject(err);
            } else {
                doc.fields = fields;
                doc.save(function(err, doc) {
                    return err ? reject(err) : resolve(doc);
                });
            }
        });
    }

    function deleteField(resolve, reject, formId, id) {
        Form.findOne({ _id: formId, 'fields._id': id }, function(err, doc) {
            if (err) {
                reject(err);
            } else {
                doc.fields.id(id).remove();

                doc.save(function(err, doc) {
                    return err ? reject(err) : resolve(doc);
                });
            }
        });
    }
}

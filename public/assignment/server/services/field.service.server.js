module.exports = function(app, FormModel) {
    'use strict';

    var utils = require('./util.js')();

    var baseFieldUrl = '/api/assignment/form/:formId/field';
    var specificFieldUrl = baseFieldUrl + '/:fieldId';

    app.get(baseFieldUrl, getFieldsForForm);
    app.post(baseFieldUrl, createFieldForForm);
    app.put(baseFieldUrl, setFieldsForForm);

    app.get(specificFieldUrl, getField);
    app.delete(specificFieldUrl, deleteField);
    app.put(specificFieldUrl, updateField);

    ////////////////////////////////
    
    function getFieldsForForm(req, res) {
        FormModel.fields
            .findAll(req.params.formId)
            .then(function(fields) {
                res.json(fields);
            })
            .catch(function(err) {
                res.status(404).json(err);
            });
    }

    function createFieldForForm(req, res) {
        FormModel.fields
            .create(req.params.formId, req.body)
            .then(function(form) {
                res.json(form);
            })
            .catch(function(err) {
                res.status(404).json(err);
            });
    }

    function setFieldsForForm(req, res) {
        FormModel.fields
            .set(req.params.formId, req.body)
            .then(function(form) {
                res.json(form);
            })
            .catch(function(err) {
                res.status(404).json(err);
            });
    }

    function getField(req, res) {
        FormModel.fields
            .findById(req.params.formId, req.params.fieldId)
            .then(function(field) {
                res.json(field);
            })
            .catch(function(err) {
                res.status(404).json(err);
            });
    }

    function deleteField(req, res) {
        FormModel.fields
            .delete(req.params.formId, req.params.fieldId)
            .then(function(form) {
                res.json(form);
            })
            .catch(function(err) {
                res.status(404).json(err);
            });
    }

    function updateField(req, res) {
        FormModel.fields
            .update(req.params.formId, req.params.fieldId, req.body)
            .then(function(field) {
                res.json(field);
            })
            .catch(function(err) {
                res.status(404).json(err);
            });
    }

}

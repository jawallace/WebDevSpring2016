module.exports = function(app, FormModel) {
    'use strict';

    var utils = require('./util.js')();

    var baseFieldUrl = '/api/assignment/form/:formId/field';
    var specificFieldUrl = baseFieldUrl + '/:fieldId';

    var errorMsg = 'Field not found';

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
                utils.sendOr404(fields, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function createFieldForForm(req, res) {
        FormModel.fields
            .create(req.params.formId, req.body)
            .then(function(form) {
                utils.sendOr404(form, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function setFieldsForForm(req, res) {
        FormModel.fields
            .set(req.params.formId, req.body)
            .then(function(form) {
                utils.sendOr404(form, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function getField(req, res) {
        FormModel.fields
            .findById(req.params.formId, req.params.fieldId)
            .then(function(field) {
                utils.sendOr404(field, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function deleteField(req, res) {
        FormModel.fields
            .delete(req.params.formId, req.params.fieldId)
            .then(function(form) {
                utils.sendOr404(form, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function updateField(req, res) {
        FormModel.fields
            .update(req.params.formId, req.params.fieldId, req.body)
            .then(function(field) {
                utils.sendOr404(field, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

}

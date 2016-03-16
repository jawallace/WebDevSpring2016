module.exports = function(app, FormModel) {
    'use strict';

    var utils = require('./util.js')();
    var guid = require('guid');

    var baseFieldUrl = '/api/assignment/form/:formId/field';
    var specificFieldUrl = baseFieldUrl + '/:fieldId';

    app.get(baseFieldUrl, ensureFormExists, getFieldsForForm);
    app.post(baseFieldUrl, ensureFormExists, createFieldForForm);
    app.put(baseFieldUrl, ensureFormExists, setFieldsForForm);

    app.get(specificFieldUrl, ensureFormExists, getField);
    app.delete(specificFieldUrl, ensureFormExists, deleteField);
    app.put(specificFieldUrl, ensureFormExists, updateField);

    function ensureFormExists(req, res, next) {
        var formId = req.params.formId;

        var form = FormModel.findById(formId);
        if (! form) {
            res.status(404).json({ error: 'Form with id (' + formId + ') not found' });
        } else {
            req.form = form;
            next();
        }
    }

    function getFieldsForForm(req, res) {
        utils.sendOr404(FormModel.fields.findAll(req.form), res, 'Fields not found');
    }

    function createFieldForForm(req, res) {
        var field = req.body;
        field['_id'] = guid.raw();
        utils.sendOr404(FormModel.fields.create(req.form, field), res, 'Could not create field');
    }

    function setFieldsForForm(req, res) {
        var fields = req.body;
        utils.sendOr404(FormModel.fields.set(req.form, fields), res, 'Could not set fields');
    }

    function getField(req, res) {
        var fieldId = req.params.fieldId;

        utils.sendOr404(FormModel.fields.findById(req.form, fieldId), res, 'Field not found');
    }

    function deleteField(req, res) {
        var fieldId = req.params.fieldId;
        utils.sendOr404(FormModel.fields.delete(req.form, fieldId), res, 'Could not delete form');
    }

    function updateField(req, res) {
        var fieldId = req.params.fieldId;
        utils.sendOr404(FormModel.fields.update(req.form, fieldId, req.body), res, 'Could not delete form');
    }

}

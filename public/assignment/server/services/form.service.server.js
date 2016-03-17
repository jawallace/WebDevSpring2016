module.exports = function(app, FormModel) {
    'use strict';

    var utils = require('./util.js')();
    var guid = require('guid');

    var formUrl = '/api/assignment/form/:formId';
    var userUrl = '/api/assignment/user/:userId/form';

    var errorMsg = 'Form not found';

    app.get(formUrl, getForm);
    app.delete(formUrl, deleteForm);
    app.put(formUrl, updateForm);

    app.get(userUrl, getFormsForUser);
    app.post(userUrl, createForm);

    function getForm(req, res) {
        var id = req.params.formId;
        utils.sendOr404(FormModel.findById(id), res, errorMsg);
    }

    function deleteForm(req, res) {
        var id = req.params.formId;
        utils.sendOr404(FormModel.delete(id), res, errorMsg);
    }

    function updateForm(req, res) {
        var id = req.params.formId;
        utils.sendOr404(FormModel.update(id, req.body), res, errorMsg);
    }

    function getFormsForUser(req, res) {
        var userId = parseInt(req.params.userId);
        utils.sendOr404(FormModel.findFormsForUser(userId), res, errorMsg);
    }

    function createForm(req, res) {
        var userId = parseInt(req.params.userId);
        var form = req.body;

        form.userId = userId;
        form['_id'] = guid.raw();
        if (! form.fields) {
            form.fields = [];
        }

        utils.sendOr404(FormModel.create(form), res, errorMsg);
    }

}

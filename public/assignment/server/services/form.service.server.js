module.exports = function(app, FormModel) {
    'use strict';

    var utils = require('./util.js')();

    var formUrl = '/api/assignment/form/:formId';
    var userUrl = '/api/assignment/user/:userId/form';

    var errorMsg = 'Form not found';

    app.get(formUrl, getForm);
    app.delete(formUrl, deleteForm);
    app.put(formUrl, updateForm);

    app.get(userUrl, getFormsForUser);
    app.post(userUrl, createForm);

    ////////////////////////////////////////
    
    function getForm(req, res) {
        FormModel
            .findById(req.params.formId)
            .then(function(form) {
                utils.sendOr404(form, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function deleteForm(req, res) {
        FormModel
            .delete(req.params.formId)
            .then(function(forms) {
                utils.sendOr404(forms, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function updateForm(req, res) {
        FormModel
            .update(req.params.formId, req.body)
            .then(function(form) {
                utils.sendOr404(form, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function getFormsForUser(req, res) {
        FormModel
            .findFormsForUser(req.params.userId)
            .then(function(forms) {
                utils.sendOr404(forms, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

    function createForm(req, res) {
        var form = req.body;
        form.userId = req.params.userId;
        if (! form.fields) {
            form.fields = [];
        }

        FormModel
            .create(form)
            .then(function(form) {
                utils.sendOr404(form, res, errorMsg);
            })
            .catch(function(err) {
                utils.serverError(res, err);
            });
    }

}

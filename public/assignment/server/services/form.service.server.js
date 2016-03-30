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
                res.json(form);
            })
            .catch(function(err) {
                res.status(404).json(err);
            });
    }

    function deleteForm(req, res) {
        FormModel
            .delete(req.params.formId)
            .then(function(forms) {
                res.json(forms);
            })
            .catch(function(err) {
                res.status(404).json(err);
            });
    }

    function updateForm(req, res) {
        FormModel
            .update(req.params.formId, req.body)
            .then(function(form) {
                res.json(form);
            })
            .catch(function(err) {
                res.status(404).json(err);
            });
    }

    function getFormsForUser(req, res) {
        FormModel
            .findFormsForUser(req.params.userId)
            .then(function(forms) {
                res.json(forms);
            })
            .catch(function(err) {
                res.status(404).json(err);
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
                res.json(form);
            })
            .catch(function(err) {
                res.status(400).json(err);
            });
    }

}

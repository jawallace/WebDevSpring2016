module.exports = function() {
    
    var forms = [];

    var service = {
        create: createForm,
        findAll: findAllForms,
        findById: findFormById,
        findFormByTitle: findFormByTitle,
        update: updateForm,
        delete: deleteForm
    };

    activate();

    return service;

    function activate() {
        var mockData = require('./form.mock.json');
        for (var i = 0; i < mockData.length; i++) {
            forms.push(mockData[i]);
        }
    }

    function createForm(form) {
        forms.push(form);

        return forms;
    }

    function findAllForms() {
        return forms;
    }

    function findFormById(id) {
        var f = findForm(id);

        if (f) {
            return f.form;
        }
    }

    function findFormByTitle(title) {
        for (var i = 0; i < forms.length; i++) {
            if (forms[i].title === title) {
                return forms[i];
            }
        }
    }

    function updateForm(id, form) {
        var f = findForm(id);

        if (f) {
            for (var key in form) {
                if (form.hasOwnProperty(key)) {
                    f.form[key] = form[key];
                }
            }
            return f.form;
        }
    }

    function deleteForm(id) {
        var f = findForm(id);

        if (f) {
            forms.splice(f.index, 1);
            return f.form;
        }
    }

    function findForm(id) {
        for (var i = 0; i < forms.length; i++) {
            if (forms[i]['_id'] === id) {
                return {
                    index: i,
                    form: forms[i]
                };
            }
        }
    }
}

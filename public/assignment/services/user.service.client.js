(function() {
    'use strict';

    angular.module('FormBuilderApp')
           .service('UserService', UserService);

    function UserService() {
        var self = this;

        self.users = [
            {"_id":123, "firstName":"Alice",  "lastName":"Wonderland","username":"alice",  "password":"alice"},
            {"_id":234, "firstName":"Bob",    "lastName":"Hope",      "username":"bob",    "password":"bob"},
            {"_id":345, "firstName":"Charlie","lastName":"Brown",     "username":"charlie","password":"charlie"},
            {"_id":456, "firstName":"Dan",    "lastName":"Craig",     "username":"dan",    "password":"dan"},
            {"_id":567, "firstName":"Edward", "lastName":"Norton",    "username":"ed",     "password":"ed"} 
        ];
    
        self.findByUsernameAndPassword = findByUsernameAndPassword;
        self.findAllUsers = findAllUsers;
        self.createUser = createUser;
        self.deleteUserById = deleteUserById;
        self.updateUser = updateUser;

        /**
         * Find the user with the given username and password.
         *
         * Callback will be called with user, or null if not found.
         *
         * @param username string, the username to match
         * @param password string, the password to match 
         * @param callback fn (user), function that is called when done
         */
        function findByUsernameAndPassword(username, password, callback) {
            var len = self.users.length;
            for (var i = 0; i < len; i++) {
                var user = self.users[i];
                
                if (user.username === username && user.password === password) {
                    callback(user);
                    return;
                }
            }

            callback(null);
        }

        /**
         * Find all users.
         *
         * Callback will be called with an array of users.
         *
         * @param callback fn (users), function that is called when done
         */
        function findAllUsers(callback) {
            callback(self.users);
        }

        /**
         * Create a user with the given information.
         *
         * Callback will be called with created user.
         *
         * @param user object, the new user object
         * @param callback fn (user), function that is called when done
         */
        function createUser(user, callback) {
            user['_id'] = (new Date()).getTime();
            self.users.push(user);

            callback(user);
        }

        /**
         * Delete the user with the given id.
         *
         * Callback will be called with updated list of users.
         *
         * @param callback fn (users), function that is called when done
         */
        function deleteUserById(id, callback) {
            var len = self.users.length;
            var index;

            for (var i = 0; i < len; i++) {
                var user = self.users[i];
                
                if (user['_id'] === id) {
                    index = i;
                    break;
                }
            }

            if (index !== undefined) {
                self.users.splice(index, 1);
            }

            callback(self.users);
        }

        /**
         * If user with id exists, sets properties of the user to the properties of the provided user object.
         *
         * Callback will be called with updated user, or null if no user with the specified id exists.
         *
         * @param id integer, the id to find
         * @param user object, the new user object
         * @param callback fn (user), function that is called when done
         */
        function updateUser(id, user, callback) {
            var len = self.users.length;

            for (var i = 0; i < len; i++) {
                var theUser = self.users[i];
                
                if (theUser['_id'] === id) {
                    for (var prop in user) {
                        if (user.hasOwnProperty(prop)) {
                            console.log(prop);
                            theUser[prop] = user[prop];
                        }
                    }

                    callback(theUser);
                    return;
                }
            }
            
            callback(null);
        }
    }

}());

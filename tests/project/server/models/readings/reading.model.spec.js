var mongoose = require('mongoose');
var ReadingModel;
var chai = require('chai');
var expect = chai.expect;

var MILLIS_IN_WEEK = 604800000;
describe('ReadingModel', function() {
    'use strict';

    before(function(done) {
        ReadingModel = require('../../../../../public/project/server/models/reading/reading.model.js')(mongoose);
        done();
    });

    describe('#create()', function() {
        it('should insert a reading into the database', function(done) {
            var reading = {
                book: '12345',
                group: mongoose.Types.ObjectId(),
                endDate: new Date(Date.now() + MILLIS_IN_WEEK)
            };

            ReadingModel
                .create(reading)
                .then(function(reading) {
                    expect(reading).to.exist;
                    done();
                })
                .catch(done);
        });
    });

    describe('#findById()', function() {
        var id;
        var testReading = {
            book: '12345',
            group: mongoose.Types.ObjectId(),
            endDate: new Date(Date.now() + MILLIS_IN_WEEK)
        };

        before(function(done) {
            ReadingModel
                .create(testReading)
                .then(function(reading) {
                    id = reading._id;
                    done();
                })
                .catch(done);
        });
        
        it('should find an entry that exists', function(done) {
            ReadingModel
                .findById(id)
                .then(function(reading) {
                    expect(reading).to.exist;
                    expect(reading._id.toString()).to.equal(id.toString());
                    done();
                })
                .catch(done);
        });

        it('should not find an entry that does not exist', function(done) {
            ReadingModel
                .findById(mongoose.Types.ObjectId())
                .then(function(reading) {
                    expect(reading).to.not.exist;
                    done();
                })
                .catch(done);
        });
    });

    describe('#findByGroup()', function() {
        var groupId = mongoose.Types.ObjectId();
        var firstDate = new Date(Date.now() + MILLIS_IN_WEEK);
        var testReading = {
            endDate: firstDate,
            group: groupId,
            book: '12345'
        };
        var testReading2 = {
            endDate: new Date(firstDate.getTime() + MILLIS_IN_WEEK),
            group: groupId,
            book: '67890'
        };

        before(function(done) {
            ReadingModel
                .create(testReading)
                .then(function() {
                    ReadingModel
                        .create(testReading2)
                        .then(function() {
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

        it('should find all readings for the group, sorted by most recent', function(done) {
            ReadingModel
                .findByGroup(groupId)
                .then(function(readings) {
                    expect(readings).to.have.lengthOf(2);
                    expect(readings[0].book).to.equal('67890');
                    expect(readings[1].book).to.equal('12345');
                    done();
                });
        });
    });

    describe('#findCurrentReadingForGroup()', function() {
        var groupId = mongoose.Types.ObjectId();
        var firstDate = new Date(Date.now() + MILLIS_IN_WEEK);
        var testReading = {
            endDate: firstDate,
            group: groupId,
            book: '12345'
        };
        var testReading2 = {
            endDate: new Date(firstDate.getTime() + MILLIS_IN_WEEK),
            group: groupId,
            book: '67890'
        };

        before(function(done) {
            ReadingModel
                .create(testReading)
                .then(function() {
                    ReadingModel 
                        .create(testReading2)
                        .then(function() {
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

        it('should find the most recent reading for the group', function(done) {
            ReadingModel
                .findCurrentForGroup(groupId)
                .then(function(reading) {
                    expect(reading.book).to.equal('67890');
                    done();
                })
                .catch(done);
        });
    });
    
    describe('#delete()', function() {
        var id;
        var testReading = {
            group: mongoose.Types.ObjectId(),
            endDate: new Date(Date.now() + MILLIS_IN_WEEK),
            book: '12345'
        };

        before(function(done) {
            ReadingModel
                .create(testReading)
                .then(function(reading) {
                    id = reading._id;
                    done();
                })
                .catch(done);
        });

        it('should delete the reading', function(done) {
            ReadingModel
                .delete(id)
                .then(function(readings) {
                    readings.forEach(function(r) {
                        expect(r._id.toString()).to.not.equal(id.toString());
                    });
                    done();
                })
                .catch(done);
        });
    });
    
    describe('#update()', function() {
        var id;
        var testReading = {
            group: mongoose.Types.ObjectId(),
            endDate: new Date(Date.now() + MILLIS_IN_WEEK),
            book: '12345'
        };

        before(function(done) {
            ReadingModel
                .create(testReading)
                .then(function(reading) {
                    id = reading._id;
                    done();
                })
                .catch(done);
        });

        it('should update the reading', function(done) {
            ReadingModel
                .update(id, { book: '67890', endDate: new Date(Date.now() + MILLIS_IN_WEEK) })
                .then(function(reading) {
                    expect(reading._id.toString()).to.equal(id.toString());
                    expect(reading.book).to.equal('67890');
                    expect(reading.endDate).to.not.equal(testReading.endDate);
                    done();
                })
                .catch(done);
        });
    });

});

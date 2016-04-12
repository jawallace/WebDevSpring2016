var mongoose = require('mongoose');
var DiscussionModel;
var chai = require('chai');
var expect = chai.expect;

describe('DiscussionModel', function() {
    'use strict';

    before(function(done) {
        DiscussionModel = require('../../../../../public/project/server/models/discussion/discussion.model.js')(mongoose);
        done();
    });

    describe('#create()', function() {
        it('should insert a discussion into the database', function(done) {
            var discussion = {
                user: mongoose.Types.ObjectId(),
                reading: mongoose.Types.ObjectId(),
                topic: 'A new discussion'
            };

            DiscussionModel
                .create(discussion)
                .then(function(discussion) {
                    expect(discussion).to.exist;
                    expect(discussion.topic).to.equal('A new discussion');
                    done();
                })
                .catch(done);
        });
    });

    describe('#findById()', function() {
        var id;
        var testDiscussion = {
            user: mongoose.Types.ObjectId(),
            reading: mongoose.Types.ObjectId(),
            topic: 'A new discussion'
        };

        before(function(done) {
            DiscussionModel
                .create(testDiscussion)
                .then(function(discussion) {
                    id = discussion._id;
                    done();
                })
                .catch(done);
        });
        
        it('should find an entry that exists', function(done) {
            DiscussionModel
                .findById(id)
                .then(function(discussion) {
                    expect(discussion).to.exist;
                    expect(discussion._id.toString()).to.equal(id.toString());
                    done();
                })
                .catch(done);
        });

        it('should not find an entry that does not exist', function(done) {
            DiscussionModel
                .findById(mongoose.Types.ObjectId())
                .then(function(discussion) {
                    expect(discussion).to.not.exist;
                    done();
                })
                .catch(done);
        });
    });

    describe('#findByUser()', function() {
        var userId = mongoose.Types.ObjectId();
        var testDiscussion = {
            user: userId,
            reading: mongoose.Types.ObjectId(),
            topic: 'A new discussion'
        };
        var testDiscussion2 = {
            user: userId,
            reading: mongoose.Types.ObjectId(),
            topic: 'A second discussion'
        };

        before(function(done) {
            DiscussionModel
                .create(testDiscussion)
                .then(function() {
                    DiscussionModel
                        .create(testDiscussion2)
                        .then(function() {
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

        it('should find all discussions for the user', function(done) {
            DiscussionModel
                .findByUser(userId)
                .then(function(discussions) {
                    expect(discussions).to.have.lengthOf(2);
                    discussions.forEach(function(d) {
                        expect(d.user.toString()).to.equal(userId.toString()); 
                        expect(d.topic).to.be.oneOf([ 'A new discussion', 'A second discussion']);
                    });
                    done();
                });
        });
    });

    describe('#findByReading()', function() {
        var readingId = mongoose.Types.ObjectId();
        var testDiscussion = {
            user: mongoose.Types.ObjectId(),
            reading: readingId,
            topic: 'A new discussion'
        };
        var testDiscussion2 = {
            user: mongoose.Types.ObjectId(),
            reading: readingId,
            topic: 'A second discussion'
        };

        before(function(done) {
            DiscussionModel
                .create(testDiscussion)
                .then(function() {
                    DiscussionModel 
                        .create(testDiscussion2)
                        .then(function() {
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

        it('should find all discussions for the reading', function(done) {
            DiscussionModel
                .findByReading(readingId)
                .then(function(discussions) {
                    expect(discussions).to.have.lengthOf(2);
                    discussions.forEach(function(d) {
                        expect(d.reading.toString()).to.equal(readingId.toString()); 
                        expect(d.topic).to.be.oneOf([ 'A new discussion', 'A second discussion']);
                    });
                    done();
                })
                .catch(done);
        });
    });
    
    describe('#delete()', function() {
        var id;
        var testDiscussion = {
            user: mongoose.Types.ObjectId(),
            reading: mongoose.Types.ObjectId(),
            topic: 'A new discussion'
        };

        before(function(done) {
            DiscussionModel
                .create(testDiscussion)
                .then(function(discussion) {
                    id = discussion._id;
                    done();
                })
                .catch(done);
        });

        it('should delete the discussion', function(done) {
            DiscussionModel
                .delete(id)
                .then(function(discussions) {
                    discussions.forEach(function(d) {
                        expect(d._id.toString()).to.not.equal(id.toString());
                    });
                    done();
                })
                .catch(done);
        });
    });
    
    describe('#update()', function() {
        var id;
        var testDiscussion = {
            user: mongoose.Types.ObjectId(),
            reading: mongoose.Types.ObjectId(),
            topic: 'A new discussion'
        };

        before(function(done) {
            DiscussionModel
                .create(testDiscussion)
                .then(function(discussion) {
                    id = discussion._id;
                    done();
                })
                .catch(done);
        });

        it('should update the discussion', function(done) {
            DiscussionModel
                .update(id, { topic: 'Some new topic' })
                .then(function(discussion) {
                    expect(discussion._id.toString()).to.equal(id.toString());
                    expect(discussion.topic).to.equal('Some new topic');
                    done();
                })
                .catch(done);
        });
    });

});

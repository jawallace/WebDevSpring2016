var mongoose = require('mongoose');
var CommentModel;
var chai = require('chai');
var expect = chai.expect;

describe('CommentModel', function() {

    before(function(done) {
        CommentModel = require('../../../../../public/project/server/models/comment/comment.model.js')(mongoose);
        done();
    });

    describe('#create()', function() {
        it('should insert a comment into the database', function(done) {
            var comment = {
                user: mongoose.Types.ObjectId(),
                discussion: mongoose.Types.ObjectId(),
                text: 'A new comment'
            };

            CommentModel
                .create(comment)
                .then(function(comment) {
                    expect(comment).to.exist;
                    expect(comment.text).to.equal('A new comment');
                    done();
                })
                .catch(done);
        });
    });

    describe('#findById()', function() {
        var id;
        var testComment = {
            user: mongoose.Types.ObjectId(),
            discussion: mongoose.Types.ObjectId(),
            text: 'A new comment'
        };

        before(function(done) {
            CommentModel
                .create(testComment)
                .then(function(comment) {
                    id = comment._id;
                    done();
                })
                .catch(done);
        });
        
        it('should find an entry that exists', function(done) {
            CommentModel
                .findById(id)
                .then(function(comment) {
                    expect(comment).to.exist;
                    expect(comment._id.toString()).to.equal(id.toString());
                    done();
                })
                .catch(done);
        });

        it('should not find an entry that does not exist', function(done) {
            CommentModel
                .findById(mongoose.Types.ObjectId())
                .then(function(comment) {
                    expect(comment).to.not.exist;
                    done();
                })
                .catch(done);
        });
    });

    describe('#findByUser()', function() {
        var userId = mongoose.Types.ObjectId();
        var testComment = {
            user: userId,
            discussion: mongoose.Types.ObjectId(),
            text: 'A new comment'
        };
        var testComment2 = {
            user: userId,
            discussion: mongoose.Types.ObjectId(),
            text: 'A second comment'
        };

        before(function(done) {
            CommentModel
                .create(testComment)
                .then(function() {
                    CommentModel
                        .create(testComment2)
                        .then(function() {
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

        it('should find all comments for the user', function(done) {
            CommentModel
                .findByUser(userId)
                .then(function(comments) {
                    expect(comments).to.have.lengthOf(2);
                    comments.forEach(function(c) {
                        expect(c.user.toString()).to.equal(userId.toString()); 
                        expect(c.text).to.be.oneOf([ 'A new comment', 'A second comment']);
                    });
                    done();
                });
        });
    });
    
    describe('#findByDiscussion()', function() {
        var discussionId = mongoose.Types.ObjectId();
        var testComment = {
            user: mongoose.Types.ObjectId(),
            discussion: discussionId,
            text: 'A new comment'
        };
        var testComment2 = {
            user: mongoose.Types.ObjectId(),
            discussion: discussionId,
            text: 'A second comment'
        };

        before(function(done) {
            CommentModel
                .create(testComment)
                .then(function() {
                    CommentModel
                        .create(testComment2)
                        .then(function() {
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

        it('should find all comments for the discussion', function(done) {
            CommentModel
                .findByDiscussion(discussionId)
                .then(function(comments) {
                    expect(comments).to.have.lengthOf(2);
                    comments.forEach(function(c) {
                        expect(c.discussion.toString()).to.equal(discussionId.toString()); 
                        expect(c.text).to.be.oneOf([ 'A new comment', 'A second comment']);
                    });
                    done();
                });
        });
    });
    
    describe('#delete()', function() {
        var id;
        var testComment = {
            user: mongoose.Types.ObjectId(),
            discussion: mongoose.Types.ObjectId(),
            text: 'A new comment'
        };

        before(function(done) {
            CommentModel
                .create(testComment)
                .then(function(comment) {
                    id = comment._id;
                    done();
                })
                .catch(done);
        });

        it('should delete the comment', function(done) {
            CommentModel
                .delete(id)
                .then(function(comments) {
                    comments.forEach(function(c) {
                        expect(c._id.toString()).to.not.equal(id.toString());
                    });
                    done();
                })
                .catch(done);
        });
    });
    
    describe('#update()', function() {
        var id;
        var testComment = {
            user: mongoose.Types.ObjectId(),
            discussion: mongoose.Types.ObjectId(),
            text: 'A new comment'
        };

        before(function(done) {
            CommentModel
                .create(testComment)
                .then(function(comment) {
                    id = comment._id;
                    done();
                })
                .catch(done);
        });

        it('should update the comment', function(done) {
            CommentModel
                .update(id, { text: 'Some new text' })
                .then(function(comment) {
                    expect(comment._id.toString()).to.equal(id.toString());
                    expect(comment.text).to.equal('Some new text');
                    done();
                })
                .catch(done);
        });
    });

});

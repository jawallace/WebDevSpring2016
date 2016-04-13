var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('modelTests', function() {
    return gulp
        .src('tests/**/*.model.spec.js', { read: false })
        .pipe(mocha({ reporter: 'progress' }));
});

gulp.task('serviceTests', function() {
    return gulp
        .src('tests/**/*.service.spec.js', { read: false })
        .pipe(mocha({ reporter: 'progress' }));
});

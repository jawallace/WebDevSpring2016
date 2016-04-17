var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var packageJSON = require('./package.json');
var jshintConfig = packageJSON.jshintConfig;

jshintConfig.lookup = false;

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

gulp.task('lint', function() {
    return gulp
        .src(['public/**/*.js', 'tests/**/*.js'])
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter('default'));
});

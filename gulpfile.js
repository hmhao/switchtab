var gulp = require('gulp'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    webpack = require('webpack'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream');

gulp.task('clean', function() {
    return gulp.src('./dist/*', { read: false })
        .pipe(clean());
});

gulp.task('webpack', function(callback) {
    webpack(require('./webpack.config'), function(error, stats) {
        if (error) {
            process.stdout.write(String(error));
            callback();
            return;
        }
        process.stdout.write(String(stats));
        callback();
    });
});

gulp.task('browserify', function() {
    var config = require('./browserify.config');
    var b = browserify(config);
    return b.bundle()
        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specifiy the
        // desired output filename here.
        .pipe(source(config.output.filename))
        // Specify the output destination
        .pipe(gulp.dest(config.output.path));
});

//压缩js文件
gulp.task('min:js', function() {
    return gulp.src(['./dist/*.js'])
        .pipe(uglify({ mangle: { except: ['jquery', '$', 'import', 'module', 'exports'] } }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    return gulp.watch(['src/**/*.js'], function(event) {
        if (event.type === 'changed') {
            gulp.run('dev');
        }
    });
});

gulp.task('server', function() {
    connect.server();
});

gulp.task('dev', ['clean', 'webpack']);
gulp.task('build', ['clean', 'webpack', 'min:js']);

var gulp = require('gulp');
var webpack = require('webpack');

var webpack      = require('webpack'),
    gulp         = require('gulp'),
    clean        = require('gulp-clean'),
    uglify       = require('gulp-uglify'),
    connect      = require('gulp-connect');

gulp.task('clean', function () {
  return gulp.src('./dist/*', {read: false})
    .pipe(clean());
});

gulp.task('webpack', function (callback) {
  webpack(require('./webpack.config'),function (error,stats) {
    if (error){
      process.stdout.write(String(error));
      callback();
      return;
    }
    process.stdout.write(String(stats));
    callback();
  });
});

//压缩js文件
gulp.task('webpack:min:js',['webpack'], function() {
  return gulp.src(['./dist/*.js'])
    .pipe(uglify({mangle:{except:['jquery','$','import','module','exports']}}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  return gulp.watch(['src/**/*.js'], function(event) {
    if (event.type === 'changed') {
      gulp.run('dev');
    }
  });
});

gulp.task('server',function(){
    connect.server();
});

gulp.task('dev',['clean','webpack']);
gulp.task('build',['clean','webpack:min:js']);

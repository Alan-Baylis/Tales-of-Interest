'use strict';

const gulp = /**@type {gulp}*/ require('gulp');
const webpack = require('webpack-stream');
const jade = require('gulp-jade');
const child_process = require('child_process');
let child;

gulp.task('default', ['server', 'client']);

gulp.task('watch', ['server-watch', 'client-watch']);

//server

gulp.task('server', () => {
  if(child) child.kill('SIGKILL');

  child = child_process.fork('./server/index.js');
});

gulp.task('server-watch', () => {
  return gulp.watch(['./server/*.js', './server/**/*.js'], ['server']);
});

//client

gulp.task('client', ['compile-js', 'compile-jade']);

gulp.task('client-watch', ['compile-js', 'compile-jade'], () => {
  gulp.watch('./client/**/*.js', ['compile-js']);
  gulp.watch('./client/**/*.jade', ['compile-jade']);
});

//js

gulp.task('compile-js', () => {
  return gulp.src('./client/js/index.js')
    .pipe(webpack({output: {filename: 'require.js'}}))
    .pipe(gulp.dest('./public'));
});

//jade

gulp.task('compile-jade', () => {
  return gulp.src(['./client/jade/*.jade', './client/jade/**/*.jade'])
    .pipe(jade())
    .pipe(gulp.dest('./public'));
});
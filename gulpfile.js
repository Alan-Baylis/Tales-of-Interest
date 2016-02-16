'use strict';

const gulp = /**@type {gulp}*/ require('gulp');
const jade = require('gulp-jade');
const browserify = require('gulp-browserify');
const child_process = require('child_process');
let child;

gulp.task('default', ['client']);

gulp.task('watch', ['server-watch', 'client-watch']);

//server

gulp.task('server', () => {
  if(child) child.kill('SIGKILL');

  child = child_process.fork('./server/index.js');
});

gulp.task('server-watch', ['server'], () => {
  return gulp.watch(['./server/*.js', './server/**/*.js'], ['server']);
});

//client

gulp.task('client', ['compile-js', 'compile-jade']);

gulp.task('client-watch', ['client'], () => {
  gulp.watch('./client/**/*.js', ['compile-js']);
  gulp.watch('./client/**/*.jade', ['compile-jade']);
});

//js

gulp.task('compile-js', () => {
  return gulp.src('./client/js/app.js')
    .pipe(browserify())
    .pipe(gulp.dest('./public'));
});

//jade

gulp.task('compile-jade', () => {
  return gulp.src(['./client/jade/**/*.jade'])
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('./public'));
});
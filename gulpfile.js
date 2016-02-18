'use strict';

const gulp = /**@type {gulp}*/ require('gulp');
const jade = require('gulp-jade');
const browserify = require('gulp-browserify');
const inject = require('gulp-inject');
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
  return gulp.watch(['./server/**/*.js'], ['server']);
});

//client

gulp.task('client', ['js', 'jade']);

gulp.task('client-watch', ['client'], () => {
  gulp.watch('./client/**/*.js', ['js']);
  gulp.watch('./client/**/*.jade', ['jade']);
});

//js

gulp.task('js', /*['legacy-js'],*/ () => {
  return gulp.src('./client/js/app.js')
    .pipe(browserify())
    .pipe(gulp.dest('./public'));
});

gulp.task('legacy-js', () => {
  const stream = gulp.src('./client/plugins/**/*.js')
    .pipe(gulp.dest('./public'));

  return gulp.src('./public/index.html')
    .pipe(inject(stream, {ignorePath: '/public'}))
    .pipe(gulp.dest('./public'));
});

//jade

gulp.task('jade', () => {
  return gulp.src(['./client/jade/**/*.jade'])
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('./public'));
});
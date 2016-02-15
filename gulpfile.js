'use strict';

const gulp = require('gulp');
const child_process = require('child_process');
let child;

gulp.task('default', ['server', 'client']);

gulp.task('watch', ['server-watch', 'client-watch']);

gulp.task('server', () => {
  if(child) child.kill();

  child = child_process.fork('./server/index.js');
});

gulp.task('server-watch', () => {
  return gulp.watch(['./server/*.js', './server/**/*.js'], ['server']);
});

gulp.task('client', () => {

});

gulp.task('client-watch');
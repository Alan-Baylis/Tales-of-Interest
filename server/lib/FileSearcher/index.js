'use strict';

const child_process = require('child_process');
const path = require('path');
const jetpack = require('fs-jetpack');
const _ = require('lodash');
const STORIES = path.join(__dirname, '../../../../stories/raw-stories');
const CPU_NUM = 1;// require('os').cpus().length;

class FileSearcher {
  constructor() {
    this.workers = [];

    _.times(CPU_NUM, () => this.workers.push(child_process.fork('./Worker')));

    this._updateWorkersStoryPaths();
  }

  _sendAllWorkersMessages(msg) {
    this.workers.forEach(slave => slave.send(msg));
  }

  _updateWorkersStoryPaths() {
    const dirs = jetpack.list(STORIES).map(storyPath => path.join(STORIES, storyPath));
    const splitDirs = _.chunk(dirs, Math.ceil(dirs.length / CPU_NUM));

    splitDirs.forEach((splitDir, i) => this.workers[i].send({paths: splitDir}));
  }
}

module.exports = FileSearcher;
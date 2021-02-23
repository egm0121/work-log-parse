const { PassThrough } = require('stream');
const utils = require('./utils');
const chalk = require('chalk');

class LogExtractor extends PassThrough {
  constructor(opts) {
    super(Object.assign({},opts,{objectMode:true}));
    this.data = {};
    this.pidOrderList = [];
    this.displayLabel = opts.label;
    if (typeof opts.matcher === 'function') {
      this.matcherFn = opts.matcher;
    }
    if (typeof opts.extractor === 'function') {
      this.extractorFn = opts.extractor;
    }
    if (typeof opts.reducer === 'function') {
      this.reducerFn = opts.reducer;
    }    
  }
  reducerFn(allRecords) {
    return allRecords;
  }
  matcherFn(){
    console.error('implement a matcher function or pass one via options');
  }
  extractorFn(){
    console.error('implement a extractor function or pass one via options');
  }
  _transform(logLine, encoding, cb) {
    try {
      if (this.matcherFn(logLine)) {
        if(!this.data[logLine.pid]) {
          this.data[logLine.pid] = [];
          this.pidOrderList.push(logLine.pid);
        }
        this.data[logLine.pid].push({time:logLine.time,...this.extractorFn(logLine)});
      }
    } catch (err) {
      console.error('error on stream', err, logLine);
    }
    super._transform(logLine, encoding, cb);
  }
  _flush(cb){
    this.data = this.reducerFn(this.data);
    cb();
  }
  getSummaryData() {
    return this.data;
  }
  printReport() {
    if(Object.keys(this.getSummaryData()).length) {
      console.log(chalk.bold.white.bgBlue(utils.padCentered(this.displayLabel)));
      utils.printKeysAsTables(this.getSummaryData(), chalk.white.bgBlue('PID'), this.pidOrderList);
    } else {
      console.log(chalk.white.bgGray(this.displayLabel.padEnd(100,' ')));
    }
  }
};
module.exports = LogExtractor;
const { PassThrough } = require('stream');
const utils = require('../utils');

class ErrorExtractor extends PassThrough {
  constructor(opts) {
    super(Object.assign({},opts,{objectMode:true}));
    this.data = {};
    this.pidOrderList = [];
    this.displayLabel = opts.label;
    this.matcherFn = opts.matcher;
    this.extractorFn = opts.extractor;
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
      console.log('error on stream', err, logLine);
    }
    super._transform(logLine, encoding, cb);
  }
  getSummaryData() {
    return this.data;
  }
  printReport() {
    console.log(this.displayLabel);
    utils.printKeysAsTables(this.getSummaryData(), 'PID', this.pidOrderList);
  }
};
module.exports = ErrorExtractor;
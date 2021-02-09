const LogExtractor = require('./logExtractor');
class OSAndAppInfoExtractor extends LogExtractor {
  constructor() {
    super({
      matcher: (logLine) => {
        if(logLine.FILE === './el/main' && logLine.msg === 'process.argv') {
          if(this.uniqArgs.has(logLine.arguments[0])) return false;
          this.uniqArgs.add(logLine.arguments[0]);
          return true;
        }
        return false;
      },
      extractor: (logLine) => ({hostname: logLine.hostname, execLocation: logLine.arguments[0]}),
      label: 'APP INFO' 
    });
    this.uniqArgs = new Set();
  }
};
module.exports = OSAndAppInfoExtractor;

const LogExtractor = require('../helpers/logExtractor');
class ErrorExtractor extends LogExtractor {
  constructor() {
    super({
      matcher: (logLine) => logLine.level >= 50,
      extractor: (logLine) => ({ FILE: logLine.FILE || logLine.PREFIX, msg: logLine.msg, err: logLine.err.message.slice(0,100) }),
      label: 'ERRORS' 
    });
  }
};
module.exports = ErrorExtractor;
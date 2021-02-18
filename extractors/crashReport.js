const QueryLogExtractor = require('../helpers/queryLogExtractor');
class CrashReporterExtractor extends QueryLogExtractor {
  
  constructor() {
    super({
      query: { 
        FILE: 'el/services/crashReporter', 
        $or : [
          { msg: 'sendToBacktrace' },
          { msg: 'checkForLastCrashReport'}
        ] 
      },
      extractor: (logLine) => ({ 
        btCrashID: logLine.btCrashID,
        type: logLine.msg
      }),
      label: 'CRASH REPORTER' 
    });
  }
};
module.exports = CrashReporterExtractor;
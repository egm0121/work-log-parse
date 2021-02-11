const LogExtractor = require('../helpers/logExtractor');
class ConnectedCallsExtractor extends LogExtractor {
  constructor() {
    super({
      matcher: (logLine) => logLine.numberOfCalls >= 0,
      extractor: (logLine) => ({ numberOfCalls: logLine.numberOfCalls}),
      label: 'NBR OF CONNECTED CALLS' 
    });
  }
};
module.exports = ConnectedCallsExtractor;
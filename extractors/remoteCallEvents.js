const QueryLogExtractor = require('../helpers/queryLogExtractor');
class CallEventsExtractor extends QueryLogExtractor {
  static WHITELIST = {
    'call-incoming': true,
    'call-outoging': true,
    'call-connect': true,
    'call-disconnected': true,
    'call-transfer': true,
    'call-hold': true
  };
  constructor() {
    super({
      matcher: (logLine) => logLine.FILE === 'ui/services/callManager/RemoteCallEventHandler' && 
        logLine.eventArgsArray &&
        CallEventsExtractor.WHITELIST[logLine.eventType] === true,
      extractor: (logLine) => ({ 
        eventType: logLine.eventType, 
        callId: this.extractCallID(logLine)
      }),
      label: 'REMOTE CALL EVENTS' 
    });
  }
  extractCallID(logLine){
    if(
      Array.isArray(logLine.eventArgsArray) 
      && typeof logLine.eventArgsArray[0] === 'object'
    ){
      return logLine.eventArgsArray[0].callID
    }
  }
};
module.exports = CallEventsExtractor;
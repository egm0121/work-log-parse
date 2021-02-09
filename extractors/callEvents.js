const LogExtractor = require('./logExtractor');
class CallEventsExtractor extends LogExtractor {
  static WHITELIST = {
    'call-incoming': true,
    'call-outoging': true,
    'call-connect': true,
    'call-disconnected': true,
    'call-transfer': true,
    'call-hold': true,
    'transfer-status': true,
    'answer-call':true,
    'device-conflict':true,
    'call-failed': true,
    'call-moved-to-jitsi-meeting': true,
    'enable-mute':true,
    'disable-mute':true,
    'call-record-start':true,
    'call-record-end':true,
    'resume-hold': true,
    'reset-call-state': true,
    'call-conference-start': true,
    'call-conference-drop':true,
    'call-xfer-to-jm': true,
  };

  constructor() {
    super({
      matcher: (logLine) =>  {
        if(
          logLine.FILE === 'ui/services/callManager/CallEventHandler' && 
          logLine.eventArgsArray && CallEventsExtractor.WHITELIST[logLine.eventType] === true
        ){
          return true;
        }
        if(
          logLine.FILE === 'el/services/callManagerProxy' && 
          logLine.msg === 'proxy event from CallManager' &&
          !CallEventsExtractor.WHITELIST[logLine.payload.eventName]
        ){
          return true;
        }
      },
      extractor: (logLine) => ({
        eventType: logLine.eventType || (logLine.payload && logLine.payload.eventName), 
        callId: this.extractCallID(logLine)
      }),
      label: 'CALL EVENTS' 
    });
  }
  extractCallID(logLine){
    if(
      Array.isArray(logLine.eventArgsArray) 
      && typeof logLine.eventArgsArray[0] === 'object'
    ){
      return logLine.eventArgsArray[0].callID
    }
       
    if(
      logLine.payload && 
      Array.isArray(logLine.payload.eventArgs)
    ){
      const eventArg = logLine.payload.eventArgs[0];
      return (typeof eventArg === 'object') ? eventArg.callID : undefined;
    }
  }
};
module.exports = CallEventsExtractor;
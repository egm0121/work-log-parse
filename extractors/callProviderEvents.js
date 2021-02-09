const LogExtractor = require('./logExtractor');
class CallProviderEventsExtractor extends LogExtractor {
  static WHITELIST = {
    'PROVIDER_INIT_SUCCESS': true,
    'PROVIDER_INIT_ERROR': true,
    'PROVIDER_READY': true,
    'PROVIDER_CALL_FLIP_SUPPORT': true,
    'setActiveCallProvider ': true,
  };
  constructor() {
    super({
      matcher: (logLine) => 
        logLine.FILE === 'ui/services/callManager/CallManager' &&
         logLine.providerName && 
         CallProviderEventsExtractor.WHITELIST[logLine.msg] === true,
      extractor: (logLine) => ({ 
        providerEventName: logLine.msg, 
        providerName: logLine.providerName
      }),
      label: 'CALL PROVIDER EVENTS' 
    });
  }
};
module.exports = CallProviderEventsExtractor;
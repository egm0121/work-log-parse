const LogExtractor = require('../helpers/logExtractor');
class ServiceNotificationsExtractor extends LogExtractor {
  
  constructor() {
    super({
      matcher: (logLine) => 
        logLine.msg === 'handleServiceNotifications' && 
        logLine.data,
      extractor: (logLine) => ({ 
        type: logLine.data.type,
        value: logLine.data.value 
      }),
      label: 'SERVICE NOTIFICATIONS' 
    });
  }
};
module.exports = ServiceNotificationsExtractor;
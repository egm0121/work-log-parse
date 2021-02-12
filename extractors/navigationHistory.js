
const QueryLogExtractor = require('../helpers/queryLogExtractor');
class AudioDevicesExtractor extends QueryLogExtractor {
  
  constructor() {
    super({
      query: { 
        FILE: 'ui/services/history', 
        location: {
          $exist: true
        }
      },
      extractor: (logLine) => ({ 
       path: logLine.location.pathname
      }),
      label: 'NAVIGATION HISTORY' 
    });
  }
};
module.exports = AudioDevicesExtractor;
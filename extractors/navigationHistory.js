
const QueryLogExtractor = require('../helpers/queryLogExtractor');
class NavigationHistoryExtractor extends QueryLogExtractor {
  
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
module.exports = NavigationHistoryExtractor;
const QueryLogExtractor = require('../helpers/queryLogExtractor');
class SleepResumeExtractor extends QueryLogExtractor {
  
  constructor() {
    super({
      query: { 
        FILE: 'el/services/maintenance', 
        msg: { 
          $in : [
            'System going to sleep.', 
            'System resumes operation from sleep.'
          ]
        }
      },
      extractor: (logLine) => ({ 
       msg: logLine.msg
      }),
      label: 'SYSTEM SLEEP / RESUME EVENTS' 
    });
  }
};
module.exports = SleepResumeExtractor;
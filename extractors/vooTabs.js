
const LogExtractor = require('../helpers/logExtractor');
class VOOTabsExtractor extends LogExtractor {
  
  constructor() {
    super({
      matcher: (logLine) => {
        if( logLine.RTC_TAB_ID && !this.uniqMap.has(logLine.RTC_TAB_ID)) {
          this.uniqMap.add(logLine.RTC_TAB_ID);
          return true;
        }
      },
      extractor: (logLine) => ({ 
       deviceName: logLine.RTC_TAB_ID
      }),
      label: 'WorkW Tabs by RTC_TAB_ID' 
    });
    this.uniqMap = new Set;
  }
};
module.exports = VOOTabsExtractor;
const LogExtractor = require('../helpers/logExtractor');
class AutoUpdatesExtractor extends LogExtractor {
  static WHITELIST = {
    'checking-for-update': true,
    'update-available': true,
    'update-not-available': true,
    'update downloaded and ready to install': true,
    'checkForUpdates - externally triggered updates check': true,
    'autoUpdater error': true,
    'User invoked early update install': true,
  };
  constructor() {
    super({
      matcher: (logLine) => {
        if(logLine.day) return true;
        if(logLine.toRepair) return true;
        if(AutoUpdatesExtractor.WHITELIST[logLine.msg] === true) return true;
        if(this.uniqMap.has(logLine.runtimeAppVersion)) return false;
        this.uniqMap.add(logLine.runtimeAppVersion);
        return true;
      },
      extractor: (logLine) => ({
        runtimeAppVersion: logLine.runtimeAppVersion, 
        cachedAppVersion: logLine.cachedAppVersion,
        day: logLine.day,
        msg: logLine.msg,
      }),
      label: 'AUTO UPDATE EVENTS & ERRORS' 
    });
    this.uniqMap = new Set();
  }
};
module.exports = AutoUpdatesExtractor;
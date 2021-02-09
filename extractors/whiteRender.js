
const LogExtractor = require('./logExtractor');
class WhiteRenderExtractor extends LogExtractor {
  
  constructor() {
    super({
      matcher: (logLine) => 
        logLine.LOG_PREFIX === 'el/services/whiteScreenDetection' && 
        logLine.isWhite,
      extractor: (logLine) => ({ 
        targetWinId: logLine.targetWinId, 
        isWhite: logLine.isWhite
      }),
      label: 'WHITE WINDOW RENDERED' 
    });
  }
};
module.exports = WhiteRenderExtractor;
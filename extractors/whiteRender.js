
const QueryLogExtractor = require('../helpers/queryLogExtractor');
const FILE = 'el/services/whiteScreenDetection';
class WhiteRenderExtractor extends QueryLogExtractor {
  
  constructor() {
    super({
      query: { FILE: 'el/services/whiteScreenDetection', isWhite: { $exist: true} },
      extractor: (logLine) => ({ 
        targetWinId: logLine.targetWinId, 
        isWhite: logLine.isWhite
      }),
      label: 'WHITE WINDOW RENDERED' 
    });
  }
};
module.exports = WhiteRenderExtractor;
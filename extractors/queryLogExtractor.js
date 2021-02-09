const LogExtractor = require('./logExtractor');
class QueryLogExtractor extends LogExtractor {
  static EQ_MATCH_TYPES = {
    'string': 1,
    'number': 1,
    'boolean': 1,
  };
  static SPECIAL_MATCHER = {
    OR: '$or',
    IN: '$in',
    AND: '$and',
  };
  constructor({query, label} = {}) {
    super({
      matcher: (logLine) => this.queryMatcher(this.queryObj,logLine),
      extractor: (logLine) => ({ FILE: logLine.LOG_PREFIX || logLine.PREFIX, all: JSON.stringify(logLine) }),
      label: label || 'CUSTOM EXTRACTOR' 
    });
    this.queryObj = query;
  }
  queryMatcher(matcher, log){
    let isMatch = true;
    if(typeof matcher === 'object' && Object.keys(matcher).length === 0) return true;
    const hasORMatcher = Object.keys(matcher).includes(QueryLogExtractor.SPECIAL_MATCHER.OR);
    if(typeof matcher === 'object') {
      for(let propName in matcher){
        const propVal = matcher[propName];
        if( propName.indexOf('$') !== 0 && ((typeof propVal) in QueryLogExtractor.EQ_MATCH_TYPES)) {
          isMatch = isMatch && log[propName] === propVal;
        }
        if(propName === QueryLogExtractor.SPECIAL_MATCHER.AND && (typeof propVal === 'object')){
          isMatch = isMatch && this.queryMatcher(propVal, log);
        }
        if(propName === QueryLogExtractor.SPECIAL_MATCHER.IN && (typeof propVal === 'object')){
          for(let inPropName in propVal){
            isMatch = isMatch && propVal[inPropName].includes(log[inPropName]);
          }
        }
        if(!hasORMatcher && !isMatch) {
          break;
        }
        if(propName === QueryLogExtractor.SPECIAL_MATCHER.OR && (typeof propVal === 'object')){
          isMatch = isMatch || this.queryMatcher(propVal, log);
        }
      }
    }
    return isMatch;
  }
};
module.exports = QueryLogExtractor;
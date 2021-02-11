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
    EXIST: '$exist'
  };
  constructor({query, label, extractor, reducer} = {}) {
    super({
      matcher: (logLine) => this.queryMatcher(this.queryObj,logLine),
      extractor: extractor || this.defaultLogExtractor,
      reducer: reducer,
      label: label || 'CUSTOM EXTRACTOR' 
    });
    this.queryObj = query;
  }
  defaultLogExtractor(logLine) {
    return { FILE: logLine.LOG_PREFIX || logLine.PREFIX, all: JSON.stringify(logLine) };
  }
  queryMatcher(matcher, log){
    let isMatch = true;
    if(typeof matcher === 'object' && Object.keys(matcher).length === 0) return true;
    
    if(typeof matcher === 'object') {
      for(let propName in matcher){
        const propVal = matcher[propName];
        if( propName.indexOf('$') !== 0 && ((typeof propVal) in QueryLogExtractor.EQ_MATCH_TYPES)) {
          isMatch = isMatch && log[propName] === propVal;
        }
        if(propName.indexOf('$') !== 0 && (typeof propVal === 'object') && (QueryLogExtractor.SPECIAL_MATCHER.IN in propVal)){
          isMatch = isMatch && propVal[QueryLogExtractor.SPECIAL_MATCHER.IN].includes(log[propName]);
        }
        if(propName.indexOf('$') !== 0 && (typeof propVal === 'object') && (QueryLogExtractor.SPECIAL_MATCHER.EXIST in propVal) ){
          isMatch = isMatch && ( (propName in log) === propVal[QueryLogExtractor.SPECIAL_MATCHER.EXIST]);
        }
        if(propName === QueryLogExtractor.SPECIAL_MATCHER.OR && Array.isArray(propVal)){
          const childMatchers = propVal;
          let orMatch = false;
          for( let i = 0; i < childMatchers.length; i++) {
            orMatch = orMatch || this.queryMatcher(childMatchers[i], log);
          }
          isMatch = isMatch && orMatch;
        }
      }
    }
    return isMatch;
  }
};
module.exports = QueryLogExtractor;
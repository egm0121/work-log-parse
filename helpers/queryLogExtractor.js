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
  constructor({query, label, matcher, extractor, reducer} = {}) {
    super({
      matcher: query ? null : matcher,
      extractor: extractor,
      reducer: reducer,
      label: label || 'CUSTOM EXTRACTOR' 
    });
    this.queryObj = query;
  }
  matcherFn(logLine) {
    return this.queryMatcher(this.queryObj, logLine);
  }
  extractorFn(logLine) {
    return { FILE: logLine.LOG_PREFIX || logLine.PREFIX, all: JSON.stringify(logLine) };
  }
  queryMatcher(matcher, log) {
    let isMatch = true;
    if(typeof matcher === 'object' && Object.keys(matcher).length === 0) return true;
    if(typeof matcher === 'object') {
      for(let propName in matcher){
        const propVal = matcher[propName];
        const isRegularKey = propName.indexOf('$') !== 0;
        if(propName === 'FILE') {
          isMatch = isMatch && (log.FILE === propVal || log.LOG_PREFIX === propVal || log.PREFIX === propVal);
          continue;
        }
        if(isRegularKey && ((typeof propVal) in QueryLogExtractor.EQ_MATCH_TYPES)) {
          isMatch = isMatch && log[propName] === propVal;
          continue;
        }
        if(isRegularKey && (typeof propVal === 'object') && (QueryLogExtractor.SPECIAL_MATCHER.IN in propVal)){
          isMatch = isMatch && propVal[QueryLogExtractor.SPECIAL_MATCHER.IN].includes(log[propName]);
          continue;
        }
        if(isRegularKey && (typeof propVal === 'object') && (QueryLogExtractor.SPECIAL_MATCHER.EXIST in propVal) ){
          isMatch = isMatch && ( (propName in log) === propVal[QueryLogExtractor.SPECIAL_MATCHER.EXIST]);
          continue;
        }
        if(propName === QueryLogExtractor.SPECIAL_MATCHER.OR && Array.isArray(propVal)){
          const childMatchers = propVal;
          let orMatch = false;
          for( let i = 0; i < childMatchers.length; i++) {
            orMatch = orMatch || this.queryMatcher(childMatchers[i], log);
          }
          isMatch = isMatch && orMatch;
          continue;
        }
      }
    }
    return isMatch;
  }
};
module.exports = QueryLogExtractor;
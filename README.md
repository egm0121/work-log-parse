# Log Extractor CLI


## default CLI usage

To generate a report using all the currently available log extractors,
simply pipe one or multiple logfiles into the cli utility using `npx` so there is no need to install it or update it.

```
cat mylogfile/vod.log | npx https://github.com/egm0121/work-log-parse.git
```
This method will ensure to always use the latest version of the tool from the repo.

## install work-log-analyze globally
To run the tool offline the npm package can be globally installed 

```
npm i -g https://github.com/egm0121/work-log-parse.git
```
this will setup a new command `work-log-analyze` that can be invoked, eg:

```
cat mylogfile/vod.log | work-log-analyze
```

## CLI usage with custom matching query

You can extract custom logs that are matching the query by specifing once ore more the `--extract` option.
```
cat mylogfile/vod.log | npx https://github.com/egm0121/work-log-parse.git --extract='{"numberOfCalls":{"$exist":true}}'
```
```
--extract='{"$or":[{"isWhite":{"$exist":true}},{"numberOfCalls":1}]}'
```
The query syntax is inspired by mongodb: https://docs.mongodb.com/manual/tutorial/query-documents/.

so far only the following operator are supported:

* $or
* $in
* $exist

by default multiple key-value pairs in the query object are connected by AND clause.

## Writing custom extractors

To quickly create an extractor that uses a query in the same format as the `--extract` option 
you can extend the `QueryLogExtractor` class and pass a query: 

```
const QueryLogExtractor = require('./queryLogExtractor');
class MyCustomExtractor extends QueryLogExtractor {
  
  constructor() {
    super({
      query: { 
        FILE: 'ui/services/myService', 
        eventType: { 
          $in : [
            'TYPE_A', 
            'TYPE_B', 
            'TYPE_C' 
          ]
        }
      },
      label: 'MY SERVICE LOG EXTACTOR' 
    });
  }
  extractorFn(logLine) {
    return { 
       deviceName: logLine.deviceId,
       type: logLine.msg
      }
  }
};
module.exports = MyCustomExtractor;
```

## Overridable QueryLogExtractor methods
you can override the methods `extractorFn`, `reducerFn` and `matcherFn` to customize how to match logs, which fields to extract and eventually how to transform / aggregate the output.

 * `extractorFn` gets called for every log entry and needs to return an object that represents the fields that we want to visualize in the results table. every key returned will be a column of the report table.
 * `matcherFn` gets called for every log entry if no `query` has been provided in the constructor. return true when a log matches the required criteria
 * `reducerFn` gets called once at the end of the stream processing with all the extracted data grouped by `pid` field, this gives a chance to aggregate or transform the data that ends up being shown in the report.
 
 ## Register Custom Extractor

 to use the new custom extractor, dont forget to add to the extractors pipeline inside `cli.js`.

 ```
 let extractors = [
  new LoginDataExtractor(),
  new OsAndAppInfoExtractor(),
  new ErrorExtractor(),
  new MyCustomExtractor() <--- //add the extractor
  ...
 ``` 
#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const OsAndAppInfoExtractor = require('./extractors/osAndAppInfo');
const ErrorExtractor = require('./extractors/errors');
const AutoUpdatesExtractor = require('./extractors/autoUpdates');
const CallEventsExtractor = require('./extractors/callEvents');
const RemoteCallEventsExtractor = require('./extractors/remoteCallEvents');
const CallProviderEventsExtractor = require('./extractors/callProviderEvents');
const NumberConnectedCallsExtractor = require('./extractors/connectedCalls');
const AudioDevicesExtractor = require('./extractors/audioDevices');
const VOOTabsExtractor = require('./extractors/vooTabs');
const QueryLogExtractor = require('./extractors/queryLogExtractor');

const ByLineTransform = require('./byLineTransform');
const ToJsonStream = require('./toJsonStream');

const utils = require('./utils');
const WhiteRenderExtractor = require('./extractors/whiteRender');
const ServiceNotificationsExtractor = require('./extractors/serviceNotifications');
const testQuery = {query: { level: 50, $or: { isVisible: true , portalPrefix: 'oncall_aot_portal' } } };
const testQueryTwo = {query: { $in: { eventName: ['call-connect','call-incoming']}, $or : { level: 40, pid: 756 } } };

let userExtractors = [];
const extractors = [
  new OsAndAppInfoExtractor(),
  new ErrorExtractor(),
  new AutoUpdatesExtractor(),
  new CallEventsExtractor(),
  new RemoteCallEventsExtractor(),
  new CallProviderEventsExtractor(),
  new NumberConnectedCallsExtractor(),
  new WhiteRenderExtractor(),
  new AudioDevicesExtractor(),
  new VOOTabsExtractor(),
  new ServiceNotificationsExtractor(),
];

if(argv.extract){
  if(typeof argv.extract === 'string'){
    userExtractors.push(argv.extract)
  } 
  if(Array.isArray(argv.extract)) {
    userExtractors = userExtractors.concat(argv.extract)
  }
}
userExtractors.forEach((userQuery, key) => {
  const parsedQuery = JSON.parse(userQuery);
  console.log('CUSTOM EXTRACTOR', userQuery);
  extractors.push(new QueryLogExtractor({ query: parsedQuery, label: 'CUSTOM EXTRACTOR '+ (key+1) }));
})

const jsonStream = process.stdin
.pipe(new ByLineTransform({decodeStrings: false}))
.pipe(new ToJsonStream());

utils.pipeAll(jsonStream, extractors).on('error', () => {
  console.error('stream error', err);
})
.on('end', () => {
  console.log('Log Analysis');
  extractors.forEach(extractor => extractor.printReport());
}).resume();

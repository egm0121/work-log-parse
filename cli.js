#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const ByLineTransform = require('./helpers/byLineTransform');
const ToJsonStream = require('./helpers/toJsonStream');

const OsAndAppInfoExtractor = require('./extractors/osAndAppInfo');
const ErrorExtractor = require('./extractors/errors');
const AutoUpdatesExtractor = require('./extractors/autoUpdates');
const CallEventsExtractor = require('./extractors/callEvents');
const RemoteCallEventsExtractor = require('./extractors/remoteCallEvents');
const CallProviderEventsExtractor = require('./extractors/callProviderEvents');
const NumberConnectedCallsExtractor = require('./extractors/connectedCalls');
const AudioDevicesExtractor = require('./extractors/audioDevices');
const VOOTabsExtractor = require('./extractors/vooTabs');
const QueryLogExtractor = require('./helpers/queryLogExtractor');
const LoginDataExtractor = require('./extractors/loginData');

const WhiteRenderExtractor = require('./extractors/whiteRender');
const ServiceNotificationsExtractor = require('./extractors/serviceNotifications');

const utils = require('./helpers/utils');

let userExtractors = [];
let extractors = [
  new LoginDataExtractor(),
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
if (userExtractors.length) {
  extractors = userExtractors.map((userQuery, key) => {
    const parsedQuery = JSON.parse(userQuery);
    console.log('CUSTOM EXTRACTOR', userQuery);
    return new QueryLogExtractor({ query: parsedQuery, label: 'CUSTOM EXTRACTOR '+ (key+1) });
  });
}


const jsonStream = process.stdin
.pipe(new ByLineTransform({decodeStrings: false}))
.pipe(new ToJsonStream());

utils.pipeAll(jsonStream, extractors).on('error', () => {
  console.error('stream error', err);
})
.on('end', () => {
  console.log(chalk.bold.blue.bgWhite(utils.padCentered(`LOG ANALYSIS`)));
  console.log(chalk.bold.white.bgBlue(utils.padCentered(``)));
  extractors.forEach(extractor => extractor.printReport());
}).resume();

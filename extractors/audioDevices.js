
const LogExtractor = require('./logExtractor');
class AudioDevicesExtractor extends LogExtractor {
  
  constructor() {
    super({
      matcher: (logLine) => 
        logLine.FILE === 'ui/services/audioDeviceManager/AudioDeviceManager' && 
        logLine.msg === 'output device change' ||
        logLine.msg === 'input device change' ||
        logLine.msg === '2nd ringtone device change',
      extractor: (logLine) => ({ 
       deviceName: logLine.deviceId,
       type: logLine.msg
      }),
      label: 'AUDIO DEVICES EXTRACTOR' 
    });
  }
};
module.exports = AudioDevicesExtractor;
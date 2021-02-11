
const QueryLogExtractor = require('../helpers/queryLogExtractor');
class AudioDevicesExtractor extends QueryLogExtractor {
  
  constructor() {
    super({
      query: { 
        FILE: 'ui/services/audioDeviceManager/AudioDeviceManager', 
        msg: { 
          $in : [
            'output device change', 
            'input device change', 
            '2nd ringtone device change' 
          ]
        }
      },
      extractor: (logLine) => ({ 
       deviceName: logLine.deviceId,
       type: logLine.msg
      }),
      label: 'AVAILABLE AUDIO DEVICES CHANGED' 
    });
  }
};
module.exports = AudioDevicesExtractor;
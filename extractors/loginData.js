const QueryLogExtractor = require('./queryLogExtractor');
class LoginDataExtractor extends QueryLogExtractor {
  
  constructor() {
    super({
      query: { LOG_PREFIX: 'el/services/logUserData', loginData: { $exist: true }},
      extractor: (logLine) => {
        const fieldsObj = {
          smpUser: logLine.loginData.smpUser,
          lastName: logLine.loginData.lastName,
          firstName: logLine.loginData.firstName,
          customerId: logLine.loginData.customerId,
          email: logLine.loginData.email,
          userId: logLine.loginData.userId,
          updateChannel: logLine.loginData.updateChannel
        }
        try {
          fieldsObj.pbxName = logLine.loginData.selectedExtension.pbxName;
          fieldsObj.uiFeatureFlags = logLine.loginData.uiFeatureFlags;
          fieldsObj.classOfServiceConfig= logLine.loginData.classOfServiceConfig;
        } catch (err) {

        }
        return fieldsObj;
      },
      reducer: (allLogData) => {
        // explode a single key-value object into array of key value tuple 
        const firstPid = Object.keys(allLogData)[0];
        const firstLog = allLogData[firstPid][0]
        let retObj = {};
        retObj[firstPid] = Object.keys(firstLog).reduce((acc,propKey) => {
          if (typeof firstLog[propKey] !== 'object') {
            acc.push({key:propKey, value: firstLog[propKey]});
          } else {
            Object.keys(firstLog[propKey]).forEach(key => {
              acc.push({ key: [propKey, key].join('.') , value: firstLog[propKey][key]})
            })
          }
          return acc;
        }, []);
        return retObj;
      },
      label: 'LOGIN DATA' 
    });
  }
};
module.exports = LoginDataExtractor;
const QueryLogExtractor = require('../helpers/queryLogExtractor');
class LoginDataExtractor extends QueryLogExtractor {
  
  constructor() {
    super({
      query: { LOG_PREFIX: 'el/services/logUserData', loginData: { $exist: true }},
      extractor: (logLine) => {
        const loginInfo = logLine.loginData;
        const fieldsObj = {
          smpUser: loginInfo.smpUser,
          lastName: loginInfo.lastName,
          firstName: loginInfo.firstName,
          email: loginInfo.email,
          userId: loginInfo.userId,
          updateChannel: loginInfo.updateChannel,
        }
        try {
          fieldsObj.customerId = loginInfo.selectedExtension.customerId,
          fieldsObj.pbxName = loginInfo.selectedExtension.pbxName;
          fieldsObj.extension = loginInfo.selectedExtension.number;
          fieldsObj.uiFeatureFlags = loginInfo.uiFeatureFlags;
          fieldsObj.classOfServiceConfig= loginInfo.classOfServiceConfig;
        } catch (err) {

        }
        return fieldsObj;
      },
      reducer: (allLogData) => {
        // explode a single key-value object into array of key value tuple 
        const firstPid = Object.keys(allLogData)[0];
        const firstLog = allLogData[firstPid][0];
        return {
          [firstPid] : this.explodeObjectToRows(firstLog)
        };
      },
      label: 'LOGIN DATA' 
    });
  }
  explodeObjectToRows(obj) {
    return Object.keys(obj).reduce((acc,propKey) => {
      if (typeof obj[propKey] !== 'object') {
        acc.push({ key:propKey, value: obj[propKey]});
      } else {
        Object.keys(obj[propKey]).forEach(key => {
          acc.push({ key: [propKey, key].join('.') , value: obj[propKey][key]})
        })
      }
      return acc;
    }, []);
  }
};
module.exports = LoginDataExtractor;
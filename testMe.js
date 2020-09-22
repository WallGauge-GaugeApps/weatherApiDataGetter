const WAPI = require('./weatherApiDataGetter');
const actObj = require('./actObj.json');

const wApi = new WAPI(actObj.apiKey, actObj.zipcode, true);
console.log('Requesting forecast for zipcode = ' + actObj.zipcode);
wApi.getForecast()
    .then((rslt) => {
        console.log('Forecast received now getting current conditions');
        return wApi.getCurrent()
    })
    .catch((err) => {
        console.error('Error getting forecast from weatherApiDataGetter', err);

    });
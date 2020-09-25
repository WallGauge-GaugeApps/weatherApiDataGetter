const WAPI = require('./weatherApiDataGetter');
const actObj = require('./actObj.json');

const wApi = new WAPI(actObj.apiKey, actObj.zipcode, false);
console.log('Requesting forecast for zipcode = ' + actObj.zipcode);
wApi.getForecast()
    .then((rslt) => {
        console.log('Parsed weather data follows:');
        console.dir(wApi.data, {depth:null})
        console.log('Getting Precip for last 7 days...');
        return wApi.getPrecipTotal(7);
    })
    .then((rslt)=>{
        console.log('There was a total of ' + rslt + '" of precipitation over the last 7 days');
    })
    .catch((err) => {
        console.error('Error getting forecast from weatherApiDataGetter', err);

    });

setInterval(()=>{
    wApi.getForecast()
    .then((rslt) => {
        console.dir(wApi.data, {depth:null})
    })
    .catch((err) => {
        console.error('Error getting forecast from weatherApiDataGetter', err);

    });
},60000 * 15)
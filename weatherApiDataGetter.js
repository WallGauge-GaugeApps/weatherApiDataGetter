const EventEmitter = require('events');
const fetch = require('node-fetch');

const logPrefix = 'weatherApiDataGetter.js | ';
const baseApiURL = 'https://api.weatherapi.com/v1';
const weatherDataObj = {
    obsDate: undefined,
    current:{
        temp:undefined,
        feelsLike:undefined,
        wind:undefined,
        windGust:undefined,
        windDegree:undefined,
        pressure:undefined,
        precip:undefined,
        humidity:undefined
    },
    forecast:{
        maxTemp:undefined,
        minTemp:undefined,
        maxWind:undefined,
        totalPrecip:undefined,
        rainChance:undefined,
        snowChance:undefined
    }
}

class weatherApiDataGetter extends EventEmitter {

    constructor(apiKey = '', zipcode = '62052', verboseLogging = true) {
        super();
        this.apiKey = apiKey;
        this.zipcode = zipcode;
        this.verbose = verboseLogging;
        this.data = weatherDataObj;
    };

    getForecast() {
        return new Promise((resolve, reject) => {
            let callObj = {
                method: 'GET',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            let uri = baseApiURL + '/forecast.json?key=' + this.apiKey + '&q=' + this.zipcode
            fetch(uri, callObj)
                .then(res => res.json())
                .then(jsonData => {
                    if (this.verbose) {
                        logit('Weather Forecast follows:');
                        console.dir(jsonData, { depth: null });
                    }
                    try{
                    this.data.obsDate = jsonData.current.last_updated;
                    this.data.current.temp = jsonData.current.temp_f;
                    this.data.current.feelsLike = jsonData.current.feelslike_f;
                    this.data.current.wind = jsonData.current.wind_mph;
                    this.data.current.windDegree = jsonData.current.wind_degree;
                    this.data.current.windGust = jsonData.current.gust_mph;
                    this.data.current.pressure = jsonData.current.pressure_in;
                    this.data.current.precip = jsonData.current.precip_in;
                    this.data.current.humidity = jsonData.current.humidity;

                    this.data.forecast.maxTemp = jsonData.forecast.forecastday[0].day.maxtemp_f;
                    this.data.forecast.minTemp = jsonData.forecast.forecastday[0].day.mintemp_f;
                    this.data.forecast.maxWind = jsonData.forecast.forecastday[0].day.maxwind_mph;
                    this.data.forecast.totalPrecip = jsonData.forecast.forecastday[0].day.totalprecip_in;
                    this.data.forecast.rainChance = jsonData.forecast.forecastday[0].day.daily_chance_of_rain;
                    this.data.forecast.snowChance = jsonData.forecast.forecastday[0].day.daily_chance_of_snow;
                    resolve(jsonData);
                    } catch (err) {
                        logit('error parasing weather data:' + err);
                        reject(err);
                    }
                })
                .catch(err => {
                    console.error('Error calling ' + uri, err);
                    reject(err);
                })
        });
    };

    getCurrent() {
        return new Promise((resolve, reject) => {
            let callObj = {
                method: 'GET',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            let uri = baseApiURL + '/current.json?key=' + this.apiKey + '&q=' + this.zipcode
            fetch(uri, callObj)
                .then(res => res.json())
                .then(json => {
                    if (this.verbose) {
                        logit('Current Weather Observation follows:');
                        console.dir(json, { depth: null });
                    }
                    resolve(json);
                })
                .catch(err => {
                    console.error('Error calling ' + uri, err);
                    reject(err);
                })
        });
    };

}

function logit(txt = '') {
    console.debug(logPrefix + txt);
};

module.exports = weatherApiDataGetter
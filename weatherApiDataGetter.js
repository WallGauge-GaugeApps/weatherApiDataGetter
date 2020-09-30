const fetch = require('node-fetch');

const logPrefix = 'weatherApiDataGetter.js | ';
const baseApiURL = 'https://api.weatherapi.com/v1';
const weatherDataObj = {
    obsDate: undefined,
    current: {
        temp: undefined,
        feelsLike: undefined,
        wind: undefined,
        windGust: undefined,
        windDegree: undefined,
        pressure: undefined,
        precip: undefined,
        humidity: undefined
    },
    forecast: {
        maxTemp: undefined,
        minTemp: undefined,
        maxWind: undefined,
        totalPrecip: undefined,
        rainChance: undefined,
        snowChance: undefined
    },
    history: {
        precipLast7Days: undefined
    }
};

class weatherApiDataGetter {
    /**
     * This weather class is based on the weatherApi free weather access.  
     * Api Documentaiton https://www.weatherapi.com/docs/. 
     * Call getForecast() and getHistory() to populate this.data with weather data.
     * @param {string} apiKey This is the weatherapi.com key from https://www.weatherapi.com/login.aspx
     * @param {string} zipcode Zipcode for weather data to lookup
     * @param {boolean} verboseLogging Defaults to false
     */
    constructor(apiKey = '', zipcode = '62052', verboseLogging = false) {
        this.apiKey = apiKey;
        this.zipcode = zipcode;
        this.verbose = verboseLogging;
        this.data = weatherDataObj;
    };

    /**
     * Gets current conditioins and forecaset for the next 24 hours.
     * Once promise is stisfied this.data will be populated with parsed values from the call.
     * @returns {Promise} Resolved promise argument will be a JSON object with all weather data
     */
    getForecast() {
        return new Promise((resolve, reject) => {
            let callObj = {
                method: 'GET',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            let uri = baseApiURL + '/forecast.json?key=' + this.apiKey + '&q=' + this.zipcode;
            fetch(uri, callObj)
                .then(res => res.json())
                .then(jsonData => {
                    if (this.verbose) {
                        logit('Weather Forecast follows:');
                        console.dir(jsonData, { depth: null });
                    };
                    if (jsonData.error) {
                        logit('API Error with getForecast:');
                        reject(jsonData.error);
                    } else {
                        try {
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
                        };
                    };
                })
                .catch(err => {
                    console.error('Error calling ' + uri, err);
                    reject(err);
                });
        });
    };

    /**
     * Gets current conditions and returns promise.
     * @returns {Promise} Resolved promise argument will be a JSON object with all weather data
     */
    getCurrent() {
        return new Promise((resolve, reject) => {
            let callObj = {
                method: 'GET',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            let uri = baseApiURL + '/current.json?key=' + this.apiKey + '&q=' + this.zipcode;
            fetch(uri, callObj)
                .then(res => res.json())
                .then(jsonData => {
                    if (this.verbose) {
                        logit('Current Weather Observation follows:');
                        console.dir(jsonData, { depth: null });
                    };
                    if (jsonData.error) {
                        logit('API Error with getCurrent:');
                        reject(jsonData.error);
                    } else {
                        resolve(jsonData);
                    };
                })
                .catch(err => {
                    console.error('Error calling ' + uri, err);
                    reject(err);
                });
        });
    };

    /**
     * Gets weather history data for a date. 
     * The free version of this API only allows you to go back 7 days.
     * @param {string} dateCode format = '2020-09-22'
     * @returns {Promise} Resolved promise argument will be a JSON object with all weather history data for the dateCode
     */
    getHistory(dateCode = '2020-09-22') {
        return new Promise((resolve, reject) => {
            let callObj = {
                method: 'GET',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            let uri = baseApiURL + '/history.json?key=' + this.apiKey + '&q=' + this.zipcode + '&dt=' + dateCode;
            fetch(uri, callObj)
                .then(res => res.json())
                .then(jsonData => {
                    if (this.verbose) {
                        logit('Weather History for ' + dateCode + ' follows:');
                        console.dir(jsonData, { depth: null });
                    };
                    if (jsonData.error) {
                        logit('API Error with getHistory:');
                        reject(jsonData.error);
                    } else {
                        resolve(jsonData);
                    };
                })
                .catch(err => {
                    console.error('Error calling ' + uri, err);
                    reject(err);
                });
        });
    };

    /**
     * Gets accumulated precipitation for the numbers of days back in history from today (does not include today's precipitation).
     * Free version of this API only allows you to go back 7 days. 
     * If called and daysBack == 7 (the default value) this method will populate this.data.history.precipLast7Days.
     * @param {number} daysBack defaults to 7
     * @returns {Promise} Resolved promise argument (number) will be total precipitation for the daysBack param
     */
    getPrecipHistory(daysBack = 7) {
        return new Promise((resolve, reject) => {
            let promisesArray = [];
            for (let i = 1; i < daysBack + 1; i++) {
                let now = new Date((new Date()).setDate((new Date()).getDate() - i));
                let dateCode = now.getFullYear().toString() + '-' + (now.getMonth() + 1).toString() + '-' + now.getDate();
                if (this.verbose) logit('Getting history for ' + dateCode);
                promisesArray.push(this.getHistory(dateCode));
            }
            Promise.all(promisesArray)
                .then((values) => {
                    let totalPrecip = 0;
                    values.forEach((val, ndx) => {
                        if (this.verbose) console.log('The rain amount for ' + val.forecast.forecastday[0].date + ' = ' + val.forecast.forecastday[0].day.totalprecip_in);
                        totalPrecip = totalPrecip + Number(val.forecast.forecastday[0].day.totalprecip_in);
                    });
                    if (this.verbose) logit('Total Precip = ' + totalPrecip);
                    if (daysBack == 7) this.data.history.precipLast7Days = totalPrecip;
                    resolve(totalPrecip);
                })
                .catch((err) => {
                    logit('Error with getPrecipHistory:');
                    reject(err);
                });
        });
    };

};

function logit(txt = '') {
    console.debug(logPrefix + txt);
};

module.exports = weatherApiDataGetter
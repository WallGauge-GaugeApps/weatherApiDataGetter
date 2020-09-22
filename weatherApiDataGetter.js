const EventEmitter = require('events');
const fetch = require('node-fetch');

const logPrefix = 'weatherApiDataGetter.js | ';
const baseApiURL = 'https://api.weatherapi.com/v1'

class weatherApiDataGetter extends EventEmitter {

    constructor(apiKey = '', zipcode = '62052', verboseLogging = true) {
        super();
        this.apiKey = apiKey;
        this.zipcode = zipcode;
        this.verbose = verboseLogging;
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
                .then(json => {
                    if (this.verbose) {
                        logit('Weather Forecast follows:');
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
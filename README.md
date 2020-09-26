# weatherApi Data Getter (free weather api)

This class pulls weater information from [weatherapi](https://www.weatherapi.com) a free and paid weather service.  To use this class you will need to signup for an account and get an API Key.  One of their terms for using the free account is to put a link back to their site as follows:

![pic1](https://cdn.weatherapi.com/v4/images/weatherapi_logo.png)

`<a href="https://www.weatherapi.com/" title="Free Weather API"><img src='//cdn.weatherapi.com/v4/images/weatherapi_logo.png' alt="Weather data by WeatherAPI.com" border="0"></a>`

## Software Requirements for this class

* Node v10 or newer
* git
* Goto [weatherApi.com](https://www.weatherapi.com) create an account and get an api Key.

## To install

* `git clone https://github.com/WallGauge-GaugeApps/weatherApiDataGetter.git`
* `cd weatherApiDataGetter`
* `npm install`

### To Test

* Place your api key and target zipcode into actObj.json file
* `cd ~/weatherApiDataGetter`
* Type `nano actObj.json` to create a file and paste this into it: `{"apiKey":"youKeyHere", "zipcode":"60007"}` update with your information and save.
* To run test type `node testMe`

## Notes

* See testMe.js for examples on how to use and call this class
* The free API seems to update the weater data every 15 miniutes.  That may change based on your zip code or if you purchase an API.  
* The free version only supports 7 days of history according to their web site [see plan details here](https://www.weatherapi.com/pricing.aspx).

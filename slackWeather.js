var request = require('request');
var Slack = require('node-slackr');
var credentials = require('./credentials');

var slack = new Slack(credentials.organization,credentials.token,{
    channel: "#random",
    username: "weather-bot",
    //icon_url: "http://domain.com/image.png",
    icon_emoji: ":sunny:"  
});

// The Cities IDs can be found on openweathermap.org (make a search, and look the URI)
var cities = [2964574];

request("http://api.openweathermap.org/data/2.5/group?id="+cities.join(',')+"&units=metric ", function(error, response, body) {
  // Maybe we can handle this differently/better ?
  if(error !== null)
  {
  	return;
  }
  	
  var text = "Hello team, here is the weather forecast for today: \n";
 
  var weatherForecasts = JSON.parse(body);
 
  for (var i = weatherForecasts.list.length - 1; i >= 0; i--) {
  	var currentCity= weatherForecasts.list[i];
 
  	text += "*"+currentCity.name+"*: ";
      //text += ":" + currentCity.weather[0].icon + ": ";
  	text += currentCity.weather[0].main + ", " + currentCity.weather[0].description + ". ";
  	text += "Temp: " + currentCity.main.temp + "°c. ";
      text += "\n";
  }

  var icon_emoji;

  if (text.match(/rain/i)) {
    icon_emoji = ':umbrella:';
  } else if (text.match(/sun/i)) {
    icon_emoji = ':sunny:';
  } else if (text.match(/(broken clouds|scattered clouds)/i)) {
    icon_emoji = ':partly_sunny:';
  } else if (text.match(/storm/i)) {
    icon_emoji = ':zap:';
  } else if (text.match(/snow/i)) {
    icon_emoji = ':snowflake:';
  } else {
    icon_emoji = ':cloud:';
  }

  slack.notify({
    'text': text,
    'icon_emoji': icon_emoji
    });

});

// Load Modules

var Hapi = require('hapi');
var Request = require('request');


// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});


// Add the route
server.route({
    method  : 'POST',
    path    : '/weather',
    handler : function(request, reply) {

	    // Call the OpenWeather API
	    Request("http://api.openweathermap.org/data/2.5/find?units=imperial&q=" + request.payload.text, function (error, response, body) {

	      if (error) return reply("Bummer! Could not fetch weather data for " + request.payload.text + ". Try again later.");

		  try {

	        var result = JSON.parse(body);
	        if (result.list != null && result.list.length >= 0) {

			    var weatherData = result.list[0];

			    // Respond with rich-formatted messages as defined https://api.slack.com/docs/formatting
			    var text = "Weather for *" + weatherData.name + "* - ";
			    text += weatherData.weather[0].main + " (" + weatherData.weather[0].description + ")\n";
			    text += "Current Temperature: " + weatherData.main.temp;
			    text += " (Low: " + weatherData.main.temp_min;
			    text += " High: " + weatherData.main.temp_max + ") °F";
			    return reply(text);

			} else {
				return reply("No weather data found for *" + request.payload.text + "*! Check the spelling and try again.");
			}

	      } catch (exception) {
	        return reply("No weather data found for *" + request.payload.text + "*! Check the spelling and try again.");
	      }
	    });
	}
});


// Start the server
server.start();
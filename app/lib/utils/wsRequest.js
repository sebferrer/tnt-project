var request = require('request');

exports.get = function(url, paramsJS, callback) {
	var myURL = url + '?';
	for(key in paramsJS) {
	  myURL += key + "=" + paramsJS[key] + "&";
	}
	myURL = myURL.substring(0, myURL.length - 1);
	
	
	request.get({ url : myURL}, function(error, response, body) {
		callback(error, response, body);
	});
};
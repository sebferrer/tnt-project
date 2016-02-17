var crypto	= require('crypto');
var KEY_SIZE = 10;
var CHARS	 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

exports.encrypt = function( msg ) {
	var key = randomString(KEY_SIZE, CHARS);
	var hash = crypto.createHmac('sha256', key).update( msg );
	return hash.digest('hex');
};

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) 
    	result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

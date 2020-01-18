const striptags = require('striptags')

/**
 * Checks whether the given object is a type of string
 * Note: does not check for JS instanceof String
 */
exports.isValidString = (o) => {
	return typeof o === "string";
}

/**
 * Checks whether the given object is a valid email address
 */
exports.isValidEmail = (o) => {
	let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(o.toLowerCase());
}

/**
 * Strips input text of HTML tags.
 * @param { String } text
 * @param { Array } allowedTags An array of allowed HTML tags. E.g. `['a']`
 */
exports.cleanHTML = (text, allowedTags=[]) => {
	return striptags(text, allowedTags)
}
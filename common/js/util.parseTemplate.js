/**
 * Author: huangzhiyang
 * Date: 2016/9/2 17:28
 * Description: ""
 */
var ParseTemplate = function(text, settings, oldSettings){
	if (!settings && oldSettings) settings = oldSettings;
	var _ = {};
	var idCounter = 0;
	var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	var isArrayLike = function(collection) {
		var length = collection != null && collection.length;
		return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	};
	var optimizeCb = function(func, context, argCount) {
		if (context === void 0) return func;
		switch (argCount == null ? 3 : argCount) {
			case 1: return function(value) {
				return func.call(context, value);
			};
			case 2: return function(value, other) {
				return func.call(context, value, other);
			};
			case 3: return function(value, index, collection) {
				return func.call(context, value, index, collection);
			};
			case 4: return function(accumulator, value, index, collection) {
				return func.call(context, accumulator, value, index, collection);
			};
		}
		return function() {
			return func.apply(context, arguments);
		};
	};
	_["each"] = function(obj, iteratee, context) {
		iteratee = optimizeCb(iteratee, context);
		var i, length;
		if (isArrayLike(obj)) {
			for (i = 0, length = obj.length; i < length; i++) {
				iteratee(obj[i], i, obj);
			}
		} else {
			for(var i in obj){
				iteratee(obj[i], i, obj);
			}
		}
		return obj;
	};
	_["uniqueId"] = function(prefix) {
		var id = ++idCounter + '';
		return prefix ? prefix + id : id;
	};

	var templateSettings = {
		evaluate    : /<%([\s\S]+?)%>/g,
		interpolate : /<%=([\s\S]+?)%>/g,
		escape      : /<%-([\s\S]+?)%>/g
	};

	var noMatch = /(.)^/;

	var escapes = {
		"'":      "'",
		'\\':     '\\',
		'\r':     'r',
		'\n':     'n',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};

	var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	var escapeChar = function(match) {
		return '\\' + escapes[match];
	};

	if(!settings) settings = {};
	for(var i in templateSettings) if(typeof settings[i]=="undefined") settings[i] = templateSettings[i];


	// Combine delimiters into one regular expression via alternation.
	var matcher = RegExp([
			(settings.escape || noMatch).source,
			(settings.interpolate || noMatch).source,
			(settings.evaluate || noMatch).source
		].join('|') + '|$', 'g');

	// Compile the template source, escaping string literals appropriately.
	var index = 0;
	var source = "__p+='";
	text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
		source += text.slice(index, offset).replace(escaper, escapeChar);
		index = offset + match.length;

		if (escape) {
			source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
		} else if (interpolate) {
			source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
		} else if (evaluate) {
			source += "';\n" + evaluate + "\n__p+='";
		}

		// Adobe VMs need the match returned to produce the correct offest.
		return match;
	});
	source += "';\n";

	// If a variable is not specified, place data values in local scope.
	if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	source = "var __t,__p='',__j=Array.prototype.join," +
		"print=function(){__p+=__j.call(arguments,'');};\n" +
		source + 'return __p;\n';


	try {
		var render = new Function(settings.variable || 'obj', '_', source);
	} catch (e) {
		e.source = source;
		throw e;
	}

	var template = function(data,cxt) {
		return render.call(cxt || this, data, _);
	};

	// Provide the compiled source as a convenience for precompilation.
	var argument = settings.variable || 'obj';
	template.source = 'function(' + argument + '){\n' + source + '}';

	return template;
};

module.exports = ParseTemplate;
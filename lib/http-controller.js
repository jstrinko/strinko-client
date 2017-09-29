'use strict';
const Express = require('express');
const Util = require('util');
const _ = require('lodash');

class Http_Controller {
	constructor(options) {
		_.extend(this, options);
		this.app = Express();
		this.app.get('/', (req, res) => {
			res.send("HI FROM APP");
		});
		this.set_log_prefix();
	}
	start(callback) {
		this.app.listen(3000, () => {
			this.info("Http started on port 3000");
			return process.nextTick(callback);
		});
	}
	set_log_prefix() {
		['log','info','warn','error'].forEach((log) => {
			const original_function = this.creator[log].bind(this.logger);
			this[log] = function() {
				arguments[0] = Util.format('[bonjour] %s', arguments[0]);
				original_function.apply(this.logger, arguments);
			};
		});
	}
};

module.exports = Http_Controller;

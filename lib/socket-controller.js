'use strict';
const _ = require('lodash');
const Util = require('util');

class Socket_Controller {
	constructor(options) {
		_.extend(this, options);
		this.set_log_prefix();
	}
	start(callback) {
		this.info("Socket started");
		return process.nextTick(callback);
	}
	set_log_prefix() {
		['log','info','warn','error'].forEach((log) => {
			const original_function = this.creator[log].bind(this.logger);
			this[log] = function() {
				arguments[0] = Util.format('[socket] %s', arguments[0]);
				original_function.apply(this.logger, arguments);
			};
		});
	}
};

module.exports = Socket_Controller;

'use strict';
const Bonjour = require('bonjour');
const Util = require('util');
const _ = require('lodash');

class Bonjour_Controller {
	constructor(options) {
		_.extend(this, options);
		this.bonjour = Bonjour();
		this.browser = this.bonjour.find({ type: 'http' });
		this.browser.on('up', () => {
			this.browser.update();
		});
		this.set_log_prefix();
	}
	start(callback) {
		this.bonjour.publish({ name: 'Strinko Hub', type: 'http', port: 3001 });
		this.browser.start();
		this.check_interval = setInterval(() => {
			this.browser.update();
		}, 5000);
		this.info("Bonjour started");
		return process.nextTick(callback);
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

module.exports = Bonjour_Controller;

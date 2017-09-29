'use strict';
const Electron_Controller = require(`${__dirname}/electron-controller`);
const Http_Controller = require(`${__dirname}/http-controller`);
const Bonjour_Controller = require(`${__dirname}/bonjour-controller`);
const Socket_Controller = require(`${__dirname}/socket-controller`);
const Winston = require('winston');
const Async = require('async');
const Util = require('util');
const _ = require('lodash');

class Hub_Controller {
	constructor() {
		this.logger = new (Winston.Logger)({
			transports: [
				new (Winston.transports.File)({ filename: `${process.env.LOCALAPPDATA}/client.log` })
			]
		});
		this.set_log_prefix();
		this.electron_controller = new Electron_Controller({ creator: this });
		this.http_controller = new Http_Controller({ creator: this });
		this.socket_controller = new Socket_Controller({ creator: this });
		this.bonjour_controller = new Bonjour_Controller({ creator: this });
	}
	start() {
		this.info("Starting up");
		Async.parallel([
			this.electron_controller.start.bind(this.electron_controller),
			this.http_controller.start.bind(this.http_controller),
			this.socket_controller.start.bind(this.socket_controller),
			this.bonjour_controller.start.bind(this.bonjour_controller)
		]);
	}
	set_log_prefix() {
		['log','info','warn','error'].forEach((log) => {
			const original_function = this.logger[log].bind(this.logger);
			const original_logger = this.logger;
			this[log] = function() {
				arguments[0] = Util.format((new Date()).toISOString() + ' %s', arguments[0]);
				original_function.apply(original_logger, arguments);
			};
		});
	}
}

module.exports = Hub_Controller;

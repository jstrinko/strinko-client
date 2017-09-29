'use strict';
const electron = require('electron');
const _ = require('lodash');
const Util = require('util');
const app = electron.app;
const Browser_Window = electron.BrowserWindow;

class Electron_Controller {
	constructor(options) {
		_.extend(this, options);
		app.on('ready', this.build_window); 
		app.on('activate', this.build_window);
		app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') {
				app.quit();
			}
		});
		this.set_log_prefix();
	}
	start(callback) {
		this.info("Electron started");
		return process.nextTick(callback);
	}
	build_window() {
		if (!this.main_window) {
			this.main_window = new Browser_Window({ width: 800, height: 600 });
			this.main_window.loadURL('https://glip.com');
			this.main_window.on('closed', () => {
				this.main_window = null;
			});
		}
	}
	set_log_prefix() {
		['log','info','warn','error'].forEach((log) => {
			const original_function = this.creator[log].bind(this.logger);
			this[log] = function() {
				arguments[0] = Util.format('[electron] %s', arguments[0]);
				original_function.apply(this.logger, arguments);
			};
		});
	}
};

module.exports = Electron_Controller;

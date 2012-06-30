/**
 * The Controller is the brain of the whole client-side code.
 */
define([
	'constants'
], function(C) {

	/**
	 * Stores all modules, regardless of type (Core, Data Types, Export Types, Countries)
	 * and their active instances.
	 */
	var _modules = {};


	return {

		/**
		 * Adds a module to the system. Note: at this stage, all that's done is add the module
		 * to an internal private var. Neither the module init() nor the constructor() is called yet.
		 *
		 * @public
		 * @function
		 */
		register: function(moduleID, moduleType, module) {

			// validate the module info
			if (_modules.hasOwnProperty(moduleID) && C.DEBUGGING.CONSOLE_LOG) {
				console.warn("Sorry, a module with ID has already been registered.");
				return;
			}
			if ($.inArray(moduleType, [C.COMPONENT.DATA_TYPE, C.COMPONENT.EXPORT_TYPE, C.COMPONENT.CORE]) == -1 &&
				C.DEBUGGING.CONSOLE_LOG) {
				console.warn("Unknown module type: " + moduleType);
				return;
			}
			if (module.hasOwnProperty("init") && typeof module.init != "function") {
				console.warn("Module has an invalid init function. Should be a function!");
				return;
			}
			if (module.hasOwnProperty("run") && typeof module.run != "function") {
				console.warn("Module has an invalid init function. Should be a function!");
				return;
			}

			_modules[moduleID] = {
				type: moduleType,
				init: (module.hasOwnProperty("init")) ? module.init : null,
				run: (module.hasOwnProperty("run")) ? module.run : null
			}

			if (C.DEBUGGING.LIST_MODULE_REGISTRATIONS) {
				console.log("Module registered: " + moduleID + " - ", _modules[moduleID]);
			}
		},


		unregister: function(moduleID) {

		},

		/**
		 * Runs the initialization method of a single module.
		 */
		init: function(moduleID) {
			if (_modules[moduleID].init != null) {
				try {
					_modules[moduleID].init();
				} catch(e) {
					if (C.DEBUGGING.CONSOLE_LOG) {
						console.warn("Init() method failed for " + moduleID + ":", e, " - module unregistered.");
						this.unregister(moduleID);
					}
				}
			}
		},

		/**
		 * Calls the initialization methods of all registered modules.
		 */
		initAll: function() {
			for (var moduleID in _modules) {
				if (_modules.hasOwnProperty(moduleID)) {
					this.init(moduleID);
				}
			}
		},

		run: function(moduleID) {
			try {
				_modules[moduleID].run();
			} catch(e) {
				console.warn(e);
			}
		},

		runAll: function() {
			for (var moduleID in _modules) {
				this.run(moduleID);
			}
		}
	};

});
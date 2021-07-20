sap.ui.define([
	"be/wl/zcomploaderlib/cl/BaseController",
	"be/wl/zcomploaderlib/library"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, CompLib) {
		"use strict";

		return Controller.extend("be.wl.listcomponent1.controller.App", {
			onInit: function () {
				Controller.prototype.onInit.apply(this, arguments);
			},
			onSelectionChange: function (event) {
				let item = event?.getParameter("listItem")?.getBindingContext()?.getObject();
				console.log(item)
				if (item) {
					this.getOwnerComponent().fireAction({
						type: CompLib.CentralEntryPointType.Navigate,
						data: {
							item: item
						}
					});
				}
			}
		});
	});

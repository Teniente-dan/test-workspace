sap.ui.define([
    "sap/ui/core/util/MockServer",
    "sap/ui/model/json/JSONModel",
    "sap/base/util/UriParameters",
    "sap/base/Log"
], function (MockServer, JSONModel, UriParameters, Log) {
    "use strict";

    var oMockServer,
        oMockServer1,
        _sAppPath = "be/wl/CompLoaderApp/",
        _sJsonFilesPath = _sAppPath + "localService/mockdata",
        _sJsonFilesPath1 = _sAppPath + "localService/mockdata1";

    var oMockServerInterface = {

        /**
         * Initializes the mock server asynchronously.
         * You can configure the delay with the URL parameter "serverDelay".
         * The local mock data in this folder is returned instead of the real data for testing.
         * @protected
         * @param {object} [oOptionsParameter] init parameters for the mockserver
         * @returns{Promise} a promise that is resolved when the mock server has been started
         */
        init: function (oOptionsParameter) {
            var oOptions = oOptionsParameter || {};

            return new Promise(function (fnResolve, fnReject) {
                var sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
                    oManifestModel = new JSONModel(sManifestUrl);
//ZCL_CONFIG_C_CDS
                oManifestModel.attachRequestCompleted(function () {
                    console.log("getPropCL");
                    var oUriParameters = new UriParameters(window.location.href),
                        // parse manifest for local metatadata URI
                        sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath),
                        oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/ZCL_CONFIG_C_CDS"),
                        sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri),
                        // ensure there is a trailing slash
                        sMockServerUrl = oMainDataSource.uri && new URI(oMainDataSource.uri).absoluteTo(sap.ui.require.toUrl(_sAppPath)).toString();

                    // create a mock server instance or stop the existing one to reinitialize
                    if (!oMockServer) {
                        oMockServer = new MockServer({
                            rootUri: sMockServerUrl
                        });
                    } else {
                        oMockServer.stop();
                    }

                    // configure mock server with the given options or a default delay of 0.5s
                    MockServer.config({
                        autoRespond: true,
                        autoRespondAfter: (oOptions.delay || oUriParameters.get("serverDelay") || 500)
                    });

                    // simulate all requests using mock data
                    oMockServer.simulate(sMetadataUrl, {
                        sMockdataBaseUrl: sJsonFilesUrl,
                        bGenerateMissingMockData: true
                    });

                    var aRequests = oMockServer.getRequests();

                    // compose an error response for each request
                    var fnResponse = function (iErrCode, sMessage, aRequest) {
                        aRequest.response = function (oXhr) {
                            oXhr.respond(iErrCode, { "Content-Type": "text/plain;charset=utf-8" }, sMessage);
                        };
                    };

                    // simulate metadata errors
                    if (oOptions.metadataError || oUriParameters.get("metadataError")) {
                        aRequests.forEach(function (aEntry) {
                            if (aEntry.path.toString().indexOf("$metadata") > -1) {
                                fnResponse(500, "metadata Error", aEntry);
                            }
                        });
                    }

                    // simulate request errors
                    var sErrorParam = oOptions.errorType || oUriParameters.get("errorType"),
                        iErrorCode = sErrorParam === "badRequest" ? 400 : 500;
                    if (sErrorParam) {
                        aRequests.forEach(function (aEntry) {
                            fnResponse(iErrorCode, sErrorParam, aEntry);
                        });
                    }

                    // custom mock behaviour may be added here

                    // set requests and start the server
                    oMockServer.setRequests(aRequests);
                    oMockServer.start();

                    oMockServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.GET, function (oCall) {
                        oCall.mParameters.oFilteredData.results = [{                
                            "type": "T0000001",
                            "scenario": "S0000001",
                            "level_cl": "1",
                            "viewid": "MA",
                            "componentid": "be.wl.listcomponent1",
                            "componenturl": "../listcomponent1/",
                            "fiori_elements": "",
                            "layout": "",
                            "toParams": { results: [{
                                "type": "S0000001", "componentid": "be.wl.listcomponent1", "paramid": "EDITABLE", "paramseqnr": "00000", "paramval": "false", "paramusage":"FRONT"
                            }] }
                        }]
                        // oCall.mParameters.oFilteredData.name = "xxx";
                        // oCall.mParameters.oFilteredData.ext = "xls";
                        {/* <m:List items="{/FlightCollection}" selectionChange=".onSelectionChange" mode="SingleSelectMaster">
				<m:StandardListItem type="Active" title="{carrid} - {connid}" description="{flightDetails/countryFrom} {flightDetails/cityFrom} => {flightDetails/countryTo} {flightDetails/cityTo}" iconDensityAware="false" iconInset="false"/> */}
                        console.log("Config");
                    }, "zcl_config_c");


                    Log.info("Running the app with mock data");
                    fnResolve();
                });
//ZCL_SCENARIO_C_CDS                
                oManifestModel.attachRequestCompleted(function () {
                    console.log("getPropScenario");
                    var oUriParameters = new UriParameters(window.location.href),
                        // parse manifest for local metatadata URI
                        sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath1),
                        oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/ZCL_SCENARIO_C_CDS"),
                        sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri),
                        // ensure there is a trailing slash
                        sMockServerUrl = oMainDataSource.uri && new URI(oMainDataSource.uri).absoluteTo(sap.ui.require.toUrl(_sAppPath)).toString();

                    // create a mock server instance or stop the existing one to reinitialize
                    if (!oMockServer1) {
                        oMockServer1 = new MockServer({
                            rootUri: sMockServerUrl
                        });
                    } else {
                        oMockServer1.stop();
                    }

                    // // configure mock server with the given options or a default delay of 0.5s
                    // MockServer.config({
                    //     autoRespond: true,
                    //     autoRespondAfter: (oOptions.delay || oUriParameters.get("serverDelay") || 500)
                    // });

                    // simulate all requests using mock data
                    oMockServer1.simulate(sMetadataUrl, {
                        sMockdataBaseUrl: sJsonFilesUrl,
                        bGenerateMissingMockData: true
                    });

                    var aRequests = oMockServer1.getRequests();

                    // compose an error response for each request
                    var fnResponse = function (iErrCode, sMessage, aRequest) {
                        aRequest.response = function (oXhr) {
                            oXhr.respond(iErrCode, { "Content-Type": "text/plain;charset=utf-8" }, sMessage);
                        };
                    };

                    // simulate metadata errors
                    if (oOptions.metadataError || oUriParameters.get("metadataError")) {
                        aRequests.forEach(function (aEntry) {
                            if (aEntry.path.toString().indexOf("$metadata") > -1) {
                                fnResponse(500, "metadata Error", aEntry);
                            }
                        });
                    }

                    // simulate request errors
                    var sErrorParam = oOptions.errorType || oUriParameters.get("errorType"),
                        iErrorCode = sErrorParam === "badRequest" ? 400 : 500;
                    if (sErrorParam) {
                        aRequests.forEach(function (aEntry) {
                            fnResponse(iErrorCode, sErrorParam, aEntry);
                        });
                    }

                    // custom mock behaviour may be added here

                    // set requests and start the server
                    oMockServer1.setRequests(aRequests);
                    oMockServer1.start();

                    oMockServer1.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.GET, function (oCall) {
                        oCall.mParameters.oFilteredData.results = [{                                
                            "scenario_id": "S0000002",
                            "scenario_descr": "Demo Scenario1"
                        }]
                        // oCall.mParameters.oFilteredData.name = "xxx";
                        // oCall.mParameters.oFilteredData.ext = "xls";
                        {/* <m:List items="{/FlightCollection}" selectionChange=".onSelectionChange" mode="SingleSelectMaster">
				<m:StandardListItem type="Active" title="{carrid} - {connid}" description="{flightDetails/countryFrom} {flightDetails/cityFrom} => {flightDetails/countryTo} {flightDetails/cityTo}" iconDensityAware="false" iconInset="false"/> */}
                        console.log("scenario");
                    }, "zcl_scenario_c1");


                    Log.info("Running the app with mock data");
                    fnResolve();
                });

                oManifestModel.attachRequestFailed(function () {
                    var sError = "Failed to load application manifest";

                    Log.error(sError);
                    fnReject(new Error(sError));
                });
            });
        },

        /**
         * @public returns the mockserver of the app, should be used in integration tests
         * @returns {sap.ui.core.util.MockServer} the mockserver instance
         */
        getMockServer: function () {
            return oMockServer;
        }
    };

    return oMockServerInterface;
});
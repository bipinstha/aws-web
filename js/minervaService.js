'use strict';

let $minerva = (function() {
    let API_ROOT = 'https://minerva.dev.gaiacloud.jpmchase.net';
    let SOURCE_LIST_URI = '/source/list';
    let SRC_LIST = '/whiteboard/source/';
    let CONTEXT_LIST = '/context/list';
    let WHITEBOARD_CONTEXT = '/whiteboard/context/';

    function fetchAllSourceIds(callBack) {
        let urlPath = API_ROOT + SOURCE_LIST_URI;
        loadJSON(urlPath, callBack);
    }

    function fetchVersionBySourceId(sourceId, callBack) {
        let urlPath = API_ROOT + '/source/' + sourceId + '/list';
        loadJSON(urlPath, callBack);
    }

    function fetchBySrcVersionRange(sourceId, startVersion, endVersion, entityKey, callback) {
        let urlPath = `${API_ROOT + SRC_LIST + sourceId + '/versions?startVersion='
        + startVersion + '&endVersion=' + endVersion}`;
        urlPath += `${(entityKey) ? +'&entityKey=' + entityKey : ''}`;
        loadJSON(urlPath, callback)
    }

    function fetchBySrcVersion(sourceId, version, callback) {
        let urlPath = `${API_ROOT + SRC_LIST + sourceId + '?version=' + version}`;
        loadJSON(urlPath, callback)
    }

    function fetchAllContext(callback) {
        let urlPath = `${API_ROOT + CONTEXT_LIST + '?verbose=false'}`;
        loadJSON(urlPath, callback)
    }

    function fetchByContextId(contextId, callback) {
        let urlPath = `${API_ROOT + WHITEBOARD_CONTEXT + contextId}`;
        loadJSON(urlPath, callback)
    }

    function loadJSON(urlPath, callback) {
        $uiControls.startLoadingSpinner();
        let xmlobj = new XMLHttpRequest();
        xmlobj.overrideMimeType("application/json");
        xmlobj.open('GET', urlPath, true);
        xmlobj.onreadystatechange = function () {
            if (xmlobj.readyState == 4 && xmlobj.status == "200") {
                callback(xmlobj.responseText);
                $uiControls.stopLoadingSpinner();
            } else {
                $uiControls.displayErrorMsg(xmlobj.status);
            }
        };
        xmlobj.send();
    }

    return {
        fetchAllSourceIds: function(callback) {
            fetchAllSourceIds(callback);
        },

        fetchVersionBySourceId: function(sourceId, callback) {
            fetchVersionBySourceId(sourceId, callback);
        },

        fetchBySrcVersion: function(sourceId, version, callback) {
            fetchBySrcVersion(sourceId, version, callback);
        },

        fetchBySrcVersionRange: function(sourceId, startVersion, endVersion, entityKey, callback) {
            fetchBySrcVersionRange(sourceId, startVersion, endVersion, entityKey, callback);
        },

        fetchAllContext: function(callback) {
            fetchAllContext(callback);
        },

        fetchByContextId: function (contextId, callback) {
            fetchByContextId(contextId, callback);
        }
    }
})();
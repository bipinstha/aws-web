'use strict';

var srcURIs = [
    "/svc/wr/dwm/secure/v1/trade/equity/account/options/list",
    "/svc/wr/dwm/secure/v1/trade/equity/quote/list",
    "/svc/wr/dwm/secure/v1/trade/equity/buyorder/validate",
    "/svc/wr/dwm/secure/v1/trade/equity/sellorder/validate",
    "/svc/wr/dwm/secure/v1/trade/equity/buyorder/add",
    "/svc/wr/dwm/secure/v1/trade/equity/sellorder/add",
    "/svc/wr/dwm/secure/v1/trade/equity/buyorder/update/validate",
    "/svc/wr/dwm/secure/v1/trade/equity/sellorder/update/validate",
    "/svc/wr/dwm/secure/v1/trade/equity/buyorder/update",
    "/svc/wr/dwm/secure/v1/trade/equity/sellorder/update",
    "/svc/wr/dwm/secure/v1/trade/equity/order/cancel",
    "/svc/wr/dwm/secure/v1/trade/account/options/list",
    "/svc/wr/dwm/secure/v1/trade/mutualfund/quote/list",
    "/svc/wr/dwm/secure/v1/trade/mutualfund/familysymbol/list",
    "/svc/wr/dwm/secure/v1/trade/mutualfund/buyorder/validate",
    "/svc/wr/dwm/secure/v1/trade/mutualfund/sellorder/validate",
    "/svc/wr/dwm/secure/v1/trade/mutualfund/exchange/validate",
    "/svc/wr/dwm/secure/v1/trade/mutualfund/buyorder/add",
    "/svc/wr/dwm/secure/v1/trade/mutualfund/sellorder/add",
    "/svc/wr/dwm/secure/v1/trade/mutualfund/exchange/add",
    "/svc/wr/dwm/secure/v1/trade/mutualfund/buyorder/update/validate",
    "/svc/wr/dwm/secure/v1/trade/mutualfund/sellorder/update/validate",
    "/svc/wr/dwm/secure/v1/trade/mutualfund/buyorder/update",
    "/svc/wr/dwm/secure/v1/trade/mutualfund/sellorder/update",
    "/svc/wr/dwm/secure/v1/trade/mutualfund/order/cancel",
    "/svc/wr/dwm/secure/trade/option/v2/order/add/options",
    "/svc/wr/dwm/secure/trade/option/v2/quote/summary/list",
    "/svc/wr/dwm/secure/trade/option/v1/strikeprice/list",
    "/svc/wr/dwm/secure/trade/option/v1/quote/list",
    "/svc/wr/dwm/secure/trade/option/v1/buyorder/validate/add",
    "/svc/wr/dwm/secure/trade/option/v1/sellorder/validate/add",
    "/svc/wr/dwm/secure/trade/option/v1/buyorder/add",
    "/svc/wr/dwm/secure/trade/option/v1/sellorder/add",
    "/svc/wr/dwm/secure/trade/option/v1/buyorder/update/validate/add",
    "/svc/wr/dwm/secure/trade/option/v1/sellorder/update/validate/add",
    "/svc/wr/dwm/secure/trade/option/v1/buyorder/update",
    "/svc/wr/dwm/secure/trade/option/v1/sellorder/update",
    "/svc/wr/dwm/secure/v1/trade/option/order/cancel/add",
    "/svc/wr/dwm/secure/v1/trade/fixedincome/order/add/options",
    "/svc/wr/dwm/secure/v1/trade/fixedincome/list",
    "/svc/wr/dwm/secure/v1/trade/fixedincome/bonddetail/list",
    "/svc/wr/dwm/secure/v1/trade/fixedincome/quotedetail/list",
    "/svc/wr/dwm/secure/v1/trade/fixedincome/buyorder/validate",
    "/svc/wr/dwm/secure/v1/trade/fixedincome/sellorder/validate",
    "/svc/wr/dwm/secure/v1/trade/fixedincome/buyorder/add",
    "/svc/wr/dwm/secure/v1/trade/fixedincome/sellorder/add",
    "/svc/wr/dwm/secure/v1/trade/account/options/list",
    "/svc/wr/dwm/secure/trade/v2/orders/list",
    "/svc/wr/dwm/secure/v1/trade/orderdetail/list",
    "/svc/wr/dwm/secure/markit/v1/token/list",
    "/svc/wr/dwm/secure/v1/options/application/list",
    "/svc/wr/dwm/secure/v1/options/application/add"
];

function main() {
    console.log("Loading Main 123...");
    var fileName = 'json/diagramit-data.json';
    loadJSON(function (response) {
        var prepResp = [];
        var diagramitData = JSON.parse(response);
        for(var i = 0; i < srcURIs.length; i++){
            var assocResp = jsonPath(diagramitData, "$.associations[?(@.source==\"" + srcURIs[i] + "\")].target");
            for(var j = 0; j < assocResp.length; j++) {
                if(assocResp[j].indexOf('/dts/') != -1){
                    var compResponse = jsonPath(diagramitData, "$.components[?(@.properties.url==\""+assocResp[j]+"\")].properties.traceableClass");
                    console.log({'dpsUri' : srcURIs[i], 'dtsUri': assocResp[j], 'invoker': compResponse[0]});
                    prepResp.push({'dpsUri' : srcURIs[i], 'dtsUri': assocResp[j], 'invoker': compResponse[0]});
                }
            }
        }
        console.log('Prepared Resp size: ' + prepResp.length);
    });
}

function threadPoolScript() {
    console.log('Loading thread pool script')
    var fileName = 'json/DPS_Inv.json';
    var threadPool  = 'portfolio.clients';
    loadJSON(function (response) {
        var prepareResp = [];
        var diagramitData = JSON.parse(response);
        var assoc = jsonPath(diagramitData, "$.associations[?(@.properties.threadPool==\"" + threadPool + "\")]");
        for(var i = 0; i < assoc.length; i++) {
            prepareResp.push({
                'source': assoc.source,
                'target': assoc.target
            })
        }
        console.log(assoc);
    });
}

function markitToken() {
    console.log('Loading thread pool script')
    var fileName = 'json/response_1597150160204.json';
    loadJSON(function (response) {
        var prepareResp = [];
        var diagramitData = JSON.parse(response);
        // var component = jsonPath(diagramitData, "$.components[?(@.properties.*.spl==\"" + threadPool + "\")]");
        for(var i = 0; i < diagramitData.components.length; i++) {
            var stats = jsonPath(diagramitData.components[i], "$.properties.[*].splunkStats");
            prepareResp.push({
                'date': stats.sampleTime,
                'success': stats.successCount,
                'fail': stats.failCount,
                'total': stats.failCount + stats.successCount
            })
        }
        console.log(prepareResp);
    });
}

function loadJSON(callback) {
    // var fileName = 'json/DPS_Inv.json';
    var fileName = 'json/response_1597150160204.json';
    // var fileName = 'diagramit-data.json';
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET',fileName,true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

// JSON.path($.components[?(@)].key)
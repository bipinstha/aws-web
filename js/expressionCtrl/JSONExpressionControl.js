'use strict';

let $jsonExpressionControl = (function() {

    let HTML_FILE_NAME = 'js/expressionCtrl/JSONExpressionControl.html';
    let container = document.getElementById('content');
    function loadControls() {
        $uiControls.loadHTMLFile(HTML_FILE_NAME, null, function (response){
            container.innerHTML = response;
        });
    }

    function loadFilteredJSONOutput() {
        let jsonExpression = document.getElementById('jsonExpression').value;
        console.log(jsonExpression);
        let inputJsonContent = JSON.parse(document.getElementById('beautifiedResponse').value);
        let textArea = document.getElementById('afterAppliedExpression');
        textArea.value = '';
        textArea.style.fontSize = '12px';
        let filteredWhiteboard = jsonPath(inputJsonContent, jsonExpression);
        textArea.value = JSON.stringify(filteredWhiteboard, undefined, 4);
        // $uiControls.removeAllChildNode(textArea);
        // textArea.appendChild(renderjson.set_show_by_default(true)(filteredWhiteboard));
    }

    function displayExpressionAutoComplete() {
        // TODO generate possible expressions and display as autocomplete.
        // let jsonExpression = document.getElementById('jsonExpression').value;
    }

    function onAddJsonValue() {
        let inputArea = document.getElementById('beautifiedResponse');
        let inputValue = inputArea.value;
        console.log(inputValue)
    }

    return {
        init : function () {
            loadControls();
        },

        onExpressionChange: function () {
            loadFilteredJSONOutput();
            displayExpressionAutoComplete();
        },

        onAddJsonValue: function () {
            onAddJsonValue();
        }
    }
})();
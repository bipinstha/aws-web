'use strict';

let $routeControl = (function() {
    let currentPage = document.URL.split('#')[1];

    function getCurrentPage() {

        switch(currentPage) {
            case '/dashboard':
                $mainControl.init();
                break;
            case '/jsonPathExpression':
                $jsonExpressionControl.init();
                break;
            case '/csvToJSON':
                $csvToJsonControl.init();
                break;
            case '/regex101':
                new Regex101Control().init();
                break;
            default:
                $mainControl.init();
        }
    }

    return {
        init: function() {
            getCurrentPage();
        },

        currentNavPage() {
            // clean content div for new content
            $uiControls.removeAllChildNode(document.getElementById('content'));
            // find the current url location
            currentPage = document.URL.split('#')[1];
            getCurrentPage();

        }
    };
})();
$routeControl.init();

window.onhashchange = function() {
    $routeControl.currentNavPage();
};
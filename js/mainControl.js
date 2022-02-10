'use strict';

var $mainControl = (function() {

    var $content = document.getElementById('content');

    function loadControls() {
        console.log('initialize main controls')
        var bannerDiv = document.createElement('div');

        var bannerHeading = document.createElement('h1');
        bannerHeading.innerHTML = 'Control Dashboard';
        bannerDiv.appendChild(bannerHeading);

        // $content.appendChild(bannerDiv);
        $content.append(bannerDiv);
    }

    return {
        init : function () {
            loadControls();
        }
    }
})();
'use strict';

let $uiControls = (function() {

    let $menuDiv = document.querySelector('#menu'),
        $msgDiv = document.querySelector('#message'),
        $menuControl, $layoutControl;
    let menuItems = [
        {
            'page': 'Dashboard',
            'link': '#/dashboard'
        },
        {
            'page': 'JSON Path Expression',
            'link': '#/jsonPathExpression'
        },
        {
            'page': 'CSV to JSON',
            'link': '#/csvToJSON'
        },
        {
            'page': 'Regex 101',
            'link': '#/regex101'
        },
        {
            'page': 'Fourth Menu Item',
            'link': '#/fourthMenuItem'
        },
        {
            'page': 'Fifth Menu Item',
            'link': '#/fifthMenuItem'
        }];

    function createMenuControl() {
        $menuControl = document.createElement('nav');
        $menuControl.className = 'navbar navbar-expand-md navbar-dark bg-dark';
        $menuDiv.appendChild($menuControl);

        let indexPage = document.createElement('a');
        indexPage.className = 'navbar-brand';
        indexPage.href = menuItems[0].link;
        indexPage.innerHTML = menuItems[0].page;
        // indexPage.onclick = $routeControl.currentNavPage;

        $menuControl.appendChild(indexPage);
        let menuButton = document.createElement('button');
        menuButton.className = 'navbar-toggler';
        menuButton.type = 'button';
        menuButton.setAttribute('data-toggle', 'collapse');
        menuButton.setAttribute('data-target', '#navbarCollapse');
        menuButton.setAttribute('aria-controls', 'navbarCollapse');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Toggle navigation');
        let menuBtnSpan = document.createElement('span');
        menuBtnSpan.className = 'navbar-toggler-icon';
        menuButton.appendChild(menuBtnSpan);
        $menuControl.appendChild(menuButton);

        let navDivCollapse = document.createElement('div');
        navDivCollapse.className = 'collapse navbar-collapse';
        navDivCollapse.id = 'navbarCollapse';

        let navUL = document.createElement('ul');
        navUL.className = 'navbar-nav mr-auto';
        for(let i = 1; i < menuItems.length; i++) {
            let navList = document.createElement('li');
            navList.className = 'nav-item';
            let navListAnchor = document.createElement('a');
            navListAnchor.className = 'nav-link';
            navListAnchor.href = menuItems[i].link;
            navListAnchor.innerHTML = menuItems[i].page;
            // navListAnchor.onclick = $routeControl.currentNavPage;
            navList.appendChild(navListAnchor);
            navUL.appendChild(navList);
        }

        navDivCollapse.appendChild(navUL);
        $menuControl.appendChild(navDivCollapse);

    };

    function createLayoutControl() {
        $layoutControl = document.createElement('div')
    }

    function createLoadingSpinner() {
        let spinnerDiv = document.createElement('div');
        spinnerDiv.classList = 'spinner-border text-success';
        spinnerDiv.role = 'status';

        let spinnerSpan = document.createElement('span');
        spinnerSpan.classList = 'sr-only';
        spinnerSpan.innerText = 'Loading...';
        spinnerDiv.appendChild(spinnerSpan);
        $msgDiv.classList = 'text-center hide';
        $msgDiv.appendChild(spinnerDiv);

    }

    function loadHTML(urlPath, requestHeader, callback) {
        let xObj = new XMLHttpRequest();
        xObj.overrideMimeType("plain/text");
        xObj.callback = callback
        xObj.open('GET', urlPath);
        if(requestHeader) {
            Object.keys(requestHeader).forEach(key => {
                xObj.setRequestHeader(key, requestHeader[key])
            });
        }
        xObj.onload = handleResponse;
        xObj.send();
    }

    function handleResponse (request) {
        if (request.target.status == 200) {
            let response = request.target.response;
           request.target.callback(response)
        } else {
            $uiControls.displayErrorMsg(request)
        }
    }

    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    return {
        init: function () {
            console.log('menu control init');
            createMenuControl();
            createLoadingSpinner();
        },

        removeAllChildNode: function (parentNode) {
            removeAllChildNodes(parentNode);
        },

        loadHTMLFile: function(qualifiedFileName, requestHeader, callBack) {
            loadHTML(qualifiedFileName, requestHeader, callBack);
        },

        startLoadingSpinner: function() {
            console.log('start spinner invoked');
            $msgDiv.classList.remove('hide');
        },

        stopLoadingSpinner: function() {
            console.log('stop spinner invoked');
            $msgDiv.classList.add('hide');
        },

        displayErrorMsg: function(msg) {
            //$uiControls.stopLoadingSpinner();
            // TODO display error message in status bar
            console.log('log error msg: ' + msg);
        }

    };

})();

$uiControls.init();
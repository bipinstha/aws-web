'use strict';

let $whiteboardControl = (function() {

    let HTML_FILE_NAME = 'js/whiteboardCtrl/whiteboardControl.html';
    let $content = document.getElementById('content');
    let selectedSource;
    let sourceList = [];
    let sourceVersionList = [];
    let sourceWhiteboard = {};

    function loadControls() {
        let sourceEl;
        $uiControls.loadHTMLFile(HTML_FILE_NAME, function (response){
            $content.innerHTML = response;
            sourceEl = document.getElementById("sourceId");
        });
        fetchAllSourceIds(sourceEl);
    }

    function fetchAllContext(sourceEl) {
        $minerva.fetchAllContext(function (contextList) {
            sourceEl = document.getElementById("sourceId");
            if(contextList){
                let contextLst = JSON.parse(contextList);
                let contexts = contextLst.map(function (context) {
                    return context.contextId;
                });
                sourceList.length = 0;
                sourceList.push(... contexts);
                autocomplete(sourceEl, contexts);
            }
        });
    }

    function fetchAllSourceIds(sourceEl) {
        $minerva.fetchAllSourceIds(function (sourceIdList) {
            sourceEl = document.getElementById("sourceId");
            if(sourceIdList){
                sourceList.length = 0;
                sourceList.push(... JSON.parse(sourceIdList));
                autocomplete(sourceEl, JSON.parse(sourceIdList));
            }
        });
    }

    function loadSourceVersions(sourceId) {
        console.log('outside callback ' + sourceId);
        $minerva.fetchVersionBySourceId(sourceId, function(response) {
            console.log('inside callback ' + sourceId);
            // console.log(response)
            if(response){
                let srcVersionLst = JSON.parse(response);
                sourceVersionList = [];
                sourceVersionList.length = 0;
                sourceVersionList.push(... srcVersionLst);
                let versionList = srcVersionLst.map(function (item) {
                    return item.versionId;
                });

                let isVersionRangeSelected = document.getElementById('versionRange').checked;
                if(isVersionRangeSelected) {
                    let startVersion = document.getElementById('startVersion');
                    autocomplete(startVersion, versionList);

                    let endVersion = document.getElementById('endVersion');
                    autocomplete(endVersion, versionList);
                } else {
                    let version = document.getElementById('version');
                    autocomplete(version, versionList);
                }

            }
        });
    }

    function loadVersionRangeWhiteboard (sourceId, startVersion, endVersion, entityKey) {
        // console.log('fetch response from versioned whiteboard')
        $minerva.fetchBySrcVersionRange(sourceId, startVersion, endVersion, entityKey, function(response) {
            if(response) {
                let beautifiedResp = JSON.parse(response);
                sourceWhiteboard = beautifiedResp;
                let textArea = document.getElementById('beautifiedResponse');
                textArea.style.fontSize = '12px';
                // textArea.value = JSON.stringify(beautifiedResp, undefined, 4);
                $uiControls.removeAllChildNode(textArea);
                textArea.appendChild(renderjson.set_show_by_default(true)(beautifiedResp));
            }
        })
    }

    function loadVersionedWhiteboard (sourceId, version) {
        // console.log('fetch response from versioned whiteboard')
        $minerva.fetchBySrcVersion(sourceId, version, function(response) {
            if(response) {
                let beautifiedResp = JSON.parse(response);
                sourceWhiteboard = beautifiedResp;
                let textArea = document.getElementById('beautifiedResponse');
                textArea.style.fontSize = '12px';
                // textArea.value = JSON.stringify(beautifiedResp, undefined, 4);
                $uiControls.removeAllChildNode(textArea);
                textArea.appendChild(renderjson.set_show_by_default(true)(beautifiedResp));
            }
        });
    }

    function loadFilteredWhiteboard(jsonExp) {
        let textArea = document.getElementById('afterAppliedExpression');
        textArea.value = '';
        textArea.style.fontSize = '12px';
        let filteredWhiteboard = jsonPath(sourceWhiteboard, jsonExp);
        textArea.value = JSON.stringify(filteredWhiteboard, undefined, 4);
        // $uiControls.removeAllChildNode(textArea);
        // textArea.appendChild(renderjson.set_show_by_default(true)(filteredWhiteboard));
    }

    function onSelectContext(source) {
        $minerva.fetchByContextId(source, function(response) {
            if(response) {
                let beautifiedResp = JSON.parse(response);
                sourceWhiteboard = beautifiedResp;
                let textArea = document.getElementById('beautifiedResponse');
                textArea.style.fontSize = '12px';
                // textArea.value = JSON.stringify(beautifiedResp, undefined, 4);
                $uiControls.removeAllChildNode(textArea);
                textArea.appendChild(renderjson.set_show_by_default(true)(beautifiedResp));
            }
        })
    }

    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        let currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            let a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].toUpperCase().includes(val.toUpperCase())) {
                    // if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = arr[i].replace(val, "<strong>" + val + "</strong>");
                    // b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    // b.innerHTML += arr[i].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                        handleAutoComplete();
                    });
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            let x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (let i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            let x = document.getElementsByClassName("autocomplete-items");
            for (let i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    function handleAutoComplete() {
        let sourceSelected = document.getElementById('sourceSelect').value;
        let sourceId = document.getElementById('sourceId').value;
        if(sourceSelected == 'context') {
            $whiteboardControl.onSelectContext(sourceId);
        } else {
            let isVersionRangeSelected = document.getElementById('versionRange').checked;
            if (isVersionRangeSelected) {
                // if source changed
                if (selectedSource != sourceId) {
                    document.getElementById('startVersion').value = '';
                    document.getElementById('endVersion').value = '';
                }

                let startVersion = document.getElementById('startVersion').value;
                let endVersion = document.getElementById('endVersion').value;

                if (sourceId && !startVersion && !endVersion) {
                    // console.log('source Id only')
                    $whiteboardControl.onSourceIdChange();
                }

                if (sourceId && startVersion && !endVersion) {
                    // console.log('source Id and startversion')
                    $whiteboardControl.onStartVersionChange();
                }

                if (sourceId && startVersion && endVersion) {
                    // console.log('source id start version and end version')
                    $whiteboardControl.onEndVersionChange();
                }
            } else {
                if (selectedSource != sourceId) {
                    document.getElementById('version').value = '';
                }

                let version = document.getElementById('version').value;

                if (sourceId && !version) {
                    $whiteboardControl.onSourceIdChange();
                }

                if (sourceId && version) {
                    $whiteboardControl.onVersionSelect();
                }
            }
        }
        // console.log('sourceId :' + sourceId);
        // console.log('startVersion: ' + startVersion);
        // console.log('endVersion: ' + endVersion);
    }

    return {
        init : function () {
            loadControls();
        },

        onSourceIdChange: function () {
           let selectedSourceId = document.getElementById('sourceId').value;
           let found = sourceList.find(item => item === selectedSourceId);
           console.log('found source id: ' + found);
           if(found){
               selectedSource = selectedSourceId;
               loadSourceVersions(selectedSourceId)
           }
        },

        onStartVersionChange: function () {
            // let startVersionValue = document.getElementById('startVersion').value;
            // let endVersionLst = sourceVersionList.map(function(item) {
            //     if(item.versionId > startVersionValue) return item.versionId;
            // })
            // let endVersion = document.getElementById('endVersion');
            // autocomplete(endVersion, endVersionLst);
        },

        onEndVersionChange: function () {
            let sourceId = document.getElementById('sourceId').value;
            let startVersion = document.getElementById('startVersion').value;
            let endVersion = document.getElementById('endVersion').value;
            let sourceFound = sourceList.find(item => item === sourceId);
            let startVerFound = sourceVersionList.find(item => item.versionId === startVersion);
            let endVerFound = sourceVersionList.find(item => item.versionId === endVersion);
            if(sourceFound && startVerFound && endVerFound) {
                loadVersionRangeWhiteboard(sourceId, startVersion, endVersion, '');
                document.getElementById('jsonExpression').value = '';
            }
        },

        onVersionSelect: function () {
            let sourceId = document.getElementById('sourceId').value;
            let version = document.getElementById('version').value;
            let sourceFound = sourceList.find(item => item === sourceId);
            let versionFound = sourceVersionList.find(item => item.versionId === version);
            if(sourceFound && versionFound) {
                loadVersionedWhiteboard(sourceId, version, '');
                document.getElementById('jsonExpression').value = '';
            }

        },

        onExpressionChange: function () {
            let jsonExpression = document.getElementById('jsonExpression').value;
            console.log(jsonExpression);
            if(jsonExpression) {
                loadFilteredWhiteboard(jsonExpression);
            }
        },

        onVersionRangeChange: function () {
            let isSelectVersionRange = document.getElementById('versionRange').checked;
            let vrElem = document.getElementsByClassName('version-range');
            let singleVerElem = document.getElementById('version');
            for(let i = 0; i < vrElem.length; i++) {
                if(isSelectVersionRange) {
                    vrElem[i].classList.remove('hide');
                    singleVerElem.parentElement.classList.add('hide');
                } else {
                    vrElem[i].classList.add('hide');
                    singleVerElem.parentElement.classList.remove('hide');
                }
            }

            // clean the values and trigger toggle change
            handleAutoComplete();
        },

        onSourceSelectChange: function () {
            let sourceSelection = document.getElementById('sourceSelect').value;
            let sourceEl = document.getElementById('sourceId');
            sourceEl.value = '';
            console.log(sourceSelection);
            if(sourceSelection == 'context') {
                fetchAllContext(sourceEl)
            } else {
                fetchAllSourceIds(sourceEl);
            }
        },

        onSelectContext: function (source) {
            onSelectContext(source);
        }
    }
})();
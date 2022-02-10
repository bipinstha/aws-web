'use strict';

let $csvToJsonControl = (function() {

    let HTML_FILE_NAME = 'js/csvToJSONCtrl/csvToJSONControl.html';
    let $content = document.getElementById('content');
    let outputWhiteboard = {};

    async function loadControls() {
        // $content.innerText = await fetchHtmlAsText(HTML_FILE_NAME);
        $uiControls.loadHTMLFile(HTML_FILE_NAME, function (response){
            $content.innerHTML = response;
        });
    }

    // async function fetchHtmlAsText(url) {
    //     let response =  await fetch(url);
    //     return  await response.text();
    // }

    function uploadCSVFile(file) {
        let fileName = file.name;
        let fr = new FileReader();
        fr.readAsText(file, 'utf-8');
        fr.onload = function() {
            let components = [];
            let csvRawData = fr.result;
            let csvRawArray = csvRawData.split('\n');
            let headerRawArray = csvRawArray[0];
            for(let i = 1; i < csvRawArray.length; i ++) {
                let component = {};
                component.properties = {};
                let csvRawArrayInArray = csvRawArray[i].split(',');
                let headerSplitArray = headerRawArray.split(',');
                for(let j = 0; j < headerSplitArray.length; j++) {
                    if(headerSplitArray[j].includes('properties')) {
                        component.properties[headerSplitArray[j].split('.')[1]] = csvRawArrayInArray[j];
                    } else {
                        component[headerSplitArray[j]] = csvRawArrayInArray[j];
                    }
                }
                components.push(component);
            }
            outputWhiteboard.components = components;
            loadOutputOnUI();
        };
    }

    function loadOutputOnUI() {
        console.log(outputWhiteboard)
        let textArea = document.getElementById('beautifiedResponse');
        textArea.style.fontSize = '12px';
        $uiControls.removeAllChildNode(textArea);
        textArea.appendChild(renderjson.set_show_by_default(true)(outputWhiteboard));
        let rawTextArea = document.getElementById('rawResponse');
        rawTextArea.style.fontSize = '12px';
        $uiControls.removeAllChildNode(rawTextArea);
        rawTextArea.innerText = JSON.stringify(outputWhiteboard, undefined, 4)
    }

    return {
        init: function () {
            loadControls();
        },

        onSubmitCsvFile: function () {
            console.log('submit clicked')
            let sourceId = document.getElementById('sourceId').value;
            let version = document.getElementById('version').value;
            outputWhiteboard.sourceId = sourceId;
            outputWhiteboard.version = version;
            console.log(outputWhiteboard);
            try {
                let uploadedFile = document.getElementById("uploadFile").files[0];
                let fileName = uploadedFile.name;
                //validate csv or json format data
                if(fileName.split(".")[1] === 'csv') {
                    uploadCSVFile(uploadedFile);
                } else {
                    let msg = 'Invalid file format. Only CSV format supported.';
                    $uiControls.displayErrorMsg(msg);
                    return;
                }
            } catch (e) {
                $uiControls.displayErrorMsg(e.toString());
            }
        }
    }

})();
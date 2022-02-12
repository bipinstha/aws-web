'use strict';

let Regex101Control = (function() {
    let FILE_LOC = 'https://regex101.com/';
    let $content = document.getElementById('content');

    function onLoadPage() {

        /***
         * accept-encoding: gzip, deflate, br
         accept-language: en-US,en;q=0.9
         cache-control: no-cache
         cookie: _ga=GA1.2.593375373.1644520467; _gid=GA1.2.1597499848.1644520467
         pragma: no-cache
         referer: https://www.google.com/
         sec-ch-ua: " Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"
         sec-ch-ua-mobile: ?0
         sec-ch-ua-platform: "macOS"
         sec-fetch-dest: document
         sec-fetch-mode: navigate
         sec-fetch-site: same-origin
         sec-fetch-user: ?1
         upgrade-insecure-requests: 1
         user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36
         *
         * */
        let requestHeader = {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            // 'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            // 'cookie': '_ga=GA1.2.593375373.1644520467; _gid=GA1.2.1597499848.1644520467',
            'pragma': 'no-cache',
            // 'referer': 'https://www.google.com/',
            // 'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"'
        };
        $uiControls.loadHTMLFile(FILE_LOC, requestHeader, function (response){
        
            $content.innerHTML = response;
        });

        // var iframe = document.createElement('iframe');
        // var html = FILE_LOC;
        // document.body.appendChild(iframe);
        // iframe.contentWindow.document.open();
        // iframe.contentWindow.document.write(html);
        // iframe.contentWindow.document.close();
    }


    return {
        init() {
            console.log(window.document.referrer)
            delete window.document.referrer;
            window.document.__defineGetter__('referrer', function () {
                return "https://www.google.com/";
            });
            onLoadPage();
            
        }

    }
})
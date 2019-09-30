# BuildVu JavaScript Client #

Convert PDF to HTML5 or SVG with JavaScript, using the BuildVu JavaScript Client to interact with IDRsolutions' [BuildVu Microservice Example](https://github.com/idrsolutions/buildvu-microservice-example).

The BuildVu Microservice Example is an open source project that allows you to convert PDF to HTML5 or SVG by running [BuildVu](https://www.idrsolutions.com/buildvu/) as an online service. 

IDRsolutions offer a free trial service for running BuildVu with JavaScript, more infomation on this can be found [here](https://www.idrsolutions.com/buildvu/convert-pdf-in-javascript/).


-----

# Installation

```
<script src="path/to/buildvu-client.js" type="text/javascript"></script>
```

-----

# Usage #

```javascript
var endpoint = "http://localhost:8080/buildvu-microservice/";

//Convert the attached file
var file = document.getElementById('file-input').files[0];
//Convert file from url (file takes precedence over this option).
var url = document.getElementById('url-input').value;

//Upload is used when a file uploaded to the server
//Download is used when the server downloads from the url
var input = file ? BuildVuClient.UPLOAD : BuildVuClient.DOWNLOAD;

BuildVuClient.convert({
    endpoint: endpoint,
    //Parameters are the API parameters that will be sent to the server
    //See https://github.com/idrsolutions/buildvu-microservice-example/blob/master/API.md
    parameters: {
        input: input,
        file: file,
        url: url
    },
    progress: function() { },
    success: function(e) {
        console.log("Converted " + e.downloadUrl);
    },
    failure: function() { }
});
```

-----

# Who do I talk to? #

Found a bug, or have a suggestion / improvement? Let us know through the Issues page.

Got questions? You can contact us [here](https://idrsolutions.zendesk.com/hc/en-us/requests/new).

-----

Copyright 2018 IDRsolutions

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

# BuildVu JavaScript Client #

The BuildVu JavaScript Client provides an easy way to try out IDRsolutions' [BuildVu Microservice Example](https://github.com/idrsolutions/buildvu-microservice-example).

It functions as an easy to use library that lets you use [BuildVu](https://www.idrsolutions.com/buildvu/) from JavaScript.

-----

# Installation

```
<script src="path/to/buildvu-client.js" type="text/javascript"></script>
```

-----

# Usage #

```
var endpoint = "http://localhost:8080/microservice-example/buildvu";

var file = document.getElementById('file-input').files[0];

if (file.name) {
    BuildVuClient.convert({
        endpoint: endpoint,
        // Upload local file.
        file: file,
        // Convert file from url (file takes precedence over this option, so remove file if you wish to use this option).
        conversionUrl: "http://path.to/file.pdf",
        // (Optional) the filename you wish to pass to the server.
        filename: "myCustomFilename.pdf",
        failure: function() { },
        progress: function() { },
        success: function(e) {
            console.log("Converted " + e.previewUrl);
        }
    });
}
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

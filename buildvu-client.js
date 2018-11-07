/*
 * Copyright 2018 IDRsolutions
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
    window.BuildVuClient = (function() {

        var progress, success, failure;

        var doPoll = function(uuid, endpoint) {
            var req, retries = 0;

            var poll = setInterval(function () {
                if (!req) {
                    req = new XMLHttpRequest();
                    req.onreadystatechange = function (e) {
                        if (req.readyState === 4) {
                            if (req.status === 200) {
                                var data = JSON.parse(req.responseText);
                                if (data.state === "processed") {
                                    clearInterval(poll);
                                    if (success) {
                                        success(data);
                                    }
                                } else {
                                    if (progress) {
                                        progress(data);
                                    }
                                }
                            } else {
                                retries++;
                                if (retries > 3) {
                                    clearInterval(poll);
                                    if (failure) {
                                        failure("Connection error");
                                    }
                                }
                            }
                            req = null;
                        }
                    };
                    req.open("GET", endpoint + "?uuid=" + uuid, true);
                    req.send();
                }
            }, 500);
        };

        return {
            convert: function(params) {

                var isUrlInput;

                if (!params.endpoint) {
                    throw Error('Missing endpoint');
                }
                if (params.file && params.file.name) {
                    isUrlInput = false;
                } else if (params.conversionUrl) {
                    isUrlInput = true;
                } else {
                    throw Error('Missing file');
                }
                if (params.success && typeof params.success === "function") {
                    success = params.success;
                }
                if (params.failure && typeof params.failure === "function") {
                    failure = params.failure;
                }
                if (params.progress && typeof params.progress === "function") {
                    progress = params.progress;
                }

                var xhr = new XMLHttpRequest();
                if (xhr.upload) {
                    xhr.upload.addEventListener("progress", function(e) {
                        if (progress && !isUrlInput) {
                            progress({
                                state: 'uploading',
                                loaded: e.loaded,
                                total: e.total
                            });
                        }
                    }, false);

                    xhr.onreadystatechange = function (e) {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200 && !params.callbackUrl) {
                                doPoll(JSON.parse(xhr.responseText).uuid, params.endpoint);
                            } else if (params.callbackUrl) {
                                progress({
                                    state: 'uploaded',
                                    uuid: JSON.parse(xhr.responseText).uuid
                                })
                                console.log();
                            } else {
                                if (failure) {
                                  console.log(e);
                                    failure("Connection error");
                                }
                            }
                        }
                    };

                    xhr.open("POST", params.endpoint, true);
                    var data = new FormData();

                    if (isUrlInput) {
                        data.append('input', 'download');
                        data.append("url", params.conversionUrl);
                    } else {
                        data.append('input', 'upload');
                        data.append('file', params.file);
                    }
					
					if (params.callbackUrl) {
						data.append('callbackUrl', params.callbackUrl);
					}

                    console.log(data);

                    if (params.parameters) {
                        for (var prop in params.parameters) {
                            if (params.parameters.hasOwnProperty(prop)) {
                                data.append(prop, params.parameters[prop]);
                            }
                        }
                    }
                    xhr.send(data);
                }
            }
        }
    })();

})();

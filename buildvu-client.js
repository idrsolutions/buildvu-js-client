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

(function () {
    window.BuildVuClient = (function () {

        var progress, success, failure, username, password;

        var doPoll = function (uuid, endpoint) {
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
                                        failure("Connection error while polling status.");
                                    }
                                }
                            }
                            req = null;
                        }
                    };

                    req.open("GET", endpoint + "buildvu" + "?uuid=" + uuid , true);

                    if (username && password) {
                        req.withCredentials = true;
                        req.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
                    }

                    req.send();
                }
            }, 500);
        };

        return {
            UPLOAD: 'upload',
            DOWNLOAD: 'download',
            convert: function (params) {

                if (!params.endpoint) {
                    throw Error('Missing endpoint');
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
                    xhr.upload.addEventListener("progress", function (e) {
                        if (progress) {
                            progress({
                                state: 'uploading',
                                loaded: e.loaded,
                                total: e.total
                            });
                        }
                    }, false);

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                if (!params.parameters.callbackUrl || progress || success) {
                                    doPoll(JSON.parse(xhr.responseText).uuid, params.endpoint);
                                }
                            } else {
                                if (failure) {
                                    try {
                                        var parsedResponse = JSON.parse(xhr.responseText);
                                        if (parsedResponse.hasOwnProperty("error")) {
                                            failure(parsedResponse.error);
                                        } else {
                                            failure("Connection error. Status: " + xhr.status + ". Response: " + xhr.responseText);
                                        }
                                    } catch (e) {
                                        failure("Connection error. Status: " + xhr.status + ". Response: " + xhr.responseText);
                                    }
                                }
                            }
                        }
                    };

                    xhr.open("POST", params.endpoint + "buildvu", true);

                    if (params.username || params.password) {
                        if (!params.username) {
                            throw Error('Password provided but username is missing');
                        } else {
                            username = params.username;
                        }

                        if (!params.password) {
                            throw Error('Username provided but password is missing');
                        } else {
                            password = params.password;
                        }

                        xhr.withCredentials = true;
                        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
                    }

                    var data = new FormData();

                    if (params.parameters) {
                        for (var prop in params.parameters) {
                            if (params.parameters.hasOwnProperty(prop) && params.parameters[prop] !== undefined) {
                                data.append(prop, params.parameters[prop]);
                            }
                        }
                    }
                    xhr.send(data);
                }
            }
        };
    })();

})();

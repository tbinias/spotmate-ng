'use strict';

import app from '../SpotMateApp.es6';

class FileReaderFactory {

    constructor($q) {
        this.$q = $q;
    }

    onLoad(reader, deferred, scope) {
        return function() {
            scope.$apply(function() {
                deferred.resolve(reader.result);
            });
        };
    }

    onError(reader, deferred, scope) {
        return function() {
            scope.$apply(function() {
                deferred.reject(reader.result);
            });
        };
    }

    onProgress(reader, scope) {
        return function(event) {
            scope.$broadcast("fileProgress", {
                total : event.total,
                loaded : event.loaded
            });
        };
    }

    getReader(deferred, scope) {
        var reader = new FileReader();
        reader.onload = this.onLoad(reader, deferred, scope);
        reader.onerror = this.onError(reader, deferred, scope);
        reader.onprogress = this.onProgress(reader, scope);
        return reader;
    }

    readAsDataUrl(file, scope) {
        var deferred = this.$q.defer();

        var reader = this.getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    }

    static createInstance($q) {
        return {
            readAsDataUrl: new FileReaderFactory($q).readAsDataUrl
        }
    }

}

app.factory("FileReader", [ "$q", FileReaderFactory.createInstance]);

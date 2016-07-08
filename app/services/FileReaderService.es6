'use strict';

import app from '../SpotMateApp.es6';

class FileReaderService {

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

        if (file != null) {
            var reader = this.getReader(deferred, scope);
            reader.readAsDataURL(file);
        } else {
            deferred.reject();
        }

        return deferred.promise;
    }
}

app.service("FileReaderService", [ "$q", FileReaderService]);

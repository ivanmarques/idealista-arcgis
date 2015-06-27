'use strict';
angular.module('idealista-arcgis')
    .service('IdealistaService', function($q, $http){
        var self = this;
        this.endPoint = "http://idealista-prod.apigee.net/public/2/search";
        this.sanitizeResults = function(result, currentResults){
            var i,
            len = result.elementList.length,
            el = result.elementList;

            for(i=0; i<len; i++) {
                //Antes de añadir un nuevo punto al array comprobamos que no exista
                if(lodash.where(currentResults,{url:el[i].url}).length == 0) {
                    currentResults.push(el[i]);
                }
            }
            return currentResults;
        };

        // Método para lanzar la búsqueda sobre un punto a la API de Idealista
        this.endpointRequest = function(point, params) {
            var lat = point.lat;
            var lon = point.lon;

            // Establecemos la localización el radio de la búsqueda
            $GEO.params.noSmokers = params.noSmokers;
            $GEO.params.sex = params.sex;
            $GEO.params.operation = params.operation;
            $GEO.params.order = params.order;
            $GEO.params.pictures = params.pictures;
            $GEO.params.propertyType = params.propertyType;
            $GEO.params.center = lat + "," + lon;
            $GEO.params.distance = point.radius;


            var req = {
                method: 'GET',
                url: this.endPoint,
                params: $GEO.params
            }

            // Lanzamos la petición
            var deferred = $q.defer();
            $http(req)
                .success(function(data, status, headers, config){
                    console.log("ENDPOINTREQUEST SUCCESS");
                    console.dir(data);
                    console.dir(status);
                    console.dir(headers);
                    console.dir(config);
                    var results = self.processResults(point.poiId,data);
                    deferred.resolve(results);
                })
                .error(function(data, status, headers, config){
                    console.log("Ha habido un error: "+ e);
                    console.dir(data);
                    console.dir(status);
                    console.dir(headers);
                    console.dir(config);
                    deferred.reject("Error en la petición");
                });

            // Devolvemos la promesa devuelta por el método esriRequest.
            // Más info sobre las prromesas y el objetos Deferred: http://bit.ly/1cKr1lR
            return deferred.promise;
        };

        this.processResults = function(poiId,data) {
            console.warn("PROCESS RESULTS");
            console.dir(data);
            var len = data.elementList.length;
            while(--len >= 0){
                data.elementList[len].poiId = poiId;
            }
            return data.elementList;
        };
    });

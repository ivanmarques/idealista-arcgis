'use strict';
angular.module('idealista-arcgis')
    .service('IdealistaService', function($q, $http, lodash){
        var self = this;
        this.endPoint = "http://idealista-prod.apigee.net/public/2/search";
        this.sanitizeResults = function(result, currentResults){
            var i,
            len = result.elementList.length,
            el = result.elementList;

            for(i=0; i<len; i++) {
                //Antes de añadir un nuevo punto al array comprobamos que no exista
                if(lodash.where(currentResults,{url:el[i].url}).length === 0) {
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
            };

            // Lanzamos la petición
            var deferred = $q.defer();
            $http(req)
                .success(function(data){
                    console.log(point);
                    var results = self.processResults(point.id,data);
                    deferred.resolve(results);
                })
                .error(function(){
                    deferred.reject("Error en la petición");
                });
            // Devolvemos la promesa
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

        this.joinResults = function (collection, fullCollection) {
            angular.forEach(fullCollection, function(resutlEl){
                collection = collection.concat(resutlEl);
            });
            return lodash.unique(collection,'url');
        };

        this.removePoiElements = function (collection, poiId) {
            var self = this;
            lodash.remove(collection, function(element){
                if(Array.isArray(element)){
                    self.removePoiElements(element, poiId);
                }
                return element.poiId === poiId;
            });

            //remove void arrays
            var len = collection.length;
            var toSplice = [];
            while(--len >= 0){
                if(Array.isArray(collection[len])) {
                    if(collection[len].length === 0){
                        toSplice.push(len);
                    }
                }
            }
            len = toSplice.length;
            while(--len >= 0){
                collection.splice(toSplice[len], 1);
            }
        };

        this.promiseTest = function(){
            var arr = [2,3,4,5];
            var def = $q.defer();

            setTimeout(function(){
                def.resolve({a:arr});
            },500);

            return def.promise;
        };

    });

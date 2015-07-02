angular.module('idealista-arcgis')
    .controller('MapController', function ($scope, lodash, MapService, IdealistaService, $rootScope, $q) {
        MapService.init('map');
        //Creamos el controlador (MapController)
        $scope.map = {
            center: {
                lng: -3.709,
                lat: 40.4329
            },
            zoom: 13
        };
        $scope.counter = 0;
        $scope.pois = [];

        $scope.results = [];
        $scope.waiting = false;
        $scope.loadButton = "Buscar pisos";

        // Definimos la configuración por defecto de la búsqueda
        $scope.idealista = {
            noSmokers: true,
            sex: "X",
            operation: "A",
            order: "price",
            pictures: true,
            propertyType: "bedrooms",
            pets: "false"
        };



        $scope.deletePoi = function(poiId){
            var index = lodash.findIndex($scope.pois, {id:poiId});
            if(index > -1){
                $scope.pois.splice(index,1);
                MapService.deletePoint(index);
                console.dir($scope.results);
                removePoiElements($scope.results, poiId);
                console.dir($scope.results);
            }

        };
        // Método para lanzar la búsqueda sobre todos los POIs
        $scope.search = function(){
            $scope.waiting = true;
            $scope.loadButton = "Buscando...";

            var i;
            //, totalPages = Math.min(100, firstResult.totalPages);

            var promises = [];
            var poisNum = $scope.pois.length;
            for(i=0; i<poisNum; i++)
            {
                //$GEO.params.numPage = i;
                setTimeout(function(i) {
                    promises.push(IdealistaService.endpointRequest($scope.pois[i], $scope.idealista));
                }, i*2000, i);
            }

            setTimeout(function() {
                $q.all(promises).then(function(result)
                {

                    $scope.waiting = false;
                    $scope.loadButton = "Buscar pisos";
                    var resultCollection = joinResults(lodash.cloneDeep($scope.results), result);

                    //Get different points to add to the map
                    $scope.results =resultCollection;
                },function(e){
                    alert("Ha sucedido un error al recuperar los pisos, por favor inténtalo de nuevo.");
                    $scope.waiting = false;
                    $scope.loadButton = "Buscar pisos";
                });
            },poisNum*2000);

        }
        //Broadcast Events

        $rootScope.$on('MAPClick', function(scope, mapPoint){
            var poi = {
                id: $scope.pois.length,
                lon: mapPoint.lon,
                lat: mapPoint.lat,
                radius: 1000,
                name: ""
            };
            MapService.paintPoint(mapPoint, null, poi);
            $scope.pois.push(poi);
            $scope.$apply();
        });


        function joinResults(collection, result){
            angular.forEach(result, function(resutlEl){
                collection = collection.concat(resutlEl);
            });
            return lodash.unique(collection,'url');
        }

        function removePoiElements(collection, poiId){
            lodash.remove(collection, function(element){
                return element.poiId === poiId;
            });
        }
    });
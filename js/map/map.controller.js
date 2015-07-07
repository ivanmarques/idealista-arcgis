angular.module('idealista-arcgis')
    .controller('MapController', function ($scope, lodash, MapService, IdealistaService, $rootScope, $q) {
        //inicializamos el mapa pasándole el id del elemento donde se debe pintar
        MapService.init('map');

        // Variable para cachear todos los resultados de las peticiones, aunque luego solo se muestre el resultado de joinresults
        var entireCollection = [];

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
                MapService.removePoint(index);
                IdealistaService.removePoiElements(entireCollection, poiId);
                $scope.results = [];
                makeResultArray();
                MapService.paintResults($scope.results);
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
                    entireCollection = result;
                    makeResultArray();
                    MapService.paintResults($scope.results);
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
            MapService.addPoint(mapPoint, null, poi);
            $scope.pois.push(poi);
            $scope.$apply();
        });



        function makeResultArray(){
            var resultCollection = IdealistaService.joinResults(lodash.cloneDeep($scope.results), entireCollection);
            //Get different points to add to the map
            $scope.results = resultCollection;
        }
    });
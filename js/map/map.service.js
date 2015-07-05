'use strict';


angular.module('idealista-arcgis').service('MapService', function(esriRegistry, lodash, $rootScope) {
    this.test = esriRegistry;
    var mapa, poiLayer, resultsLayer, esriGraphic, esriPoint, esriPictureMarkerSymbol, esriSimpleMarkerSymbol, evt = { click: {}};

    this.init = function (domId) {
        esriRegistry.get(domId).then(function (map) {
            //Assignar objeto mapa a variable un scope por encima para utilizarla en otros métodos
            mapa = map;
            require([
                "esri/map",
                "esri/layers/GraphicsLayer",
                "esri/geometry/Point",
                "esri/symbols/PictureMarkerSymbol",
                "esri/graphic",
                "esri/geometry/webMercatorUtils",
                "esri/Color",
                "esri/symbols/SimpleMarkerSymbol",
                "esri/renderers/SimpleRenderer",
                "esri/InfoTemplate",
                "dojo/domReady!"
            ], function (Map, GraphicsLayer, Point, PictureMarkerSymbol, Graphic,
                         webMercatorUtils, Color, SimpleMarkerSymbol,
                         SimpleRenderer, InfoTemplate) {

                esriGraphic = Graphic;
                esriPoint = Point;
                esriPictureMarkerSymbol = PictureMarkerSymbol;
                esriSimpleMarkerSymbol = SimpleMarkerSymbol;
                // Aquí creamos las capas y las metemos en la variable de entorno
                // ($scope) para poder acceder luego desde fuera de la función
                poiLayer = new GraphicsLayer();
                resultsLayer = GraphicsLayer();
                map.addLayer(poiLayer);
                map.addLayer(resultsLayer)


                esriConfig.defaults.io.proxyUrl = "/proxy";
                esriConfig.defaults.io.alwaysUseProxy = false;

                var orangeRed = new Color([238, 69, 0, 0.5]);
                $GEO.marker = new SimpleMarkerSymbol("solid", 10, null, orangeRed);
                var renderer = new SimpleRenderer($GEO.marker);
                poiLayer.setRenderer(renderer);

                // Y asociamos un pequeño modal con información extra.
                var template = new InfoTemplate(
                    "Precio: ${price}€",
                    "Dirección: ${address} <br>\
                    Planta: ${floor} <br>\
                    <img src='${thumbnail}'> <br>\
                    <a href='http://${url}' target='_blank'>Más info</a>"
                );
                poiLayer.setInfoTemplate(template);


                // Añadimos un marcados al hacer clic
                map.on('click', function (e) {
                    var point = e.mapPoint,
                    LongLat = webMercatorUtils.xyToLngLat(point.x, point.y);
                    //Use rootscope to broadcast the clicked point
                    $rootScope.$broadcast('MAPClick', {lat:LongLat[1], lon:LongLat[0]});
                });

            });

        });
    }

    this.paintPoint = function(coords, imagePath, attrs ){
        var symbol,
            loc = new esriPoint(
            coords.lon,
            coords.lat
        );
        symbol = (imagePath) ? new esriPictureMarkerSymbol(imagePath, 16, 24) : new esriPictureMarkerSymbol("img/pin.png", 16, 24);
        poiLayer.add(new esriGraphic(loc, symbol, attrs));
    };

    this.removePoint = function(i){
        poiLayer.remove(poiLayer.graphics[i]);
    };


    /*
     // Definimos un método delete(id) para eliminar un POI del mapa
     $scope.delete = function(id){
     var i = 0,
     layer = $scope.poiLayer,
     pois = $scope.pois,
     len = pois.length;

     // Recorremos el Array de POIs en busca del que queremos borrar.
     while(i <= len){
     if(pois[i].id == id){
     pois.splice(i, 1);
     layer.remove(layer.graphics[i]);
     break;
     }
     i++;
     }
     };
     */
    // Vacía la capa gráfica y pinta los resultados
    this.paintResults = function (results) {
        resultsLayer.clear();
        var len = results.length;
        while(--len >= 0){
            var loc = new esriPoint(results[len].longitude, results[len].latitude);
            resultsLayer.add(new esriGraphic(loc, $GEO.marker, results[len]));
        }
    };
});



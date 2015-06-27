// Objeto JSON con parámetros por defecto para la API de Idealista
var $GEO = $GEO || {
  params: {
    action: 'json',
    apikey: '0lVOkSbmEM5iIo7pAPFprxFUUuJUCZXU', // <- Valido para desarrolladores.esri.es
    country: "es",
    maxItems: 50,
    numPage: 1,
    distance: 1002,
    center: "40.42938099999995,-3.7097526269835726"
  }
};

// Creamos el módulo con las dependecias a
// esri.map -> Directivas creadas por Esri 
// ngSanitize -> Modulo para poder renderizar una cadena con HTML
angular.module('idealista-arcgis', ['esri.map', 'ngSanitize', 'ngLodash'])
    .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }])
  .filter('trusted', ['$sce', function ($sce) {
    // Filtro generado para poder usar variables enlazadas (bindings) en las
    // URLs de la etiquetas; como por ejemplo: <img ng-src="{{r.thumbnail}}">
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);


/**
 * Definición de Estructura Principal
 */
angular.module('mapaRecorrido',['dijkstras-service'])
    .factory('mapaService', [
        'dijkstras', '$rootScope', '$http',
        function(dijkstrasService, $rootScope, $http){

            dijkstras = dijkstrasService;
            _$rootScope = $rootScope;
            _$http = $http;

            return {
                init: init,
                getMapa: _data,
                data: _data,
                node: _node,
                edge: _edge,
                path: _path,
                events: events,
                setAnimacion: setAnimacion,
                savePositions: savePositions,
                restorePositions: restorePositions,
                remote: remote
            };
        }
    ])
;

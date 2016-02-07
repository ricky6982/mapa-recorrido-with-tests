
/**
 * Definición de Estructura Principal
 */
angular.module('mapaRecorrido',['dijkstras-service'])
    .factory('mapaService', [
        'dijkstras',
        function(dijkstrasService){
            dijkstras = dijkstrasService;
            return {
                init: init,
                getMapa: _data,
                data: _data,
                node: _node,
                edge: _edge,
                path: _path
            };
        }
    ])
;

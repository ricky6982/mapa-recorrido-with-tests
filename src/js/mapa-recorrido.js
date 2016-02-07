
/**
 * Definición de Estructura Principal
 */
angular.module('mapaRecorrido',[])
    .factory('mapaService', [
        function(){
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

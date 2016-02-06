
/**
 * Definición de Estructura Principal
 */
angular.module('mapa-recorrido',[])
    .factory('mapa-service', [
        function(){
            return {
                init: init
            };
        }
    ])
;

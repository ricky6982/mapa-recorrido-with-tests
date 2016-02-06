(function(window, angular){

/**
 * Definición de Variables y funciones
 */

function init(container){

}

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

})(window, angular);
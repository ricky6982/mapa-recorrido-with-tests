
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
                network: _network,
                getData: _data,
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
    .directive('agregarServicio',['mapaService',
        function(mapaService){
            return {
                restrict: 'E',
                templateUrl: 'template/guiAgregarServicio.tpl.html',
                replace: true,
                scope: {
                    arco: '=arco',
                    listadoServicios: '=listadoServicios',
                },
                controller: ['$scope',
                    function($scope){
                        $scope.listadoServicios.success(function(data){
                            $scope.categorias = data;
                        });

                        $scope.remove = function(direccion, index){
                            switch (direccion){
                                case 'izq': $scope.arco.lugares.izq.splice(index, 1);
                                    break;
                                case 'der': $scope.arco.lugares.der.splice(index, 1);
                                    break;
                            }
                            console.log('Eliminando localización de servicio (' + direccion + '): ' + index);
                        };

                        // $scope.agregarServicio = function(direccion){
                        //     var newItem = {
                        //         idCategoria: null,
                        //         idServicio: null,
                        //         categoria: null,
                        //         servicio: null,
                        //         distancia: null
                        //     };

                        //     if (typeof $scope.arco.lugares === "undefined") {
                        //         $scope.arco.lugares = {"izq": [], "der": []};
                        //     }

                        //     switch (direccion){
                        //         case 'izq': $scope.arco.lugares.izq.push(angular.copy(newItem));
                        //             break;
                        //         case 'der': $scope.arco.lugares.der.push(newItem);
                        //             break;
                        //     }
                        // };

                        $scope.getDireccion = function(){
                            direccion = mapaService.edge.getDirection($scope.arco);
                            if (direccion === 'horizontal') {
                                $scope.firstArrow = 'top';
                                $scope.secondArrow = 'bottom';
                            }else{
                                $scope.firstArrow = 'left';
                                $scope.secondArrow = 'right';
                            }
                            return direccion;
                        };
                    }
                ]
            };
        }
    ])
;

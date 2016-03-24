
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

    // Directiva encargada de Mostrar el arco con los servicios a agregar
    // y almacenar la información en el arco de los servicios asociados. 
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

                        $scope.agregar = function(direccion){

                            if (typeof $scope.arco.lugares === "undefined") {
                                $scope.arco.lugares = {"izq": [], "der": []};
                            }

                            switch (direccion){
                                case 'izq': $scope.arco.lugares.izq.push({});
                                    break;
                                case 'der': $scope.arco.lugares.der.push({});
                                    break;
                            }
                        };

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
    .directive('saveButton',['mapaService',
        function(mapaService){
            return{
                restrict: 'E',
                replace: true,
                templateUrl: 'template/saveButton.tpl.html',
                scope: {
                    label: '@',
                },
                controller: ['$scope',
                    function($scope){
                        $scope.flag = false;
                        $scope.submit = function(){
                            $scope.flag = true;
                            mapaService.savePositions();
                            guardando = mapaService.remote.saveMap();
                            guardando.then(
                                function(){
                                    console.log('Se guardo el mapa');
                                }, function(){
                                    console.log('No se pudo guardar el mapa.');
                                }
                            ).finally(function(){
                                    $scope.flag = false;
                            });
                        };
                    }
                ]
            };
        }
    ])
;

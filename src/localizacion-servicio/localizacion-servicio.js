(function(angular){

    angular.module('localizacionServicio', ['mapaRecorrido.templates'])
        .factory('LocalizacionServicio', [
            '$http',
            function($http){
                var urlServicios;
                getListado = function(){
                    return $http({
                        method: 'GET',
                        url: urlServicios
                    });
                };

                setUrl = function(url){
                    urlServicios = url;
                };

                return {
                    setUrl: setUrl,
                    getListado: getListado
                };
            }
        ])

        .directive('servicioSelect',[
            'LocalizacionServicio', '$filter',
            function(Localizacion, $filter){
                return {
                    restrict: 'E',
                    templateUrl: 'template/selectServicio.tpl.html',
                    replace: true,
                    scope: {
                        lugar: '=lugar',
                        direccion: '@direccion'
                    },
                    controller: ['$scope',
                        function($scope){
                            $scope.categorias = [];
                            $scope.servicios = [];

                            $scope.updateServicios = function(){
                                var result = $filter('filter')($scope.categorias, {id: $scope.lugar.idCategoria });
                                if (result.length > 0) {
                                    $scope.servicios = result[0].items;
                                }
                            };

                            $scope.updatePropiedades = function(){
                                $scope.lugar.categoria = $filter('filter')($scope.categorias, {id: $scope.lugar.idCategoria })[0].nombre;
                                $scope.lugar.servicio = $filter('filter')($scope.servicios, {id: $scope.lugar.idServicio })[0].nombre;
                            };

                            $scope.updateCategorias = function(){
                                Localizacion.getListado().then(function success(resp){
                                    $scope.categorias = resp.data;
                                    $scope.updateServicios();
                                }, function errorCallback(err){
                                });
                            };

                            if ($scope.lugar) {
                                $scope.updateCategorias();
                                $scope.updateServicios();
                            }
                        }
                    ]
                };
            }
        ])
    ;
}(angular));
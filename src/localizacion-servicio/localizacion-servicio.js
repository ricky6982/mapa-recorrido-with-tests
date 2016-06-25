(function(angular){

    angular.module('localizacionServicio', ['mapaRecorrido.templates'])
        .directive('servicioSelect',[
            '$filter',
            function($filter){
                return {
                    restrict: 'E',
                    templateUrl: 'template/selectServicio.tpl.html',
                    replace: true,
                    scope: {
                        lugar: '=lugar',
                        categorias: '=categorias',
                        direccion: '@direccion',
                        remove: '&remove'
                    },
                    controller: ['$scope',
                        function($scope){
                            $scope.servicios = $filter('filter')($scope.categorias, {id: $scope.lugar.idCategoria })[0].items;

                            $scope.updateServicios = function(){
                                var result = $filter('filter')($scope.categorias, {id: $scope.lugar.idCategoria });
                                if (result.length > 0) {
                                    $scope.servicios = result[0].items;
                                }
                            };

                            $scope.updatePropiedades = function(){
                                console.log($filter('filter')($scope.categorias, {id: $scope.lugar.idCategoria }));
                                $scope.lugar.categoria = $filter('filter')($scope.categorias, {id: $scope.lugar.idCategoria })[0].nombre;
                                $scope.lugar.servicio = $filter('filter')($scope.servicios, {id: $scope.lugar.idServicio })[0].nombre;
                            };
                        }
                    ]
                };
            }
        ])
    ;
}(angular));
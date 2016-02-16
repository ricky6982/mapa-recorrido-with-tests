var app = angular.module('app', ['mapaRecorrido', 'localizacionServicio']);

app.controller('AppCtrl', [
    '$scope',
    function($scope){
        $scope.items = [];
        $scope.crearItem = function(){
            $scope.items.push(1);
        };

        $scope.lugar = {
            idCategoria: 1,
            idServicio: 101,
            categoria: "Boleteria",
            servicio: "Balut",
            distancia: 23
        };
    }
]);
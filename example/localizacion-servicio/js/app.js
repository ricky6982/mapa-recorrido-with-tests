var app = angular.module('app', ['mapaRecorrido', 'localizacionServicio']);

app.controller('AppCtrl', [
    '$scope', 'LocalizacionServicio',
    function($scope, LocalizacionServicio){
        $scope.items = [];
        $scope.crearItem = function(){
            $scope.items.push(1);
        };

        LocalizacionServicio.setUrl('http://localhost/tesisApp/web/app_dev.php/Admin/api/servicios.json');

        $scope.lugar = {
            idCategoria: 1,
            idServicio: 101,
            categoria: "Boleteria",
            servicio: "Balut",
            distancia: 23
        };
    }
]);
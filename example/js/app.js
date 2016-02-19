// var app = angular.module('app', []);

var app = angular.module('app', ['mapaRecorrido', 'localizacionServicio']);

app.controller('AppCtrl', [
    '$scope', '$http', 'mapaService', '$timeout',
    function($scope, $http, mapa, $timeout){
        urlListadoServicios = "http://localhost/tesisApp/web/app_dev.php/Admin/api/servicios.json";
        mapa.init(document.getElementById('network_vis'));
        $scope.arcoSeleccionado = {};
        $scope.nodoSeleccionado = {};

        $scope.listadoServicios = $http({
            method: 'GET',
            url: urlListadoServicios
        });

        mapa.remote.setUrlMap("http://localhost/mapa-recorrido/example/mapa.json");
        mapa.remote.getMap();
        mapa.remote.setUrlSave('http://localhost/tesisApp/web/app_dev.php/Admin/MapaDeRecorridos/save');

        var n = 100;
        $scope.toggleAnimacion = function(){
            mapa.setAnimacion($scope.animacion);
        };
        $scope.agregarNodo = function(){
            mapa.node.add({id: n, label: 'N-'+n});
        };

        $scope.guardarPosicion = function(){
            mapa.savePositions();
        };

        $scope.restaurarPosiciones = function(){
            mapa.restorePositions();
        };
        $scope.addNextAtLast = function(){
            mapa.node.addNextAtLast();
        };

        $scope.getNodeData = function(){
            $scope.nodeData = mapa.data.nodes;
        };
        $scope.getEdgeData = function(){
            $scope.edgeData = mapa.data.edges;
        };

        mapa.events.nodoSeleccionado.suscribe($scope, function(){
            $timeout(function(){
                var nodo = mapa.node.getSelected()[0];
                $scope.nodoSeleccionado = mapa.node.get(nodo);
            },0);
        });

        mapa.events.arcoSeleccionado.suscribe($scope, function(){
            $timeout(function(){
                var arco = mapa.edge.getSelected()[0];
                $scope.arcoSeleccionado = mapa.edge.get(arco);
                console.log(mapa.edge.getDirection($scope.arcoSeleccionado));
            },0);
        });

        mapa.events.clickCanvas.suscribe($scope, function(){
            if (mapa.node.getSelected().length === 0) {
                $timeout(function(){
                    $scope.nodoSeleccionado = null;
                },0);
            }
            if (mapa.edge.getSelected().length === 0) {
                $timeout(function(){
                    $scope.arcoSeleccionado = null;
                },0);
            }
        });

        $scope.updateInfRef = function(){
            mapa.edge.update($scope.arcoSeleccionado);
        };

        $scope.updateOrientacion = function(){
            mapa.node.updateOrientacion($scope.nodoSeleccionado);
        };

        $scope.validarOrientacion = function(){
            mapa.node.validarOrientacion();
        };

        $scope.eliminarNodoSeleccionado = function(){
            mapa.node.remove($scope.nodoSeleccionado.id);
        };

        $scope.eliminarArcoSeleccionado = function(){
            mapa.edge.remove($scope.arcoSeleccionado.id);
        };

        $scope.calcularDistancia = function(){
            console.log(mapa.path.shortest(8,6));
            console.log(mapa.path.distancia(mapa.path.shortest(8,6)));
        };

        $scope.cambiarColorArco = function(){
            arco = mapa.edge.getByNodes(1,2);
            arco.color = {
                color:'#F1A417',
                highlight:'#F1A417',
                hover: '#F1A417',
                opacity:1.0
            };
            mapa.edge.update(arco);
            console.log(arco);
        };

        

        $scope.guardarLugar = function(){
            mapa.lugar.add($scope.arcoSeleccionado, $scope.lugar, $scope.lugar_direccion);
        };
    }
]);
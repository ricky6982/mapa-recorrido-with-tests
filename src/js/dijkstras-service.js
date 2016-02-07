/**
 * Servicio que encapsula la libreria de dijkstras
 * para la utilización en el servicio de mapa de recorridos.
 */
(function(angular){

    var g = new Graph();
    var grafoDijkstra = [];
    var filter;

    function addConexion(nodoInicial, nodoFinal, valorDistancia){
        valorDistancia = parseFloat(valorDistancia);
        buscarNodo = filter('filter')(grafoDijkstra, {origen: nodoInicial });
        if (buscarNodo.length === 0) {
            conexion = [];
            conexion.push({
                destino: nodoFinal,
                distancia: valorDistancia
            });
            grafoDijkstra.push({origen: nodoInicial, conexiones: conexion });
        }else{
            buscarNodo[0].conexiones.push({destino: nodoFinal, distancia: valorDistancia});
        }
    }

    function makeGraph(arcos){
        angular.forEach(arcos, function(value, key){
            addConexion(value.from, value.to, value.distancia);
            addConexion(value.to, value.from, value.distancia);
        });

        angular.forEach(grafoDijkstra, function(value, key){
            enlaces = {};
            angular.forEach(value.conexiones, function(conexion, i){
                enlaces[conexion.destino] = conexion.distancia;
            });
            g.addVertex(value.origen, enlaces);
        });
    }

    angular.module('dijkstras-service', [])
        .factory('dijkstras', [
            '$filter',
            function($filter){
                filter = $filter;
                return {
                    makeGraph: makeGraph,
                    shortestPath: function(i, f){
                        i = i.toString();
                        f = f.toString();
                        return g.shortestPath(i, f).concat([i]).reverse();
                    },
                };
            }
        ])
    ;

}(angular));

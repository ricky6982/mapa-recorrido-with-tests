(function(window, angular){

/**
 * Definición de Variables y funciones
 */
var _nodes = new vis.DataSet([]);
var _edges = new vis.DataSet([]);
var _options = {};
var _data = {
        nodes: _nodes,
        edges: _edges
    };

var _network;

function init(container){
    _network = new vis.Network(container, _data, _options);
}

/**
 * Definición de Funciones para manipular los nodos
 */
_node = {
    create: function(n){
        return {
            id: n,
            label: 'N-'+n.toString()
        };
    },
    add: function(n){
        _nodes.add(n);
    },
    addNextAtLast: function(){
        var list = _nodes.getIds();
        list = list.map(parseFloat);

        var lastNode = Math.max.apply(Math, list);
        var nodos = [lastNode];
        nodos.push(lastNode + 1);
        _path.add(nodos);
    },
    get: function(id){
        return _nodes.get(id);
    },
    update: function(n){
        _nodes.update(n);
    },
    remove: function(n){
        _nodes.remove(n);
    }
};
/**
 * Definición de Funciones para manipular los Arcos
 */
_edge = {
    create: function(from, to){
        return {
            from: from,
            to: to
        };
    },
    add: function(e){
        _edges.add(e);
    },
    get: function(id){
        return _edges.get(id);
    },
    remove: function(e){
        _edges.remove(e);
    },
    getByNodes: function (n1, n2) {
        var arcoId = null;
        angular.forEach(_edges._data, function(arco){
            if ((arco.from == n1 && arco.to == n2) || (arco.from == n2 && arco.to == n1)) {
                arcoId = arco.id;
            }
        });
        return _edges.get(arcoId);
    },
    removeByNodes: function(n1, n2){
        a = _network.nodesHandler.getConnectedEdges(n1);
        b = _network.nodesHandler.getConnectedEdges(n2);
        interseccion = $(b).not($(b).not(a));
        _edges.remove(interseccion[0]);
    },
    update: function(e){
        _edges.update(e);
    },
    getSelected: function(){
        return _network.getSelectedEdges();
    },
    count: function(){
        return _edges.length;
    },
};
/**
 * Definición de Funciones para el manejo de trayectorias
 */
_path = {
    add: function(trayecto){
        // No permite que existe un nodo con id = 0
        if (Math.min.apply(Math, trayecto) <= 0) {
            console.log('No se permiten valores menores que 1');
            return false;
        }

        // Creación de Nodo unicamente si no existe
        angular.forEach(trayecto, function(value){
            if (!_nodes.get(value)) {
                _nodes.add(_node.create(value));
            }
        });

        // Creación de Arcos, entre dos nodos puede existir a lo sumo un arco. 
        for (var i = 0 ; i < trayecto.length - 1; i++) {
            // Evita crear nodos que van a un mismo nodo
            if (trayecto[i] !== trayecto[i+1] ) {
                // Verificamos si existe un arco entre un nodo y el nodo siguiente
                if ($.inArray(trayecto[i+1], _network.getConnectedNodes(trayecto[i])) == -1) {
                    _edge.add(_edge.create(trayecto[i], trayecto[i+1]));
                    // actualizarConexionOrientacion(trayecto[i], trayecto[i+1]);
                }
            }
        }
        return true;
    },
    distancia: function(arrayNodos){
        if (arrayNodos.length > 1) {
            var d = 0;
            for (var i = 0; i < arrayNodos.length - 1; i++) {
                arco = _edge.getByNodes(arrayNodos[i], arrayNodos[i+1]);
                if (arco) {
                    d += parseFloat(arco.distancia);
                }else{
                    return Infinity;
                }
            }
            return d;
        }else{
            return 0;
        }
    }
};

/**
 * Definición de Estructura Principal
 */
angular.module('mapaRecorrido',[])
    .factory('mapaService', [
        function(){
            return {
                init: init,
                getMapa: _data,
                data: _data,
                node: _node,
                edge: _edge,
                path: _path
            };
        }
    ])
;

})(window, angular);
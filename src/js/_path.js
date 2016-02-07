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
    }
};
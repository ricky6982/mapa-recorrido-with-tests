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
    getSelected: function(){
        return _network.getSelectedNodes();
    },
    remove: function(n){
        _nodes.remove(n);
    },
    update: function(n){
        _nodes.update(n);
    },
    updateOrientacion: function(nodo){
        if (typeof nodo.conexiones != "undefined") {
            angular.forEach(nodo.conexiones, function(value, key){
                nodoVecino = _nodes.get(key);
                if (typeof nodoVecino.conexiones === "undefined") {
                    nodoVecino.conexiones = {};
                }
                nodoVecino.conexiones[nodo.id] = direccionInversa(value);
                _nodes.update(nodoVecino);
            });
        }
        _nodes.update(nodo);
    },
    validarOrientacion: function(){
        var flag = true;
        angular.forEach(_nodes._data, function(elem){
            if (typeof elem.conexiones != "undefined") {
                // Verifica que las conexiones de cada nodo hacia sus vecinos no este repetida.
                var conexiones = [];
                angular.forEach(elem.conexiones, function(conex){
                    conexiones.push(conex);
                });
                if (conexiones.length != $.unique(conexiones).length) {
                    console.log('El nodo ' + elem.id + ' tiene direcciones repetidas hacia sus nodos vecinos.');
                    elem.color = nodoWarning;
                    _node.update(elem);
                    flag = false;
                }else{
                    // Verifica que las direcciones entre dos nodos sea la correcta uno respecto del otro
                    // Ejemplo: Si el nodo 1 esta conectado por la derecha al nodo 2, entonces el nodo 2 
                    // debe tener una conexión al nodo 1 con dirección izquierda.
                    angular.forEach(elem.conexiones, function(value, key){
                        var nodoVecino = _nodes.get(key);
                        if (nodoVecino.conexiones[elem.id] != direccionInversa(value)) {
                            console.log('La orientación entre los nodos ' + elem.id + ' y ' + key + ' no es la correcta.');
                            elem.color = nodoWarning;
                            _node.update(elem);
                            flag = false;
                        }else{
                            elem.color = nodoSuccess;
                            _node.update(elem);
                        }
                    });
                }
            }
        });
        return flag;
    }
};
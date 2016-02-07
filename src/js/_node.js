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
    get: function(id){
        return _nodes.get(id);
    },
    update: function(n){
        _nodes.update(n);
    }
};
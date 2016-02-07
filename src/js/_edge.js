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
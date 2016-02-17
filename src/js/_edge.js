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
        n1 = e.from;
        n2 = e.to;
        _edges.remove(e);
        actualizarConexionOrientacion(n1, n2);
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
        validarEstado(e);
        _edges.update(e);
    },
    getSelected: function(){
        return _network.getSelectedEdges();
    },
    count: function(){
        return _edges.length;
    },
    getDirection: function(arco){
        if (!arco) {
            return false;
        }
        n1 = _node.get(arco.from);
        n2 = _node.get(arco.to);
        if (typeof n1.y === "undefined" || typeof n2.x === "undefined") {
            return null;
        }
        dy = n2.y - n1.y;
        dx = n2.x - n1.x;
        if (dx === 0) {
            return 'vertical';
        }else{
            m = dy/dx;
            if (-1 < m && m < 1) {
                return 'horizontal';
            }else{
                return 'vertical';
            }
        }
    },
    getDirectionNodes: function(arco, direccion){
        nf = _node.get(arco.from);
        nt = _node.get(arco.to);
        switch (direccion){
            case 'horizontal':
                if (nf.x < nt.x) {
                    return 'directa';
                }else{
                    return 'inversa';
                }
                break;
            case 'vertical':
                if (nf.y < nt.y) {
                    return 'directa';
                }else{
                    return 'inversa';
                }
                break;
        }
    }
};

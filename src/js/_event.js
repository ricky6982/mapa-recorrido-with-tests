events = {
    nodoSeleccionado:{
        suscribe: function(scope, callback){
            var handler = _$rootScope.$on('selected-nodes', callback);
            scope.$on('$destroy', handler);
        },
        notify: function() {
            _$rootScope.$emit('selected-nodes');
        }
    },
    arcoSeleccionado:{
        suscribe: function(scope, callback){
            var handler = _$rootScope.$on('selected-edges', callback);
            scope.$on('$destroy', handler);
        },
        notify: function() {
            _$rootScope.$emit('selected-edges');
        }
    },
    clickCanvas: {
        suscribe: function(scope, callback){
            var handler = _$rootScope.$on('click-canvas', callback);
            scope.$on('$destroy', handler);
        },
        notify: function(){
            _$rootScope.$emit('click-canvas');
        }

    }
};

function initEvents(){
    _network.on('selectNode', function(){
        _$rootScope.$emit('selected-nodes');
    });
    _network.on('selectEdge', function(){
        _$rootScope.$emit('selected-edges');
    });
    _network.on('click', function(){
        _$rootScope.$emit('click-canvas');
    });
}
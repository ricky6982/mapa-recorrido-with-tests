(function(window, angular){

/**
 * Basic priority queue implementation. If a better priority queue is wanted/needed,
 * this code works with the implementation in google's closure library (https://code.google.com/p/closure-library/).
 * Use goog.require('goog.structs.PriorityQueue'); and new goog.structs.PriorityQueue()
 */
function PriorityQueue () {
  this._nodes = [];

  this.enqueue = function (priority, key) {
    this._nodes.push({key: key, priority: priority });
    this.sort();
  }
  this.dequeue = function () {
    return this._nodes.shift().key;
  }
  this.sort = function () {
    this._nodes.sort(function (a, b) {
      return a.priority - b.priority;
    });
  }
  this.isEmpty = function () {
    return !this._nodes.length;
  }
}

/**
 * Pathfinding starts here
 */
function Graph(){
  var INFINITY = 1/0;
  this.vertices = {};

  this.addVertex = function(name, edges){
    this.vertices[name] = edges;
  }

  this.shortestPath = function (start, finish) {
    var nodes = new PriorityQueue(),
        distances = {},
        previous = {},
        path = [],
        smallest, vertex, neighbor, alt;

    for(vertex in this.vertices) {
      if(vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(0, vertex);
      }
      else {
        distances[vertex] = INFINITY;
        nodes.enqueue(INFINITY, vertex);
      }

      previous[vertex] = null;
    }

    while(!nodes.isEmpty()) {
      smallest = nodes.dequeue();

      if(smallest === finish) {
        path;

        while(previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }

        break;
      }

      if(!smallest || distances[smallest] === INFINITY){
        continue;
      }

      for(neighbor in this.vertices[smallest]) {
        alt = distances[smallest] + this.vertices[smallest][neighbor];

        if(alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = smallest;

          nodes.enqueue(alt, neighbor);
        }
      }
    }

    return path;
  };
}

// var g = new Graph();

// g.addVertex('A', {B: 7, C: 8});
// g.addVertex('B', {A: 7, F: 2});
// g.addVertex('C', {A: 8, F: 6, G: 4});
// g.addVertex('D', {F: 8});
// g.addVertex('E', {H: 1});
// g.addVertex('F', {B: 2, C: 6, D: 8, G: 9, H: 3});
// g.addVertex('G', {C: 4, F: 9});
// g.addVertex('H', {E: 1, F: 3});

// // Log test, with the addition of reversing the path and prepending the first node so it's more readable
// console.log(g.shortestPath('A', 'H').concat(['A']).reverse());

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

angular.module('mapaRecorrido.templates', ['template/guiAgregarServicio.tpl.html', 'template/selectServicio.tpl.html']);

angular.module("template/guiAgregarServicio.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/guiAgregarServicio.tpl.html",
    "<div ng-show=\"arco\">\n" +
    "<div class=\"localizacion-servicio {{ getDireccion() }}\">\n" +
    "  <div class=\"panel-first\">\n" +
    "    <div ng-repeat=\"item in arco.lugares.izq track by $index\">\n" +
    "      <servicio-select direccion=\"{{ firstArrow }}\" lugar=\"item\" listado=\"categorias\" remove=\"remove('izq', $index)\"></servicio-select>\n" +
    "    </div>\n" +
    "    <div style=\"margin: 50px 15px;\">\n" +
    "      <button class=\"btn btn-success btn-lg\">Agregar Servicio</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"panel-edge\">\n" +
    "    <div class=\"arco\"></div>\n" +
    "    <div class=\"nodo1\">{{ arco.from }}</div>\n" +
    "    <div class=\"nodo2\">{{ arco.to }}</div>\n" +
    "  </div>\n" +
    "  <div class=\"panel-second\">\n" +
    "    <div ng-repeat=\"item in arco.lugares.der track by $index\">\n" +
    "      <servicio-select direccion=\"{{ secondArrow }}\" lugar=\"item\" listado=\"categorias\" remove=\"remove('der', $index)\"></servicio-select>\n" +
    "    </div>\n" +
    "    <div style=\"margin: 50px 15px;\">\n" +
    "      <button class=\"btn btn-success btn-lg\">Agregar Servicio</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/selectServicio.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/selectServicio.tpl.html",
    "<div class=\"popover {{ direccion }} in\" style=\"position: relative; margin: 20px 0; min-height: 9 0px; display: block;\">\n" +
    "    <div class=\"arrow\"></div>\n" +
    "    <div class=\"popover-content\">\n" +
    "        <div>\n" +
    "            <button class=\"btn btn-xs btn-danger\" style=\"position: absolute; right: -20px; top: -20px;\" ng-click=\"remove()\">X</button>\n" +
    "            <div class=\"form-group\">\n" +
    "              <select ng-model=\"lugar.idCategoria\" class=\"form-control input-sm\" ng-change=\"updateServicios()\">\n" +
    "                <option ng-repeat=\"categ in categorias\" value=\"{{ categ.id }}\">{{ categ.nombre }}</option>\n" +
    "              </select>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "              <select ng-model=\"lugar.idServicio\" class=\"form-control input-sm\" ng-chage=\"udpatePropiedades()\">\n" +
    "                <option ng-repeat=\"serv in servicios\" value=\"{{ serv.id }}\">{{ serv.nombre }}</option>\n" +
    "              </select>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "              <input type=\"text\" ng-model=\"lugar.distancia\" ng-change=\"\" class=\"form-control input-sm\" placeholder=\"Distancia\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

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

var dijkstras, _$rootScope, _$http;

var urlRemoteMap = "", urlSaveRemoteMap = "";


function init(divContainer){
    _network = new vis.Network(divContainer, _data, _options);
    initEvents();
}

/**
 * Definición de Estados de Arcos y Nodos
 */

 var nodoSuccess = {
     background: "#10E256",
     highlight: {
         background: "#10E256"
     }
 };

 var nodoWarning = {
     background: "#FFBD66",
     highlight: {
         background: "#FFBD66"
     }
 };

 var arcoSuccess = {
     color:'#33B907',
     highlight:'#33B907',
     hover: '#33B907',
     opacity:1.0
 };

 var arcoWarning = {
     color:'#F1A417',
     highlight:'#F1A417',
     hover: '#F1A417',
     opacity:1.0
 };

// Validación del estado de un arco
function validarEstado(arco){
    if (typeof arco.infRef != "undefined" && typeof arco.label != "undefined") {
        if (arco.infRef.length > 0 && !isNaN(parseFloat(arco.label))) {
            arco.color = arcoSuccess;
        }else{
            arco.color = arcoWarning;
        }
    }else{
        arco.color = arcoWarning;
    }
}

// Funcion que actualiza las conexiones de orientación entre dos nodos
function actualizarConexionOrientacion(id_n1, id_n2){
    if (id_n1 == id_n2) {
        return false;
    }
    nodo1 = _node.get(id_n1);
    nodo2 = _node.get(id_n2);
    if (typeof nodo1 === "undefined" || typeof nodo2 === "undefined") {
        return false;
    }
    if($.inArray(id_n2, _network.getConnectedNodes(id_n1)) > -1 ){
        if (typeof nodo1.conexiones === "undefined") {
            nodo1.conexiones = {};
            nodo1.conexiones[id_n2] = "";
        }else{
            if (typeof nodo1.conexiones[id_n2] === "undefined") {
                nodo1.conexiones[id_n2] = "";
            }
        }
        _node.update(nodo1);
        if (typeof nodo2.conexiones === "undefined") {
            nodo2.conexiones = {};
            nodo2.conexiones[id_n1] = "";
        }else{
            if (typeof nodo2.conexiones[id_n1] === "undefined") {
                nodo2.conexiones[id_n1] = "";
            }
        }
        _node.update(nodo2);
    }else{
        if (typeof nodo1.conexiones != "undefined") {
            if (typeof nodo1.conexiones[id_n2] != "undefined") {
                delete nodo1.conexiones[id_n2];
                _node.update(nodo1);
            }
        }
        if (typeof nodo2.conexiones != "undefined") {
            if (typeof nodo2.conexiones[id_n1] != "undefined") {
                delete nodo2.conexiones[id_n1];
                _node.update(nodo2);
            }
        }
    }
    
}

// Función para obtener la inversa de una dirección.
function direccionInversa(direccion){
    switch(direccion){
        case 'izq':
            return 'der';
        case 'der':
            return 'izq';
        case 'arr':
            return 'abj';
        case 'abj':
            return 'arr';
    }
}

//
// Funciones de Animación de la Red
//
    function setAnimacion(flag){
        if (flag) {
            _network.setOptions({nodes: { physics: true }});
        }else{
            _network.setOptions({nodes: { physics: false }});
        }
    }

    function savePositions(){
        _network.storePositions();
        restorePositions();
    }

    function restorePositions(){
        angular.forEach(_nodes.getIds(), function(value, key){
            if (_nodes.get(value).x) {
                _network.moveNode(_nodes.get(value).id, _nodes.get(value).x, _nodes.get(value).y);
            }
        });
    }
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
/**
 * Comunicación remota para obtener y guardar un mapa
 */
remote = {
    setUrlMap: function(url){
        urlRemoteMap = url;
    },
    getUrlMap: function(){
        return urlRemoteMap;
    },
    setUrlSave: function(url){
        urlSaveRemoteMap = url;
    },
    getUrlSave: function(){
        return urlSaveRemoteMap;
    },
    getMap: function(){
        if (remote.getUrlMap() !== "") {
            _$http({
                url: remote.getUrlMap(),
                method: 'GET',
            })
            .success(function(data, status){
                angular.forEach(data[0].mapaJson.nodes._data, function(n){
                    _node.add(n);
                });
                angular.forEach(data[0].mapaJson.edges._data, function(e){
                    _edge.add(e);
                });
                setAnimacion(false);
                restorePositions();
                _network.fit();
            })
            .error(function(data){
                console.log('No se encontro un mapa');
            })
            ;
        }
    },
    saveMap: function(){
        if (remote.getUrlSave() !== "") {
            _$http({
                url: remote.getUrlSave(),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: _data
            })
            .success(function(data, status){
                console.log('Se guardo el mapa correctamente.');
            })
            .error(function(err){
                console.log('No se pudo guardar el mapa.');
            });
        }
    }
};
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
    }
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
                    actualizarConexionOrientacion(trayecto[i], trayecto[i+1]);
                }
            }
        }
        return true;
    },
    shortest: function(i, f){
        dijkstras.makeGraph(_edges._data);
        return dijkstras.shortestPath(i,f);
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
angular.module('mapaRecorrido',['dijkstras-service'])
    .factory('mapaService', [
        'dijkstras', '$rootScope', '$http',
        function(dijkstrasService, $rootScope, $http){

            dijkstras = dijkstrasService;
            _$rootScope = $rootScope;
            _$http = $http;

            return {
                init: init,
                network: _network,
                getData: _data,
                data: _data,
                node: _node,
                edge: _edge,
                path: _path,
                events: events,
                setAnimacion: setAnimacion,
                savePositions: savePositions,
                restorePositions: restorePositions,
                remote: remote
            };
        }
    ])
    .directive('agregarServicio',['mapaService',
        function(mapaService){
            return {
                restrict: 'E',
                templateUrl: 'template/guiAgregarServicio.tpl.html',
                replace: true,
                scope: {
                    arco: '=arco',
                    listadoServicios: '=listadoServicios',
                },
                controller: ['$scope',
                    function($scope){
                        $scope.listadoServicios.success(function(data){
                            $scope.categorias = data;
                        });

                        $scope.remove = function(direccion, index){
                            switch (direccion){
                                case 'izq': $scope.arco.lugares.izq.splice(index, 1);
                                    break;
                                case 'der': $scope.arco.lugares.der.splice(index, 1);
                                    break;
                            }
                            console.log('Eliminando localización de servicio (' + direccion + '): ' + index);
                        };

                        // $scope.agregarServicio = function(direccion){
                        //     var newItem = {
                        //         idCategoria: null,
                        //         idServicio: null,
                        //         categoria: null,
                        //         servicio: null,
                        //         distancia: null
                        //     };

                        //     if (typeof $scope.arco.lugares === "undefined") {
                        //         $scope.arco.lugares = {"izq": [], "der": []};
                        //     }

                        //     switch (direccion){
                        //         case 'izq': $scope.arco.lugares.izq.push(angular.copy(newItem));
                        //             break;
                        //         case 'der': $scope.arco.lugares.der.push(newItem);
                        //             break;
                        //     }
                        // };

                        $scope.getDireccion = function(){
                            direccion = mapaService.edge.getDirection($scope.arco);
                            if (direccion === 'horizontal') {
                                $scope.firstArrow = 'top';
                                $scope.secondArrow = 'bottom';
                            }else{
                                $scope.firstArrow = 'left';
                                $scope.secondArrow = 'right';
                            }
                            return direccion;
                        };
                    }
                ]
            };
        }
    ])
;

(function(angular){

    angular.module('localizacionServicio', ['mapaRecorrido.templates'])

        .directive('servicioSelect',[
            '$filter',
            function($filter){
                return {
                    restrict: 'E',
                    templateUrl: 'template/selectServicio.tpl.html',
                    replace: true,
                    scope: {
                        lugar: '=lugar',
                        categorias: '=listado',
                        direccion: '@direccion',
                        remove: '&remove'
                    },
                    controller: ['$scope',
                        function($scope){
                            $scope.servicios = $filter('filter')($scope.categorias, {id: $scope.lugar.idCategoria })[0].items;
                            $scope.updateServicios = function(){
                                var result = $filter('filter')($scope.categorias, {id: $scope.lugar.idCategoria });
                                if (result.length > 0) {
                                    $scope.servicios = result[0].items;
                                }
                            };

                            $scope.updatePropiedades = function(){
                                $scope.lugar.categoria = $filter('filter')($scope.categorias, {id: $scope.lugar.idCategoria })[0].nombre;
                                $scope.lugar.servicio = $filter('filter')($scope.servicios, {id: $scope.lugar.idServicio })[0].nombre;
                            };
                        }
                    ]
                };
            }
        ])
    ;
}(angular));
})(window, angular);
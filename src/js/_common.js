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

// Validación del estado de un arco y Normalización de arcos respecto a la posición de sus nodos
function validarEstado(arco){
    // Validación del Estado del arco.
    if (typeof arco.infRef != "undefined" && typeof arco.label != "undefined") {
        if (arco.infRef.length > 0 && !isNaN(parseFloat(arco.label))) {
            arco.color = arcoSuccess;
        }else{
            arco.color = arcoWarning;
        }
    }else{
        arco.color = arcoWarning;
    }
    // Normalización de la dirección del arco respecto la posición de sus nodos
    // 
    // Arcos en posición Horizontal:
    //      (1)<--------(2)  ====Normalizando====>    (1)-------->(2)
    // 
    // Arcos en posición Vertical:
    //      (1)                                 (1)
    //       ^                                   | 
    //       |                                   | 
    //       |        ====Normalizando=====>     |
    //       |                                   | 
    //       |                                   V 
    //      (4)                                 (4)
    direccion = _edge.getDirection(arco);
    if (_edge.getDirectionNodes(arco, direccion) === 'inversa') {
        var aux = arco.from;
        arco.from = arco.to;
        arco.to = aux;
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

function contarServicios(e){
    var total = 0;
    if (typeof e.lugares !== 'undefined') {
        total = e.lugares.izq.length + e.lugares.der.length;
    }
    return total;
}

function getNombreServicios(e){
    var servicios = [];
    if (typeof e.lugares !== 'undefined') {
        angular.forEach(e.lugares.izq, function(item){
            servicios.push(item.servicio);
        });
        angular.forEach(e.lugares.der, function(item){
            servicios.push(item.servicio);
        });
    }

    return servicios;
}

function updateTemplatePopUp(e){
    if (typeof e.infRef !== 'undefined' && e.infRef !== '') {
        var template = '<strong>'+ e.infRef +'</strong><br>';
        var total = contarServicios(e);
        if (total > 0) {
            var templateServicios = '';
            var nombreServicios = getNombreServicios(e);
            angular.forEach(nombreServicios, function(nombre){
                templateServicios += '<li>' + nombre + '</li>';
            });
            template += '<ol>' + templateServicios + '</ol>'
            ;
        }
        e.title = template;
    }else{
        delete e.title;
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
        default:
            return '';
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
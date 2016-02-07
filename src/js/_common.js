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

var dijkstras;


function init(container){
    _network = new vis.Network(container, _data, _options);
}

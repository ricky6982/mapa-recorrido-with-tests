angular.module('mapaRecorrido.templates', ['template/selectServicio.tpl.html']);

angular.module("template/selectServicio.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/selectServicio.tpl.html",
    "<div class=\"popover {{ direccion }} in\" style=\"position: relative; margin: 20px 0; min-height: 9 0px; display: block;\">\n" +
    "    <div class=\"arrow\"></div>\n" +
    "    <div class=\"popover-content\">\n" +
    "        <div>\n" +
    "            <div class=\"form-group\">\n" +
    "              <select ng-options=\"categ.id as categ.nombre for categ in categorias\" ng-model=\"lugar.idCategoria\" class=\"form-control input-sm\" ng-change=\"updateServicios()\" ng-click=\"updateCategorias()\">\n" +
    "                <option value=\"\" selected disabled>--Categoría--</option>\n" +
    "              </select>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "              <select ng-options=\"serv.id as serv.nombre for serv in servicios\" ng-model=\"lugar.idServicio\" class=\"form-control input-sm\" ng-chage=\"udpatePropiedades()\">\n" +
    "                <option value=\"\" selected disabled>--Servicio--</option>\n" +
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

angular.module('mapaRecorrido.templates', ['template/guiAgregarServicio.tpl.html', 'template/saveButton.tpl.html', 'template/selectServicio.tpl.html']);

angular.module("template/guiAgregarServicio.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/guiAgregarServicio.tpl.html",
    "<div ng-show=\"arco\">\n" +
    "<div class=\"localizacion-servicio {{ getDireccion() }}\">\n" +
    "  <div class=\"panel-first\">\n" +
    "    <div ng-repeat=\"item in arco.lugares.izq track by $index\">\n" +
    "      <servicio-select direccion=\"{{ firstArrow }}\" lugar=\"item\" categorias=\"categorias\" remove=\"remove('izq', $index)\"></servicio-select>\n" +
    "    </div>\n" +
    "    <div style=\"margin: 50px 15px;\">\n" +
    "      <button class=\"btn btn-success btn-lg\" ng-click=\"agregar('izq')\">Agregar Servicio</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"panel-edge\">\n" +
    "    <div class=\"arco\"></div>\n" +
    "    <div class=\"nodo1\">{{ arco.from }}</div>\n" +
    "    <div class=\"nodo2\">{{ arco.to }}</div>\n" +
    "  </div>\n" +
    "  <div class=\"panel-second\">\n" +
    "    <div ng-repeat=\"item in arco.lugares.der track by $index\">\n" +
    "      <servicio-select direccion=\"{{ secondArrow }}\" lugar=\"item\" categorias=\"categorias\" remove=\"remove('der', $index)\"></servicio-select>\n" +
    "    </div>\n" +
    "    <div style=\"margin: 50px 15px;\">\n" +
    "      <button class=\"btn btn-success btn-lg\" ng-click=\"agregar('der')\">Agregar Servicio</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/saveButton.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/saveButton.tpl.html",
    "<button ng-disabled='flag' ng-click='submit()'>\n" +
    "    {{ label }}\n" +
    "    <i class='glyphicon glyphicon-refresh spinning' ng-show='flag'></i>\n" +
    "</button>");
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
    "              <select ng-model=\"lugar.idServicio\" class=\"form-control input-sm\" ng-change=\"updatePropiedades()\">\n" +
    "                <option ng-repeat=\"serv in servicios\" value=\"{{ serv.id }}\">{{ serv.nombre }}</option>\n" +
    "              </select>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "              <input type=\"text\" ng-model=\"lugar.distancia\" ng-change=\"updatePropiedades()\" class=\"form-control input-sm\" placeholder=\"Distancia\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

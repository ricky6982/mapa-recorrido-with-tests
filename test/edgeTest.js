describe('-- Prueba de metodos para Arcos --', function(){
    
    var element, scope, service;

    beforeEach(module('mapaRecorrido'));

    beforeEach(inject(function ($compile, $rootScope, $injector) {
        scope = $rootScope;
        element = angular.element('<div id="network_vis"></div>');

        $compile(element)(scope);
        scope.$apply();

        service = $injector.get('mapaService');

        service.init(element[0]);
    }));

    afterEach(function(){
        service.data.edges.clear();
        service.data.nodes.clear();
    });

    it('Creación de Arco', function(){
        arco = service.edge.create(1,2);
        arcoValido = {
            from: 1,
            to: 2
        };
        expect(arco).toEqual(arcoValido);

        service.edge.add(arco);
        expect(service.data.edges.length).toEqual(1);

    });

    it('Obtener un arco por medio de sus nodos', function(){
        arco = service.edge.create(5,7);
        arco.id = "ID-PRUEBA";
        service.edge.add(arco);

        expect(service.edge.getByNodes(5,7).id).toEqual("ID-PRUEBA");
    });

    it('Eliminación de un Arco', function(){
        arco = service.edge.create(5,7);
        service.edge.add(arco);
        expect(service.data.edges.length).toEqual(1);
        service.edge.remove(arco);
        expect(service.data.edges.length).toEqual(0);
    });

});
describe('-- Prueba de metodos para nodos --', function(){
    
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


    it('Creación de nodo', function(){
        nodo = service.node.create(2);
        expect(nodo).toEqual({id: 2, label: 'N-2'});

        service.node.add(nodo);
        expect(service.data.nodes.length).toEqual(1);

        expect(service.node.get(2)).toEqual(nodo);
    });

    it('Actualización de Nodo', function(){
        nodo = {
            id: 2,
            label: 'N-2 Edited'
        };

        service.node.update(nodo);
        expect(service.node.get(2)).toEqual({id: 2, label: 'N-2 Edited'});
    });

    it('Eliminacion de nodos', function(){

        expect(service.data.nodes.length).toEqual(1);
    });
});
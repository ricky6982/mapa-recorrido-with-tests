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

    // it('Actualización de Nodo', function(){
    //     nodo = {
    //         id: 2,
    //         label: 'N-2 Edited'
    //     };

    //     service.node.update(nodo);
    //     expect(service.node.get(2)).toEqual({id: 2, label: 'N-2 Edited'});
    // });

    // it('Eliminacion de nodos', function(){

    //     expect(service.data.nodes.length).toEqual(1);
    // });
});
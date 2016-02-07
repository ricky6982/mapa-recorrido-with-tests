describe('-- Prueba de metodos para Nodos --', function(){
    
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
        service.data.nodes.clear();
        service.data.edges.clear();
    });

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
        nodo = service.node.create(1);
        service.node.add(nodo);
        expect(service.data.nodes.length).toEqual(1);
        service.node.remove(nodo);
        expect(service.data.nodes.length).toEqual(0);
    });

    it('Agregando un nodo enlazado al ultimo nodo de la red', function(){
        trayecto = [1,2,3,4,5];
        service.path.add(trayecto);
        service.node.addNextAtLast();
        expect(service.data.nodes.length).toEqual(6);
        expect(service.edge.getByNodes(5,6).from).toEqual(5);
        expect(service.edge.getByNodes(5,6).to).toEqual(6);
    });

});
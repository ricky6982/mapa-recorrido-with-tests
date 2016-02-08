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

    describe('Actualización de la Orientación entre nodos', function() {
        /**
         * Creaciión del siguiente mapa de recorrido seteando las
         * orientaciones de los nodos 1 y 3, la orientación de los
         * nodos 2 y 4 el algoritmo setea sus valores
         * 
         * (1) ---- (2)
         *  |        |
         *  |        |
         *  |        |
         * (4) ---- (3)
         */
        beforeEach(function(){
            trayecto = [1,2,3,4,1];
            service.path.add(trayecto);
        });

        beforeEach(function(){
            nodo1 = service.node.get(1);
            nodo1.conexiones = {};
            nodo1.conexiones = {
                "2": "der",
                "4": "abj"
            };
            service.node.updateOrientacion(nodo1);

            nodo3 = service.node.get(3);
            nodo3.conexiones = {};
            nodo3.conexiones = {
                "2": "arr",
                "4": "izq"
            };
            service.node.updateOrientacion(nodo3);
        });

        it('Conexion del nodo 2 a los nodos 1 y 3', function() {
            nodo2 = service.node.get(2);
            conexionEsperada = {
                "1": "izq",
                "3": "abj"
            };
            expect(nodo2.conexiones).toEqual(conexionEsperada);
        });

        it('Conexion del nodo 4 a los nodos 1 y 3', function() {
            nodo4 = service.node.get(4);
            conexionEsperada = {
                "1": "arr",
                "3": "der"
            };
            expect(nodo4.conexiones).toEqual(conexionEsperada);
        });
    });

});
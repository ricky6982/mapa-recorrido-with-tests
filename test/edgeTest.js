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
        service.path.add([5,7]);
        expect(service.data.edges.length).toEqual(1);
        arco = service.edge.getByNodes(5,7);
        service.edge.remove(arco);
        expect(service.data.edges.length).toEqual(0);
    });

    it('Obtener la Dirección del Arco -> Horizontal', function() {
        service.path.add([1,2,3,4,5,6]);

        nodo1 = service.node.get(1); nodo1.x = 0; nodo1.y = 0;
        service.node.update(nodo1);

        nodo2 = service.node.get(2);nodo2.x = 100;nodo2.y = 0;
        service.node.update(nodo2);

        nodo3 = service.node.get(3); nodo3.x = 100; nodo3.y = 100;
        service.node.update(nodo3);

        nodo4 = service.node.get(4); nodo4.x = 0; nodo4.y = 100;
        service.node.update(nodo4);

        nodo5 = service.node.get(5); nodo5.x = 1; nodo5.y = 200;
        service.node.update(nodo5);

        arco1_2 = service.edge.getByNodes(1,2);
        expect(service.edge.getDirection(arco1_2)).toEqual('horizontal');

        arco2_3 = service.edge.getByNodes(2,3);
        expect(service.edge.getDirection(arco2_3)).toEqual('vertical');

        arco3_4 = service.edge.getByNodes(3,4);
        expect(service.edge.getDirection(arco3_4)).toEqual('horizontal');

        arco4_5 = service.edge.getByNodes(4,5);
        expect(service.edge.getDirection(arco4_5)).toEqual('vertical');

        arco5_6 = service.edge.getByNodes(5,6);
        expect(service.edge.getDirection(arco5_6)).toEqual(null);
    });

    it('Obtener la Dirección entre nodos de un arco segun su dirección', function(){
        // (1)------------->(2)
        //  ^                |     1-2: directa           +------->(+x)
        //  |                |     2-3: directa           |
        //  |                |     3-4: inversa           |
        //  |                |     4-1: inversa           |   
        //  |                v                            v (+y)  
        // (4)<-------------(3)
        service.path.add([1,2,3,4,1]);

        nodo1 = service.node.get(1); nodo1.x = 0; nodo1.y = 0;
        service.node.update(nodo1);

        nodo2 = service.node.get(2); nodo2.x = 100; nodo2.y = 0;
        service.node.update(nodo2);

        nodo3 = service.node.get(3); nodo3.x = 100; nodo3.y = 100;
        service.node.update(nodo3);

        nodo4 = service.node.get(4); nodo4.x = 0; nodo4.y = 100;
        service.node.update(nodo4);

        // Si la dirección del arco es horizontal
        //  Los nodos:
        //   (1)-------------->(2)  =>   x1  < x2
        // arco.from        arco.to
        // tendran una dirección "directa" si la coordenada x del nodo 1 es menor a la coordenada x del nodo 2
        arco1_2 = service.edge.getByNodes(1,2);
        expect(service.edge.getDirectionNodes(arco1_2, 'horizontal')).toEqual('directa');

        //  Los nodos:
        //   (2)<--------------(1)  =>   x1  >  x2
        // arco.to          arco.from
        // en este caso tendran una dirección "inversa".
        arco3_4 = service.edge.getByNodes(3,4);
        expect(service.edge.getDirectionNodes(arco3_4, 'horizontal')).toEqual('inversa');

        //  Los nodos:
        //   (2) arco.from
        //    |
        //    |              =>   y2  <  y3
        //    |
        //    v
        //   (3) arco.to
        // en este caso tendran una dirección "directa".
        arco2_3 = service.edge.getByNodes(2,3);
        expect(service.edge.getDirectionNodes(arco2_3, 'vertical')).toEqual('directa');

                //  Los nodos:
        //   (1) arco.to
        //    ^
        //    |              =>   y1  <  y4
        //    |
        //    |
        //   (4) arco.from
        // en este caso tendran una dirección "directa".
        arco1_4 = service.edge.getByNodes(1,4);
        expect(service.edge.getDirectionNodes(arco1_4, 'vertical')).toEqual('inversa');
    });
});
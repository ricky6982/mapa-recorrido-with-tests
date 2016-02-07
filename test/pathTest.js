describe('-- Prueba de Creación de Trayectorias --', function(){
    
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

    it('Creación de trayecto', function(){
        trayecto = [1,2,3,4,5,1,6,1,2];
        service.path.add(trayecto);

        expect(service.data.nodes.length).toEqual(6);
        expect(service.data.edges.length).toEqual(6);
    });

    it('No permitir que se agreguen valores menores que 1.', function(){
        service.data.nodes.clear();
        trayecto = [1,2,-1];
        service.path.add(trayecto);

        expect(service.data.nodes.length).toEqual(0);
    });

    it('Eliminar arco por medio de sus nodos.', function(){
        arco = service.path.add([5,7,8,9]);
        expect(service.data.edges.length).toEqual(3);
        service.edge.removeByNodes(5,7);
        expect(service.data.edges.length).toEqual(2);
    });

    it('Calculo de la distancia de una trayectoria', function(){
        trayecto = [1,2,3,4];
        service.path.add(trayecto);
        listaArco = service.data.edges.getIds();
        expect(listaArco.length).toEqual(3);
        for (var i = listaArco.length - 1; i >= 0; i--) {
            arcoAux = service.edge.get(listaArco[i]);
            arcoAux.distancia = 5;
            service.edge.update(arcoAux);
        }
        expect(service.path.distancia(trayecto)).toEqual(15);
    });

    it('Calculo de la distancia más corta', function() {
        trayecto = [1,2,3,4,1];
        service.path.add(trayecto);
        listaArco = service.data.edges.getIds();
        for (var i = listaArco.length - 1; i >= 0; i--) {
            arcoAux = service.edge.get(listaArco[i]);
            arcoAux.distancia = i+1;
            service.edge.update(arcoAux);
        }
        caminoMasCorto = service.path.shortest(1,3);
        expect(caminoMasCorto).toEqual(['1', '2', '3']);
        expect(service.path.distancia(caminoMasCorto)).toEqual(3);
    });



});
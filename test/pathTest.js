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


});
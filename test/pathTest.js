describe('-- Prueba de Creación de Trayectos --', function(){
    
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
});
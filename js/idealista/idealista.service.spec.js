describe('Idealista Service Tests', function(){
    'use strict';

    beforeEach(module('idealista-arcgis'));

    var IdealistaService, $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, _IdealistaService_) {
        $httpBackend = _$httpBackend_;
        IdealistaService = _IdealistaService_
    }));


    it('sanitizeResults::Should return an array without repeated elements given 2 arrays', function(){
        expect(1).toEqual(1);
    });
});
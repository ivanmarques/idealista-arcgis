describe('Idealista Service Tests', function(){
    'use strict';

    beforeEach(module('idealista-arcgis'));

    var IdealistaService, $httpBackend, $q;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, _IdealistaService_, _$q_) {
        $httpBackend = _$httpBackend_;
        IdealistaService = _IdealistaService_;
        $q = _$q_;
    }));


    it('sanitizeResults::Should return an array without repeated elements given 2 arrays', function(){
        var collection1 = {
            elementList: [
                {
                    url: 'http://localhost:80'
                },
                {
                    url: 'http://localhost:8080'
                }
            ]
        };
        var collection2 = [
            {
                url:'http://localhost:80'
            },
            {
                url:'http://localhost:9090'
            }
        ];
        var joinedCollections = IdealistaService.sanitizeResults(collection1,collection2);
        expect(joinedCollections.length).toEqual(3);
    });

    
});

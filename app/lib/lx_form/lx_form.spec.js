'use strict';

describe('lx form service', function () {
    var service;

    beforeEach(function () {
        module('lx.cache');
        module('lx.form');
    });

    describe('lxForm', function () {
        beforeEach(function () {
            inject(function ($injector) {
                service = $injector.get('lxForm')('test', 'id');
            });
        });

        it('should be initialized correctly', function () {
            expect(service.model).toBeDefined();
            expect(service.reset).toBeDefined();
            expect(service.isUnchanged).toBeDefined();
            expect(service.hasLoadedModelFromCache).toBeDefined();
            expect(service.setModel).toBeDefined();
            expect(service.populateServerValidation).toBeDefined();
        });

        describe('isUnchanged()', function () {
            it('should return true if there are no changes to the model', function () {
                expect(service.isUnchanged()).toBeTruthy();
            });

            it('should return false if the model has changes', function () {
                service.model.test = 1;
                expect(service.isUnchanged()).toBeFalsy();
            });
        });

        describe('setModel()', function () {
            it('should set the model and store it in cache by id', function () {
                var data = {id: 1, name: 'wayne', age: 99};

                service.setModel(data);
                expect(service.model).toEqual(data);

                inject(function ($injector) {
                    var cache = $injector.get('lxCache');

                    expect(cache[1]).toEqual(data);
                    expect(cache['1_Master']).toEqual(data);
                });
            });

            it('should set the model and store it in cache by name', function () {
                var data = {name: 'wayne', age: 99};

                service.setModel(data);
                expect(service.model).toEqual(data);

                inject(function ($injector) {
                    var cache = $injector.get('lxCache');

                    expect(cache.test).toEqual(data);
                });
            });

            it('should delete the old model from cache', function () {
                var data = {id: 1, name: 'wayne', age: 99};

                service.setModel(data);
                service.setModel(data, true);

                expect(service.model).toEqual(data);

                inject(function ($injector) {
                    var cache = $injector.get('lxCache');

                    expect(cache[1]).toBeUndefined();
                    expect(cache['1_Master']).toBeUndefined();
                });
            });

            it('should delete the old model from cache', function () {
                var data = {name: 'wayne', age: 99};

                inject(function ($injector) {
                    var cache = $injector.get('lxCache');

                    cache.test = 123;
                    service.setModel(data, true);

                    expect(service.model).toEqual(data);
                    expect(cache.test).toBeUndefined();
                });
            });

            it('should do nothing when model is not an object', function () {
                service.setModel();
                expect(service.model).toEqual({});

                inject(function ($injector) {
                    var cache = $injector.get('lxCache');

                    expect(cache[1]).toBeUndefined();
                    expect(cache['1_Master']).toBeUndefined();
                });
            });
        });

        describe('reset()', function () {
            it('should reset the model to initial state', function () {
                var data = {
                    id: 1,
                    name: 'wayne',
                    age: 99
                };

                service.setModel(data);
                service.model.age = 66;
                service.reset();

                expect(service.model).toEqual({id: 1, name: 'wayne', age: 99});

                inject(function ($injector) {
                    var cache = $injector.get('lxCache');

                    expect(cache[1]).toEqual({id: 1, name: 'wayne', age: 99});
                });
            });

            it('should reset the form errors', function () {
                var data = {
                        id: 1,
                        name: 'wayne',
                        age: 99
                    },
                    form = {
                        $error: {
                            id: 'required'
                        },
                        $setPristine: function () {
                        },
                        $setUntouched: function () {
                        }
                    };

                service.setModel(data);
                service.model.age = 66;
                service.reset(form);

                expect(service.model).toEqual({id: 1, name: 'wayne', age: 99});
                //expect(Object.keys(form.$error).length).toBe(0);
            });

            it('should reset the model to initial state without key', function () {
                var data = {
                    name: 'wayne',
                    age: 99
                };

                service.setModel(data);
                service.model.age = 66;
                service.reset();

                expect(service.model).toEqual({name: 'wayne', age: 99});

                inject(function ($injector) {
                    var cache = $injector.get('lxCache');

                    expect(cache.test).toEqual({name: 'wayne', age: 99});
                });
            });
        });

        //describe('populateValidation()', function () {
        //    it('should add the validation errors', function () {
        //        var form = {errors: {id: 'required'}};
        //        var errors = [
        //            {property: 'date', message: 'format'},
        //            {property: 'name', message: 'length'}
        //        ];
        //
        //        expect(form.errors.id).toBeDefined();
        //        service.populateValidation(form, errors);
        //        expect(form.errors.id).toBeUndefined();
        //        expect(form.errors.date).toBeDefined();
        //        expect(form.errors.name).toBeDefined();
        //    });
        //
        //    it('should not add the validation errors', function () {
        //        var form = {errors: {id: 'required'}};
        //
        //        expect(form.errors.id).toBeDefined();
        //        service.populateValidation(form, null);
        //        expect(form.errors.id).toBeDefined();
        //    });
        //});

        describe('hasLoadedModelFromCache()', function () {
            it('should has model in cache', function () {
                var data = {id: 1, name: 'wayne', age: 99};

                service.setModel(data);
                var inCache = service.hasLoadedModelFromCache(1);
                expect(inCache).toBeTruthy();
            });

            it('should has not model in cache', function () {
                var data = {id: 1, name: 'wayne', age: 99};

                service.setModel(data);
                var inCache = service.hasLoadedModelFromCache('2');
                expect(inCache).toBeFalsy();
            });

            it('should has model in cache', function () {
                var data = {id: 1, name: 'wayne', age: 99};

                service.setModel(data);
                var inCache = service.hasLoadedModelFromCache();
                expect(inCache).toBeTruthy();
            });

            it('should has model in cache', function () {
                var data = {id: 'test', name: 'wayne', age: 99};

                service.setModel(data);
                var inCache = service.hasLoadedModelFromCache();
                expect(inCache).toBeTruthy();
            });

            it('should return true without master in cache', function () {
                var data = {id: 1, name: 'wayne', age: 99};

                service.setModel(data);
                inject(function ($injector) {
                    var cache = $injector.get('lxCache');
                    delete cache['1_Master'];
                });
                var inCache = service.hasLoadedModelFromCache('1');
                expect(inCache).toBeTruthy();
            });
        });
    });

    describe('lxForm partially initialized', function () {
        beforeEach(function () {
            inject(function ($injector) {
                service = $injector.get('lxForm')('test');
            });
        });

        describe('reset()', function () {
            it('should reset the model to initial state without refreshing the cache', function () {
                var data = {id: 1, name: 'wayne', age: 99};

                service.setModel(data);
                service.model.age = 66;
                service.reset();

                expect(service.model).toEqual({id: 1, name: 'wayne', age: 99});

                inject(function ($injector) {
                    var cache = $injector.get('lxCache');
                    expect(cache[1]).not.toEqual({id: 1, name: 'wayne', age: 99});
                });
            });
        });

        describe('reset()', function () {
            it('should reset the model to initial state without refreshing the cache', function () {
                var data = {id: 1, name: 'wayne', age: 99};

                service.setModel(data);
                service.model.age = 66;
                service.reset();

                expect(service.model).toEqual({id: 1, name: 'wayne', age: 99});

                inject(function ($injector) {
                    var cache = $injector.get('lxCache');
                    expect(cache.undefined).not.toEqual({id: 1, name: 'wayne', age: 99});
                });
            });
        });
    });
});

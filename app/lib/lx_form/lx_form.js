'use strict';

angular.module('lx.form', ['lx.cache'])
/**
 * @ngdoc object
 * @name lx.form.lxForm
 * @requires lx.cache.lxCache
 *
 * @param {string} modelName The name for the model.
 * @param {string=} key The name for a model property, which value is used as cache id.
 *
 * @description
 * Form service which allow caching, reset the object and populates validation errors.
 *
 * For more information look at the [guide](/form).
 */
    .factory('lxForm', function (lxCache) {
        return function (modelName, key) {
            var pub = {},
                master = {};

            // the form data
            pub.model = {};

            /**
             * @ngdoc method
             * @name lx.form.lxForm#reset
             * @methodOf lx.form.lxForm
             *
             * @description
             * Resets the model to the master.
             *
             * @param {object} form The angularjs form controller.
             */
            pub.reset = function (form) {
                if (form) {
                    // clear form errors
                    pub.resetValidation(form);

                    // set form to pristine state
                    form.$setPristine();

                    // set form to untouched state
                    form.$setUntouched();
                }

                // reset model
                pub.model = angular.copy(master);

                if (key) {
                    // reset model in lxCache
                    if (pub.model[key]) {
                        lxCache[pub.model[key]] = pub.model;
                    } else {
                        lxCache[modelName] = pub.model;
                    }
                }
            };

            /**
             * @ngdoc method
             * @name lx.form.lxForm#isUnchanged
             * @methodOf lx.form.lxForm
             *
             * @description
             * Checks if the model has changes.
             *
             * @returns {boolean} true if model is unchanged, otherwise false.
             */
            pub.isUnchanged = function () {
                return angular.equals(pub.model, master);
            };

            /**
             * @ngdoc method
             * @name lx.form.lxForm#hasLoadedModelFromCache
             * @methodOf lx.form.lxForm
             *
             * @description
             * Tries to load the model from lxCache.
             *
             * @param {string=} currentKey The key of the model.
             * @returns {boolean} true if model has loaded from cache, otherwise false.
             */
            pub.hasLoadedModelFromCache = function (currentKey) {
                if (currentKey && lxCache[currentKey]) {
                    // load from lxCache
                    pub.model = lxCache[currentKey];

                    if (lxCache[currentKey + '_Master']) {
                        // load master from lxCache
                        master = lxCache[currentKey + '_Master'];
                    }

                    return true;
                } else if (!currentKey) {
                    if (lxCache[modelName]) {
                        // load from lxCache
                        pub.model = lxCache[modelName];
                    } else {
                        // set lxCache
                        lxCache[modelName] = pub.model;
                    }

                    return true;
                }

                return false;
            };

            /**
             * @ngdoc method
             * @name lx.form.lxForm#setModel
             * @methodOf lx.form.lxForm
             *
             * @description
             * Sets the model.
             *
             * @param {object} model The model.
             * @param {boolean} resetCache Specifies if the lxCache should be resetted.
             */
            pub.setModel = function (model, resetCache) {
                if (!pub.model[key] && resetCache) {
                    // no key -> create, delete model from lxCache
                    delete lxCache[modelName];
                }

                // set model
                pub.model = model;
                master = angular.copy(model);

                if (resetCache) {
                    // reset lxCache
                    delete lxCache[model[key]];
                    delete lxCache[model[key] + '_Master'];
                } else {
                    // set lxCache
                    /*eslint-disable */
                    if (model[key] !== undefined) {
                        lxCache[model[key]] = pub.model;
                        lxCache[model[key] + '_Master'] = master;
                    } else {
                        lxCache[modelName] = pub.model;
                    }
                    /*eslint-enable */
                }
            };

            /**
             * @ngdoc method
             * @name lx.form.lxForm#populateServerValidation
             * @methodOf lx.form.lxForm
             *
             * @description
             * Add server validation to form.
             *
             * @param {object} form The angularjs form controller.
             * @param {Array<object>} errors The validation errors.
             */
            pub.populateServerValidation = function (form, errors) {
                if (errors) {
                    pub.resetServerErrors(form);

                    angular.forEach(errors, function (value) {
                        var prop = value.property.toLowerCase();

                        if (form[prop]) {
                            form[prop].$setValidity('server', false);
                            form[prop].$error.serverMsg = value.message;
                        }
                    });
                }
            };

            pub.resetServerErrors = function (form) {
                angular.forEach(form, function (value) {
                    // filter out the form controls with server errors
                    if (value && value.$error && value.$error.serverMsg) {
                        // reset validation
                        value.$setValidity('server', true);

                        // remove error message
                        delete value.$error.serverMsg;

                    }
                });
            };

            pub.resetValidation = function (form) {
                angular.forEach(form, function (control, name) {
                    // filter out the form controls
                    if (name && name[0] !== '$') {

                        // set all controls to valid if they have errors
                        angular.forEach(control.$error, function (error, nameOfError) {
                            // reset validation
                            control.$setValidity(nameOfError, true);

                            // clear input
                            control.$setViewValue('');
                        });

                        // set control to pristine state
                        control.$setPristine();
                    }
                });
            };

            return pub;
        };
    });

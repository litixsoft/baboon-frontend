'use strict';

angular.module('lx.layout.directives',[])
    .directive('lxMenuButton', function () {
        return {
            restrict: 'A',
            link: function (scope, elem) {

                var bodyTemp = document.getElementsByTagName('body');
                var body = angular.element(bodyTemp[0]);
                
                elem.bind('click',function(){
                    if (!body.hasClass('lx-menu-open')) {
                        body.addClass('lx-menu-open');
                    } else {
                        body.removeClass('lx-menu-open');
                    }
                });
            }
        };
    })
    .directive('lxMobileResize', function ($window) {
        return {
            restrict: 'A',
            link: function () {

                var window = angular.element($window);
                var bodyTemp = document.getElementsByTagName('body');
                var body = angular.element(bodyTemp[0]);

                function doResize(){
                    var currentWidth = body.width();
                    if(currentWidth <= 1024){
                        if (body.hasClass('lx-menu-open')) {
                            body.removeClass('lx-menu-open');
                        }
                    } else {
                        if (!body.hasClass('lx-menu-open')) {
                            body.addClass('lx-menu-open');
                        }
                    }
                }

                window.bind('resize',function(){
                    doResize();
                });

                doResize();
            }
        };
    })
    .directive('lxShortcutButton', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs, ctrl) {

                var shortcutMenuTemp = document.getElementById('lx-shortcut');
                var shortcutMenu = angular.element(shortcutMenuTemp);
                var bodyTemp = document.getElementsByTagName('body');
                var body = angular.element(bodyTemp[0]);
                var closeable = true;

                elem.bind('click',function(){
                    shortcutMenu.show();
                    closeable=false;
                    setTimeout(function(){
                        closeable=true;
                    },300);
                });

                var test = angular.element(document);

                test.bind('click',function(){
//                    console.log("closeable: ",closeable);
                    if(shortcutMenu.css('display')!=='none' && closeable){
                        shortcutMenu.hide();
                    }
                });

            }
        };
    });

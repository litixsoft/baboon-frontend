'use strict';

describe('Scenario: test application routing.', function () {

    it('should be correct redirect to /main/home by route /', function () {
        browser.get('/');
        element.all(by.css('.lx-intro h1')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('Main - Home');
        });
    });

    it('should be the correct redirect by route /foo', function () {
        browser.get('/foo');
        element.all(by.css('.lx-intro h1')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('Main - Home');
        });
    });

    it('should be the correct redirect by route /main', function () {
        browser.get('/main');
        element.all(by.css('.lx-intro h1')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('Main - Home');
        });
    });

    it('should be the correct scope by route /main/home', function () {
        browser.get('/main/home');
        element.all(by.css('.lx-intro h1')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('Main - Home');
        });
    });

    it('should be the correct scope by route /main/about', function () {
        browser.get('/main/about');
        element.all(by.css('.lx-intro h1')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('Main - About');
        });
    });

    it('should be the correct scope by route /main/contact', function () {
        browser.get('/main/contact');
        element.all(by.css('.lx-intro h1')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('Main - Contact');
        });
    });

    it('should be correct redirect to /examples/home by route /examples', function () {
        browser.get('/examples');

        element.all(by.css('.lx-intro h1')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('Examples Baboon Webtoolkit');
        });
    });

    it('should be correct redirect to /examples/home by route /examples/foo', function () {
        browser.get('/examples/foo');

        element.all(by.css('.lx-intro h1')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('Examples Baboon Webtoolkit');
        });
    });

    it('should be correct content by route /examples/home', function () {
        browser.get('/examples/home');

        element.all(by.css('.lx-intro h1')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('Examples Baboon Webtoolkit');
        });
    });

    it('should be correct redirect to /admin/home by route /admin', function () {
        browser.get('/admin');
        element.all(by.css('.lx-intro h1')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('Admin - Home');
        });
    });

    it('should be correct redirect to /admin/home by route /admin/foo', function () {
        browser.get('/admin/foo');
        element.all(by.css('.lx-intro h1')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('Admin - Home');
        });
    });

    it('should be correct redirect to /admin/home by route /admin/home', function () {
        browser.get('/admin/home');
        element.all(by.css('.lx-intro h1')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('Admin - Home');
        });
    });
});

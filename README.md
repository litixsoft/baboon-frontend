[![baboon-frontend](app/assets/images/logo.png)](http://baboon.litixsoft.de/products-baboon)

# baboon-frontend
> Baboon SPA frontend reference application, based on Angular, backend independent.

> [![Bower version](https://badge.fury.io/bo/baboon-frontend.svg)](http://badge.fury.io/bo/baboon-frontend)
[![Build Status](https://secure.travis-ci.org/litixsoft/baboon-frontend.svg?branch=master)](https://travis-ci.org/litixsoft/baboon-frontend)
[![david-dm](https://david-dm.org/litixsoft/baboon-frontend.svg?theme=shields.io)](https://david-dm.org/litixsoft/baboon-frontend/)
[![david-dm](https://david-dm.org/litixsoft/baboon-frontend/dev-status.svg?theme=shields.io)](https://david-dm.org/litixsoft/baboon-frontend#info=devDependencies&view=table)

## Installation

    $ bower install baboon-frontend
    
The bower module includes only the lib with the directives and services. We are currently working on a yeoman generator for scaffolding a complete app.
    
## Documentation

See the docs folder

## Configure server for html5Mode

### Express Rewrites
```javascript
var fs = require('fs');
var express = require('express');
var path = require('path');

var app = express();

// app files in public
var pub = path.join(__dirname, 'public');
app.use(express.static(pub));

// Just send the app-name.html or index.html to support HTML5Mode
app.all('/:app*', function (req, res) {

    var app = req.params.app;
    var appFile = app + '.html';

    if (appFile === 'main.html' || !fs.existsSync(path.join(pub, appFile ))) {
        res.sendfile('index.html', {root: pub});
    }
    else {
        res.sendfile(appFile, {root: pub});
    }
});

module.exports = app;
```

### Nginx Rewrites

```bash
server {
	listen *:80
	server_name my-app;

    root /path/to/app;

    location ~ ^/(main)|(/$) {
        try_files $uri /index.html;
    }

	location ~ ^/([a-z]+) {
    	set $var $1;
        try_files $uri /$var.html /index.html;
    }
}
```
### Apache Rewrites

```xml
<VirtualHost *:80>
    ServerName my-app

    DocumentRoot /path/to/app

    <Directory /path/to/app>
        RewriteEngine on

        # Don't rewrite files or directories
        RewriteCond %{REQUEST_FILENAME} -f [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^ - [L]

        # Rewrite everything else to index.html or toplevel.html to allow html5 state links
        RewriteRule ^(main)|^($) index.html [L]
        RewriteRule ^([a-z]+) $1.html [L]

    </Directory>
</VirtualHost>
```

## Contributing
Instead of us handing out a formal style guide, simply stick to the existing programming style. Please create descriptive commit messages.
We use a git hook to validate the commit messages against these [rules](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.uyo6cb12dt6w).
Easily expand Baboon with your own extensions or changes in the functionality of baboon-frontend itself. Use this workflow:

1. Write your functionality
2. Write unit tests for your functionality
3. Create an example of your functionality in the sample application (optional)
4. Document your functionality in the documentation section of example app
5. Write unit tests for the example
6. Add end to end tests for the example
7. All tests should be successful
8. Check your test coverage (90 - 100%)
9. Make a pull request

We will check the tests, the example and test coverage. In case your changes are useful and well tested, we will merge your requests.

### Building and Testing baboon-frontend
This section describes how to set up your development environment to build and test baboon-frontend with the example app.

#### System requirements

* Node.js 10.22 or newer

Global node modules

Linux / Mac:

    $ sudo npm install -g bower grunt-cli

Windows:

    $ npm install -g bower grunt-cli
    
#### Install baboon-frontend and run the example app
The example application is also the reference implementation of Baboon.
Fork Baboon repository and install the dependent modules with npm and bower.

    $ git clone https://github.com/litixsoft/baboon-frontend.git
    $ cd baboon-frontend
    $ npm install
    $ bower install
    $ grunt serve

The `grunt serve` command builds the example application in development mode, starts the server and opens the application in a browser.
It then watches for changes inside the directories. When a change is detected, grunt rebuilds the app and reloads the site in the browser.

#### Running test and code coverage
Every test run includes the code style check with eslint.

Unit tests

    $ grunt test
    
Unit tests code coverage

    $ grunt cover
    
End 2 end test with protractor

    $ grunt e2e
    
Unit and e2e tests in production mode (minified files)

    $ grunt test:dist
    
Continuous integration test (generates test results as xml files)

    $ grunt ci
    
## Release a new version
We use [grunt-bump](https://github.com/vojtajina/grunt-bump) and [grunt-conventional-changelog](https://github.com/btford/grunt-conventional-changelog) internally to manage our releases.
To handle the workflow, we created a grunt task `release`. This happens:

* Regenerate the docs for the lib folder
* Create minified version of the modules in the lib
* Bump version in package.json
* Update the CHANGELOG.md file
* Commit in git with message "Release v[`the new version number`]"
* Create a git tag v[`the new version number`]

### Create a new release
Release a new patch

    $ grunt release

Release a new minor version

    $ grunt release:minor

Release a new major version

    $ grunt release:major

## Author
[Litixsoft GmbH](http://www.litixsoft.de)

## License
Copyright (c) 2014-2015 Litixsoft GmbH Licensed under the MIT license.

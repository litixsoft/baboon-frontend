<a name="0.5.15"></a>
### 0.5.15 (2015-03-31)

#### Features

* **lx.sort:** now with font awesome instead twitter bootstrap

<a name="0.5.14"></a>
### 0.5.14 (2015-03-26)


#### Bug Fixes

* **lx.form:** handle case when error object does not contain the field 'property' ([bf5042f3](https://github.com/litixsoft/baboon-frontend/commit/bf5042f33d668dcabd6a5d6b16e2ed76aa1d5aae))


<a name="0.5.13"></a>
### 0.5.13 (2015-03-25)


#### Features

* update to angular.js 1.3.15 ([25991a42](https://github.com/litixsoft/baboon-frontend/commit/25991a424116e1506f6893fab6763025fcea0544))
* **lx.form:** save property "expected" in the server error object of the control ([288f02e5](https://github.com/litixsoft/baboon-frontend/commit/288f02e53403063f8826d9dbf151dfa7b1e67fd7))


<a name="0.5.12"></a>
### 0.5.12 (2015-03-17)


#### Features

* update to angular.js 1.3.14 ([b288de37](https://github.com/litixsoft/baboon-frontend/commit/b288de37946d3d559f4e6c4acf3cf5ca5172cbc8))
* now one can reset the angular form to pristine state when calling lxForm.setModel() ([38ae6f7a](https://github.com/litixsoft/baboon-frontend/commit/38ae6f7aafbc7b7e7fd7d68222696b941882719c))


<a name="0.5.11"></a>
### 0.5.11 (2015-02-25)


#### Bug Fixes

* **lxForm:** do nothing when model is no object when calling setModel(model) ([12455cfc](https://github.com/litixsoft/baboon-frontend/commit/12455cfc9aeefa078316f845c930fbcadd5382d6))


<a name="0.5.10"></a>
### 0.5.10 (2015-02-13)


#### Features

* **lx.socket:** broadcast event 'socket:connect' when the socket is connected ([7b0fb1d1](https://github.com/litixsoft/baboon-frontend/commit/7b0fb1d10639a71eebd59a3e45a8e17cf015bc2c))


<a name="0.5.9"></a>
### 0.5.9 (2015-02-12)


#### Features

* **lx.socket:** add option "autoconnect" to control if the socket connects automatically when $lxSocket $get() factory function is called
* **lx.socket:** add method connect() to $lxSocket to make a manual connection, you can pass an option object to the connect function which is then merged with original options from the set() method


<a name="0.5.8"></a>
### 0.5.8 (2015-01-30)


#### Bug Fixes

* **lx.form:** setModel() now also stores the model in cache correctly when no key is given ([91cb146f](https://github.com/litixsoft/baboon-frontend/commit/91cb146fb0fef0df4db4682bb3998e38b52b9670))


<a name="0.5.7"></a>
### 0.5.7 (2015-01-27)


#### Features

* update to angular 1.3.11 ([25980a91](https://github.com/litixsoft/baboon-frontend/commit/25980a9130fe73a7566c71fa1e133a1eb6f2bdf5))


<a name="0.5.6"></a>
### 0.5.6 (2015-01-16)


#### Bug Fixes

* **lx.navigation:** property resources was missing in cloneNavObject() ([a429116e](https://github.com/litixsoft/baboon-frontend/commit/a429116ec2ba27e7521256b6831b7b8f80d8bad4))


#### Features

* update to angular 1.3.9 ([12258cae](https://github.com/litixsoft/baboon-frontend/commit/12258cae6ed6e3110798d893f26e0d2c3750ead1))


<a name="0.5.5"></a>
### 0.5.5 (2014-12-09)


#### Bug Fixes

* **lx.pager:** currentPage was always set to 1 when initializing the pager ([fa31d8c7](https://github.com/litixsoft/baboon-frontend/commit/fa31d8c7de1b01064e1c29680fbe0c55d8fb9cbf))


#### Features

* update to angularjs 1.3.6 ([bcb594b1](https://github.com/litixsoft/baboon-frontend/commit/bcb594b1430a0aa0e36187997f47d0ccdefacf4c))
* update to angularjs 1.3.5 ([6f760ff7](https://github.com/litixsoft/baboon-frontend/commit/6f760ff71452387616eed74c9cd642207af04700))


<a name="0.5.4"></a>
### 0.5.4 (2014-11-25)


#### Bug Fixes

* copy fonts in dist build ([eab2e65d](https://github.com/litixsoft/baboon-frontend/commit/eab2e65d387309311664c4ef4c43716aaab48d02))


#### Features

* update to angular.js 1.3.4 ([10cf0db3](https://github.com/litixsoft/baboon-frontend/commit/10cf0db372461855e645145946bf2a6c772e21e0))
* update to angular.js 1.3.3 ([584acb55](https://github.com/litixsoft/baboon-frontend/commit/584acb55c9c77ec463199d2fc9837d802210e3ba))
* update to angular.js 1.3.2 ([c67dc897](https://github.com/litixsoft/baboon-frontend/commit/c67dc897c5b26742b916530f2d8adade09726ac4))


<a name="0.5.3"></a>
### 0.5.3 (2014-11-03)


#### Bug Fixes

* bower.json fontwaesome ([4278a71f](https://github.com/litixsoft/baboon-frontend/commit/4278a71f27822d664aaedffe3deb7168857ec3e6))
* documentation in lx_socket was wrong ([7831b6bc](https://github.com/litixsoft/baboon-frontend/commit/7831b6bc784dd311f27c7f4ee6b1d8cc62502fb3))


#### Features

* add service lxForm to lib ([ee946956](https://github.com/litixsoft/baboon-frontend/commit/ee94695610e12a6758b3a759ef23118c2ae6eba2))
* add directive lxSort to lib ([4ac7bc85](https://github.com/litixsoft/baboon-frontend/commit/4ac7bc8548c11ec482c8e74bdce13b3c993fb44f))
* add directive lxPager to lib ([5f5e7f13](https://github.com/litixsoft/baboon-frontend/commit/5f5e7f13c1efbd4c84e4da30419b1ca19beacf09))
* add directive lxFocus to lib ([f8cb79a2](https://github.com/litixsoft/baboon-frontend/commit/f8cb79a2d291bf4f9c265d04fe4dd14b4ff8f74f))
* add directive lxConfirm lib ([3228f1c7](https://github.com/litixsoft/baboon-frontend/commit/3228f1c7898bd2ba1661e8a7f774c38e393ec53a))
* add directive lxFloat to lib ([ca807045](https://github.com/litixsoft/baboon-frontend/commit/ca8070457d212033d3bf2817a3fdbcac506f8e2d))
* add directive lxInteger to lib ([3a5707ed](https://github.com/litixsoft/baboon-frontend/commit/3a5707ed6706b1c36c1e90ce39ccffb12cde429d))


<a name="0.5.2"></a>
### 0.5.2 (2014-10-15)


#### Bug Fixes

* socket emit loop ([064787aa](https://github.com/litixsoft/baboon-frontend/commit/064787aa404eea5c8b5e6f1a668f654ee0e963d9))
* livereload change to 127.0.0.1, and fix watch task ([515a462e](https://github.com/litixsoft/baboon-frontend/commit/515a462e2fe9f8918bf0e2e0c6f6944c37549a61))


#### Features

* $lxSocket ([aca7eede](https://github.com/litixsoft/baboon-frontend/commit/aca7eede2b6f193b6d3a4237912a219152cf3715))
* server boot sequence async tasks ([f82deb2d](https://github.com/litixsoft/baboon-frontend/commit/f82deb2d03e4f81bff91ce9b723c872e0dd949cf))
* embeded express static server ([12f65264](https://github.com/litixsoft/baboon-frontend/commit/12f652646f3c115552bc9d0a2e7d68512ec658ad))


<a name="0.5.1"></a>
### 0.5.1 (2014-07-24)


#### Bug Fixes

* disable socket.io and rest tests ([55a061b1](https://github.com/litixsoft/baboon-frontend/commit/55a061b1a1b4579167119a932ec390bf0270afe8))


<a name="0.5.0"></a>
### 0.5.0 (2014-07-24)

* init project

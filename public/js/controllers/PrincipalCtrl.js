app.controller('PrincipalCtrl', function ($scope, $timeout, ModalService, $anchorScroll, $location, User, $http) {

    var teste = 'mantra2017';

    $scope.pergunta = '';
    $scope.desc1 = '';
    $scope.desc2 = '';
    $scope.desc3 = '';
    $scope.desc4 = '';

    $scope.preview = function () {

        $http.defaults.headers.post["Content-Type"] = 'application/json';
        $http.post('/api/postTesteResult', {
            nomeTeste: teste,
            idUserFB: $scope.user.idUserFB
        }).then(function (res) {
            console.log(res.data.message)
            if (res.data.message === 'successFeito' || res.data.message === 'successNovo') {

                $scope.pergunta = res.data.pergunta;
                $scope.desc1 = res.data.teste.desc1;
                $scope.desc2 = res.data.teste.desc2;
                $scope.desc3 = res.data.teste.desc3;
                $scope.desc4 = res.data.teste.desc4;

                $timeout(function () {
                    $scope.$apply();
                });

                $timeout(function () {
                    salvaImagem(teste);
                }, 1000);

            } else {
                console.log(res.data.message)
            }

        }, function (err) {
            // Error
            console.log(err);
        });


    };

    $scope.shareOnFacebook = function () {
        FB.ui({
            method: 'feed',
            name: 'globalFacebookShareObject.name',
            link: 'www.facebooktestes.com.br',
            caption: 'R$ ' + 'globalFacebookShareObject.caption',
            picture: 'https://www.sagesponline.com.br/img/fbshare.png',
            description: 'globalFacebookShareObject.description'
        }, function (response) {
            if (response && response.post_id) { }
            else { }
        });
    }

    function salvaImagem(nomeTeste) {

        var element = document.getElementById(nomeTeste);
        //element.style.display = "block";
        html2canvas(element, {
            proxy: "/proxy",
            onrendered: function (canvas) {
                //element.style.display = "none";
                var base64Data = canvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");

                $http.post('/api/postImg/', {
                    idUserFB: $scope.user.idUserFB,
                    teste: nomeTeste,
                    file: base64Data
                })
                    .success(function (data) {
                        console.log(data.message)
                    })
                    .error(function (data) {
                        console.log(data.erro);
                    });

            },
            width: 600,
            height: 315
        });

    }

    $scope.scrollTo = function (id) {
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll();
        //reset to old to keep any additional routing logic from kicking in
        $location.hash(old);
    };

    $scope.user = User.getUser();

    $scope.mostraModal = function () {

        ModalService.showModal({
            templateUrl: "/templates/modal.html",
            controller: "ModalCtrl"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                //$scope.message = result ? "You said Yes" : "You said No";
            });
        });

    };

    function statusChangeCallback(response) {
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            testAPI();
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            console.log('Please log into this app.');
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            console.log('Please log into this Facebook.');
        }
    }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    function checkLoginState() {
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    }

    window.fbAsyncInit = function () {
        FB.init({
            appId: '352466038438543',
            cookie: true,  // enable cookies to allow the server to access 
            // the session
            xfbml: true,  // parse social plugins on this page
            version: 'v2.8' // use graph api version 2.5
        });

        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });

    };

    // Load the SDK asynchronously
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    } (document, 'script', 'facebook-jssdk'));

    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    function testAPI() {
        FB.api('/me?fields=birthday,email,gender,first_name,last_name,picture.width(300).height(300)', function (response) {

            var newUser = User.getUser();

            newUser.name = response.first_name;
            newUser.lastName = response.last_name;
            newUser.birthday = response.birthday;
            newUser.email = response.email;
            newUser.gender = response.gender;
            newUser.picture = response.picture.data.url;
            newUser.idUserFB = response.id;

            User.setUser(newUser);

            $scope.user = newUser;
            $scope.$apply();

            $http.defaults.headers.post["Content-Type"] = 'application/json';
            $http.post('/api/postUser', {
                email: $scope.user.email,
                name: $scope.user.name,
                lastName: $scope.user.lastName,
                idUserFB: $scope.user.idUserFB,
                gender: $scope.user.gender,
                birthday: $scope.user.birthday

            }).then(function (res) {
                console.log(res.data.message);
            }, function (err) {
                // Error
                console.log(err);
            });


        });
    }

});
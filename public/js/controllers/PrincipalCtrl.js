app.controller('PrincipalCtrl', function ($scope, $window, $timeout, ModalService, $anchorScroll, $location, User, $http, $routeParams) {

    $scope.testeSelecionado = '';
    $scope.temTeste = false;
    $scope.perguntaTeste = '';
    $scope.etapa = '';
    $scope.concluido = false;
    $scope.mostraShare = false;
    $scope.mostraOverlay = false;
    $scope.logadoFace = false;
    $scope.nomeUser = 'Desconhecido';

    if ($routeParams.teste != undefined) {
        $scope.temTeste = true;

        $http.defaults.headers.common["Content-Type"] = 'application/json';
        $http.defaults.headers.common["nome"] = $routeParams.teste;

        $http.get('/api/getTestePergunta')
            .success(function (data, status, headers, config) {

                $scope.perguntaTeste = data.teste.pergunta;
                //console.log(JSON.stringify(data.teste))


                $timeout(function () {
                    $scope.$apply();
                });
            })
            .error(function (data, status, headers, config) {

                console.log(data.message)
            });

    }

    $scope.pergunta = '';
    $scope.desc1 = '';
    $scope.desc2 = '';
    $scope.desc3 = '';
    $scope.desc4 = '';

    $scope.calculaTeste = function (teste) {
        if ($scope.logadoFace) {
            $scope.etapa = 'Enviando informações...';
            $scope.mostraOverlay = true;

            if (teste === 'url') {
                $scope.testeSelecionado = $routeParams.teste;
            } else {
                $scope.testeSelecionado = teste;
            }


            $http.defaults.headers.post["Content-Type"] = 'application/json';
            $http.post('/api/postTesteResult', {
                nomeTeste: $scope.testeSelecionado,
                idUserFB: $scope.user.idUserFB
            }).then(function (res) {
                //console.log(res.data.message)
                if (res.data.message === 'successFeito' || res.data.message === 'successNovo') {

                    $scope.pergunta = res.data.pergunta;
                    $scope.desc1 = res.data.teste.desc1;
                    $scope.desc2 = res.data.teste.desc2;
                    $scope.desc3 = res.data.teste.desc3;
                    $scope.desc4 = res.data.teste.desc4;

                    //console.log(JSON.stringify(res.data))

                    $timeout(function () {
                        $scope.$apply();
                    });
                    $scope.etapa = 'Verificando dados...';

                    $timeout(function () {
                        $scope.etapa = 'Analizando perfil...';
                    }, 2000);

                    $timeout(function () {
                        $scope.etapa = 'Calculando...';
                        salvaImagem($scope.testeSelecionado);
                    }, 4000);

                } else {
                    console.log(res.data.message)
                    $scope.etapa = 'Algum erro ocorreu ;(!';
                    $scope.concluido = true;
                    $scope.mostraShare = false;
                }

            }, function (err) {
                // Error
                console.log(err);
                $scope.etapa = 'Algum erro ocorreu ;(!';
                $scope.concluido = true;
                $scope.mostraShare = false;
            });
        } else {
            $window.alert('Você deve logar na sua conta do Facebook para realizar os testes!');
        }




    };
    $scope.fecha = function () {
        $scope.mostraOverlay = false;
        $scope.concluido = false;
        $scope.mostraShare = false;

    }
    $scope.shareOnFacebook = function () {
        $scope.mostraOverlay = false;
        $scope.concluido = false;
        $scope.mostraShare = false;
        FB.ui({
            method: 'feed',
            name: 'Facebook Testes',
            link: 'http://www.facebooktestes.com.br/#/principal/' + $scope.testeSelecionado,
            caption: 'www.facebooktestes.com.br',
            picture: 'http://www.facebooktestes.com.br/api/imagem/' + $scope.user.idUserFB + '_' + $scope.testeSelecionado + '.png',
            description: 'Venha se divertir e fazer este e vários outros testes que preparamos cuidadosamente para você!'
        }, function (response) {
            if (response && response.post_id) { }
            else { }
        });
    }

    function salvaImagem(nomeTeste) {


        var element = document.getElementById(nomeTeste);
        element.style.display = "block";
        html2canvas(element, {
            proxy: "/proxy",
            onrendered: function (canvas) {
                element.style.display = "none";
                var base64Data = canvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");

                $http.post('/api/postImg/', {
                    idUserFB: $scope.user.idUserFB,
                    teste: nomeTeste,
                    file: base64Data
                })
                    .success(function (data) {
                        //console.log(data.message)

                        $timeout(function () {
                            $scope.etapa = 'Teste realizado com sucesso!';
                            $scope.concluido = true;
                            $scope.mostraShare = true;
                        }, 2000);
                    })
                    .error(function (data) {
                        console.log(data.erro);
                        $scope.etapa = 'Algum erro ocorreu ;(!';
                        $scope.concluido = true;
                        $scope.mostraShare = false;

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

    $scope.loginFace = function () {
        FB.login(function (response) {
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
        });

    }

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
            $scope.nomeUser = $scope.user.name;
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
                //console.log(res.data.message);
                $scope.logadoFace = true;
            }, function (err) {
                // Error
                $window.alert('Ocorreu algum erro ao logar!');
                console.log(err);
            });


        });
    }

});
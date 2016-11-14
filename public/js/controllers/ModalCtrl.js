app.controller('ModalCtrl', function ($scope, User, $http) {

    $scope.user = User.getUser();
    console.log(JSON.stringify($scope.user))
    $scope.preview = function () {
        var element = document.getElementById("imagem");

        

        //element.style.display = "block";
        html2canvas(element, {
            onrendered: function (canvas) {
                //element.style.display = "none";
                var dataURL = canvas.toDataURL("image/png");
                var base64Data = dataURL.replace(/^data:image\/png;base64,/, "");

                $http.post('/api/postImg/', {
                    id: $scope.user.id,
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
    };

});
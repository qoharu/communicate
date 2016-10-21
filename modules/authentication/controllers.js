angular.module('Authentication')

app.controller('LoginController', ['$scope', '$rootScope', '$location', '$http',
    function($scope, $rootScope, $location, $http) {

        $scope.login = function() {
            $scope.dataLoading = true;

            realm = $scope.username.split('@')[1];
            impi = $scope.username.split('@')[0];
            impu = 'sip:' + $scope.username;
            password = $scope.password;
            
            txtDisplayName.value = impi;
            txtPrivateIdentity.value = impi;
            txtPublicIdentity.value = impu;
            txtPassword.value = password;
            txtRealm.value = realm;

            localStorage.setItem("cmn-user",$scope.username);
            sipRegister();
        };

    }
]);
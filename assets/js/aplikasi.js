angular.module('Authentication', []);
angular.module('Home', []);

var app = angular.module('Communicate', [
    'Authentication',
    'Home',
    'ngRoute'
])
 
app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })
 
        .when('/home', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
 
        .otherwise({ redirectTo: '/login' });
}])
 
app.run(['$rootScope', '$location', '$http',
    function ($rootScope, $location, $http) {

        if (localStorage.getItem("cmn-islogin")){
            sipRegister();
            $location.path('/home');
        }else{
            $location.path('/login');
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            if ($location.path() !== '/login' && !localStorage.getItem("cmn-islogin")) {
                $location.path('/login');
            }else if($location.path() == '/login' && localStorage.getItem("cmn-islogin")){
                sipRegister();
                $location.path('/home');
            }
        });
    }]);

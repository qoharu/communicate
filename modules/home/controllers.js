app.filter('searchFor', function() {

    return function(arr, searchString) {
        if (!searchString) {
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();

        angular.forEach(arr, function(friendlist) {
            if (friendlist.contact_sip.toLowerCase().indexOf(searchString) !== -1) {
                result.push(friendlist);
            }
        });
        return result;
    };
});


// app.directive('schrollBottom', function () {
//   return {
//     scope: {
//       schrollBottom: "="
//     },
//     link: function (scope, element) {
//       scope.$watchCollection('schrollBottom', function (newValue) {
//         if (newValue)
//         {
//           $(element).scrollTop($(element)[0].scrollHeight);
//         }
//       });
//     }
//   }
// })

app.controller('HomeController', function($scope, $http, $location) {
    $scope.socket = false;
    $scope.chatopened = 0;
    $scope.onvideocall = 0;
    $scope.receivecall = 0;
    $scope.chatdata = [];
    $scope.apalah = [];

    $scope.fullname = localStorage.getItem("cmn-user").split("@")[0];
    $scope.id_user = localStorage.getItem("cmn-uid");

    $http.post("api/friendlist", {
        sip: localStorage.getItem("cmn-user")
    }).success(function(response) {
        $scope.friendlist = response.friendlist;
    });

    // $scope.videoCall = function(){
    //   sipCall('call-audiovideo');
    //   $('#modalNotif').modal('hide');
    //   $('#modalVideo').modal('show');
    // }
    // $scope.voiceCall = function(){
    //   sipCall('call-audio');
    //   // $('#audio').modal('show')
    // }
    $scope.chat = function(sipname) {
        $scope.chatopened = 1;
        $scope.chatdetail = sipname;
        txtPhoneNumber.value = sipname;
    }

    $scope.addContact = function(){
        $http.post("api/add", {
            mysip: localStorage.getItem("cmn-user"),
            sip: $scope.sipContact
        }).success(function(response) {
            alert(response.message);
            $location.path('/');
        });
    }

    newchat = function(from,to,message){
        if (from == localStorage.getItem("cmn-user")) {
            left = false;
        }else{
            left = true;
        };

        $scope.apalah.push({
            from: from,
            to: to,
            message:message,
            left:left
        });
        $scope.$apply();
        var divnya = document.getElementById("divnya");
        divnya.scrollTop = divnya.scrollHeight;
    }
    $scope.sendMessage = function(){
        sipMessage($scope.chatdetail, $scope.newMessage);
        newchat(localStorage.getItem("cmn-user"),$scope.chatdetail,$scope.newMessage);

        $scope.newMessage = null;
    }
    $scope.logout = function() {
        sipUnRegister();
        bootbox.alert("You have been logged out");
        localStorage.clear();
        $location.path('/');
    }


});
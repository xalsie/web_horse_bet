(function(angular) {
  'use strict';
  const urlApp = '/horse';
  var app = angular.module('appRoot', []);

  app.filter('unixToDate', () => {
    return (x) => {
      return moment.unix(x).format("lll");
    }
  });

  app.controller('appCommon', ['$scope', '$http', '$location', '$window', ($scope, $http, $location, $window) => {
    // ##############
    // Déclaration Func
    $scope.onClick = (e) => {
      if (e.target.className != "nav-link text-white") return; // is not section not return

      if (($scope.editableLine || $scope.btnSave)) {
        if (!window.confirm("Les actions ne sont pas enregistré, Etes-vous sur de vouloir quitter la page ?")) {
          e.preventDefault();
          return false;
        }
      }

      $scope.editableLine = false;
      $scope.btnSave = false;

      $scope.sidenav = e.target.attributes[1].value;
      $scope.sectionTitle = e.target.innerHTML;
      if ($scope.sidenav != 8) $scope.getFromUrl($scope.sidenav);
    }

    // $scope.getPseudoById = async (id) => {
    //   var response = await $http.get(urlApp+"/getPseudoById?id="+id);

    //   return response.data;
    // }

    // $scope.getFromUrl = async (idNav) => {
    //   $http.get(urlApp+"/inventaire").then((response) => {
    //     $scope.responseMap = response.data;
    //     $scope.sectionData = response.data.list[idNav];
    //     $scope.toDateUpdateSection = response.data.list[idNav].majTime;
    //     $http.get(urlApp+"/getPseudoById?id="+response.data.list[idNav].majId).then((responsePseudo) => {
    //       $scope.toNameUpdateSection = responsePseudo.data;
    //     })
    //   })
    // }

    // $scope.param = (data) => {
    //   var _rtn = false;
    //   data = parseInt(data);

    //   switch (data) {
    //     case 1: case 2: case 3: case 7:
    //       _rtn = 1;
    //       break;
    //     case 4: case 5: case 6:
    //       _rtn = 2;
    //       break;
    //   }

    //   return _rtn;
    // }

    $scope.getSession = () => {
      $http({
        method: "POST",
        url: urlApp+"/getSession",
        dataType: 'json',
        data: {
          autofunc: true
        },
        headers: { "Content-Type": "html/json" }
      }).then((res) => {
        $scope.session        = res.data;
        $scope.session.grade  = parseInt($scope.session.grade);
        $scope.permission     = (Boolean(($scope.session.loggedin && $scope.session.permission))?1:0);

        console.log($scope.session)
      });
    }

    $scope.getListRace = () => {
      $http({
        method: "POST",
        url: urlApp+"/getListRace",
        dataType: 'json',
        data: {
          autofunc: true,
          timestamp: ($scope.listTime)? moment($scope.listTime).unix():moment().unix()
        },
        'Content-Type': 'application/x-www-form-urlencoded' // fix req.body empty ..
      }).then((res) => {
        if (res.data[0].length == 0)
          $scope.listRaceIsLoading = true;
        else
          $scope.listRaceIsLoading = false;

        $scope.listRace  = res.data;
      });
    }

    $scope.getProfile = () => {
      $http({
        method: "POST",
        url: urlApp+"/getProfile",
        dataType: 'json',
        data: {
          autofunc: true
        },
        headers: { "Content-Type": "html/json" }
      }).then((res) => {
        $scope.profile  = res.data;
      });
    }

    $scope.saveProfile = () => {
      var profile = JSON.stringify($scope.profile);

      $http({
        method: "POST",
        url: urlApp+"/saveprofile",
        dataType: 'json',
        data: {
          autofunc: true,
          action: profile
        },
        headers: { "Content-Type": "application/json" }
      }).then((res) => {
        console.log(res);

        $scope.profile.date_modif = moment().unix();
        $scope.profile.modif_name = $scope.profile.pseudo;

        $scope.session.fname    = $scope.profile.firstname;
        $scope.session.lname    = $scope.profile.lastname;
        $scope.session.pseudo   = $scope.profile.pseudo;
        $scope.session.group    = $scope.profile.group;
        $scope.session.grade    = parseInt($scope.profile.grade);
        $scope.session.permission = (Boolean(($scope.session.loggedin && $scope.profile.permission))?1:0);
        // $scope.session    = res.data;
        // $scope.permission = ($scope.session.loggedin && $scope.session.permission == 1);
      });
    }

    $scope.convertNumber = (x) => {
      return "$ "+parseInt(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    window.addEventListener("beforeunload", function (e) {
      if ($scope.editableLine || $scope.btnSave) {
        var confirmationMessage = "\o/";

        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }

      return false;
    });

    // ############
    // Init
    $scope.responseMap  = $scope.editableLine = $scope.btnSave = false;
    $scope.sectionData  = false;
    $scope.permission   = false;
    $scope.toNameUpdateSection = "";
    $scope.toDateUpdateSection = "";
    $scope.logs = {};
    $scope.logs.delete = [];
    $scope.logs.modify = {};
    $scope.logs.add = {};
    $scope.listRaceIsLoading = false;
    $scope.listRace = {};
    $scope.listTime = false;

    $scope.getSession();
    // $scope.getProfile();
    // $scope.getListRace();

    // $scope.autoSelectUrl();

    $scope.openRace = (id) => {
      $window.open('race?'+id, 'blank');
      console.log(id);
    };
  }]);


  app.controller('appRacePage', ['$scope', '$http', '$location', '$window', ($scope, $http, $location, $window) => {

  }]);

})(window.angular);

function uuidGen(count) {
  var founded = false;
  var _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
  var str = '';

  for(var i = 0; i < count; i++) {
    str += _sym[parseInt(Math.random() * (_sym.length))];
  }

  return "$1/"+str;
}
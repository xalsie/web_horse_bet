(function(angular) {
  'use strict';
  const urlApp = '/horse';
  var app = angular.module('appRoot', []);

  app.filter('unixToDate', () => {
    return (x) => {
      return moment.unix(x).format("lll");
    }
  });

  app.controller('appCommon', ['$scope', '$http', '$window', ($scope, $http, $window) => {

    var socket = io(); console.log("socket created");

    // var timeOut = setTimeout(function() {
    //   socket.emit('chat message', "timeOut 3s : for app-angular.js"+$scope.session.pseudo); //send socket server !
    //   console.log("timeOut 3s : for app-angular.js", $scope.session.pseudo);
    //   return;
    // }, 3000); // 5 minutes = 300000 ms


    socket.on('toUpdateListRace', (arr) => {
      $scope.getListRace()

      const modal = $("#Modal-notification");
        modal.modal('show');
      const timeout = setTimeout(() => {
          modal.modal('hide')
      }, 3000)
    })

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
        headers: { "Content-Type": "application/json" }
      }).then((res) => {
        $scope.session        = res.data;
        $scope.session.grade  = parseInt($scope.session.grade);
        $scope.permission     = (Boolean(($scope.session.loggedin && $scope.session.permission))?1:0);

        console.log($scope.session)
      });
    }

    $scope.getListRace = async () => {
      const rtn = await $http({
        method: "POST",
        url: urlApp+"/getListRace",
        dataType: 'json',
        data: {
          autofunc: true,
          timestamp: ($scope.listTime)? moment($scope.listTime).unix():moment().unix()
        },
        headers: { "Content-Type": "application/json" }
        // 'Content-Type': 'application/x-www-form-urlencoded' // fix req.body empty ..
      }).then((res) => {
        if (res.data[0].length == 0)
          $scope.listRaceIsLoading = true;
        else
          $scope.listRaceIsLoading = false;

        $scope.listRace = res.data[0];
        $scope.listRaceVictory = res.data[1];
        
        console.log($scope.listRace, $scope.listRaceVictory)
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
        headers: { "Content-Type": "application/json" }
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
        // console.log(res);

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
    $scope.listRaceVictory = {};
    $scope.listTime = false;

    $scope.getSession();
    // $scope.getProfile();
    // $scope.getListRace();
    // $scope.autoSelectUrl();

    $scope.openRace = (id) => {
      $window.open('/horse/race?'+moment($scope.listTime).unix()+"&"+id, '_self');
    };
  }]);

  app.controller('appRacePage', ['$scope', '$http', '$window', ($scope, $http, $window) => {

    var socket = io(); console.log("socket created");

    socket.on('toUpdateListRace', (arr) => {
      $scope.getPartant()

      const modal = $("#Modal-notification");
        modal.modal('show');
      const timeout = setTimeout(() => {
          modal.modal('hide')
      }, 3000)
    })



    // ############
    // Func
    $scope.returnListRace = () => {
      $window.open('/horse?'+window.location.href.split('?')[1].split('&')[0], '_self');
    }

    $scope.getPartant = () => {
      var [ _timestamp, _idRace ] = window.location.href.split('?')[1].split('&');

      $http({
        method: "POST",
        url: urlApp+"/getPartant",
        dataType: 'json',
        data: {
          autofunc: true,
          idRace: _idRace
        },
        headers: { "Content-Type": "application/json" }
      }).then((res) => {
        $scope.detailRace   = res.data[0][0];
        $scope.listPartant  = res.data[1];
      });
    }

    $scope.getSession = () => {
      $http({
        method: "POST",
        url: urlApp+"/getSession",
        dataType: 'json',
        data: {
          autofunc: true
        },
        headers: { "Content-Type": "application/json" }
      }).then((res) => {
        $scope.session        = res.data;
        $scope.session.grade  = parseInt($scope.session.grade);
        $scope.permission     = (Boolean(($scope.session.loggedin && $scope.session.permission))?1:0);
      });
    }

    $scope.toggleSelection = (key) => {
      var idx = $scope.selection.indexOf(key);

      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      } else {
        $scope.selection.push(key);
      }

      console.log($scope.selection)
    };

    $scope.extended_valid_bet_up = true;
    $scope.extended_valid_bet_down = false;

    $scope.toggle_extended_valid_bet = () => {
      $scope.extended_valid_bet_up = !$scope.extended_valid_bet_up;

      var element = document.getElementsByClassName("footer")[0];

      element.classList.toggle('footer--extended')
    }

    $scope.calculbet = () => {
      var enjeu = 0;
      var gain = 0;
      var i, k, j = 0;
      document.getElementsByClassName("input_bet_val").forEach((value, key) => {
        i = document.getElementsByClassName("span_racer_numero")[key].innerHTML;
        j = ((!isNaN(parseInt(value.value)))? parseInt(value.value):0)
        k = document.getElementsByClassName("p_quote_val")[key].innerHTML;

        $scope.test[key] = {i, j, k}

        enjeu += j;
        gain += parseInt(k.split("/")[0]) / parseInt(k.split("/")[1]) * j;

      });

      $scope.enjeuTotal = parseInt(enjeu);
      $scope.gainTotal = parseInt(gain)
    }

    $scope.to_validate_bet = () => {
      if ($scope.detailRace.isEnd == '2' || $scope.detailRace.isEnd == 'true')
        return;

      var [ _timestamp, _idRace ] = window.location.href.split('?')[1].split('&');

      $http({
        headers: { "Content-Type": "application/json" },
        method: "POST",
        url: urlApp+"/tovalidate",
        dataType: 'json',
        data: {
          autofunc: true,
          action: "validate_betting",
          data: JSON.stringify([_idRace, $scope.test])
        },
        async: true
      }).then((res) => {
        if (String(res.data)) {
          $scope.selection = [];

          $scope.telephones = [];
          $scope.test = [];
          $scope.enjeuTotal = 0;
          $scope.gainTotal = 0;

          $scope.toggle_extended_valid_bet();

          for (let i = 0; i < $scope.listPartant.length; i++) {
            if ($scope.listPartant[i].selected) {
              $scope.listPartant[i].selected = false;
            }
          }

        }
      })
    }

    $scope.getPodium = () => {
      var [ _timestamp, _idRace ] = window.location.href.split('?')[1].split('&');

      $http({
        method: "POST",
        url: urlApp+"/getPodium",
        dataType: 'json',
        data: {
          autofunc: true,
          idRace: _idRace
        },
        headers: { "Content-Type": "application/json" }
      }).then((res) => {
        $scope.podium   = res.data[0];
      });
    }

    // ############
    // Init
    $scope.detailRace   = {};
    $scope.podium       = {};
    $scope.listPartant  = {};
    $scope.listQuote    = {};
    $scope.selection    = [];

    $scope.telephones = [];
    $scope.test = []
    $scope.enjeuTotal = 0;
    $scope.gainTotal = 0;

    $scope.getPartant();
    $scope.getSession();
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
angular.module('starter.controllers', ['textAngular'])

  .controller('AppCtrl', function ($http, $scope, $ionicModal, $timeout, $stateParams, $state, $cookieStore, $window, $ionicPopup, $localStorage, $sessionStorage) {


    $scope.buttonColour = function (votes) {
      if (votes < 0)
        return "#8C662E";
      else if (votes >= 1 && votes <= 25)
        return "#8C662E";
      else if (votes >= 26 && votes <= 50)
        return "#8C662E";
      else if (votes >= 51 && votes <= 99)
        return "#8C662E";
      else if (votes >=100)
        return "#8C662E";


    };

    // Logout user
    $scope.logout = function () {
      $scope.storage.$reset();
      $state.go('app.coffees');
      $window.location.reload();
    };

    $scope.storage = $localStorage;


    $scope.user = $cookieStore.get('userInfo');

    // Form data for the login modal
    $scope.loginData = {};
    $scope.signupData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Create the signup modal that we will use later
    $ionicModal.fromTemplateUrl('templates/signup.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modalsignup = modal;
    });

    // Create the profile modal that we will use later
    $ionicModal.fromTemplateUrl('templates/profile.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modalprofile = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Triggered in the login modal to close it
    $scope.closeSignup = function () {
      $scope.modalsignup.hide();
    };

    // Triggered in the login modal to close it
    $scope.closeProfile = function () {

      $timeout(function () {
        $scope.modalprofile.hide();
      }, 500);
    };

    // Open the login modal
    $scope.login = function () {

      $scope.modalsignup.hide();
      $scope.modalprofile.hide();

      $timeout(function () {
        $scope.modal.show();
      }, 500);


    };

    // Open the login modal
    $scope.profile = function () {


      $scope.modalsignup.hide();
      $scope.modal.hide();

      $timeout(function () {
        $scope.modalprofile.show();
      }, 500);

    };

    // Open the signup modal
    $scope.signup = function () {

      $scope.modalprofile.hide();
      $scope.modal.hide();

      $timeout(function () {
        $scope.modalsignup.show();
      }, 500);


    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {

      // console.log('Doing login', $scope.loginData);
      // alert('Doing login');

      $scope.data = {};
      $scope.data.username = $scope.loginData.username;
      $scope.data.password = $scope.loginData.password;

      // http://www.coffeemate.club/api/auth/signin


      $timeout(function () {

        $http.post("http://www.coffeemate.club/api/auth/signin", $scope.data).success(function (data1, status) {
          $scope.hello = data1;

          console.log($scope.hello);

          $scope.storage.username = $scope.hello.username;
          $scope.storage.email = $scope.hello.email;
          $scope.storage.provider = 'local';
          $scope.storage.gender = $scope.hello.gender;
          $scope.storage._id = $scope.hello._id;
          $scope.storage.profilePic = $scope.hello.profileImageURL;
          $scope.storage.created = $scope.hello.created;
          $scope.storage.county = $scope.hello.county;

          $scope.storage.aboutme = $scope.hello.aboutme;

          if ($scope.hello.profileImageURL.substring(0, 3) === 'mod') {
            $scope.storage.profilePic = 'http://www.coffeemate.club/' + $scope.hello.profileImageURL;
          } else if ($scope.hello.profileImageURL.substring(0, 6) === '../mod') {
            $scope.storage.profilePic = 'http://www.coffeemate.club/' + $scope.storage.profilePic.substring(3);
          }

          $scope.modal.hide();
          $scope.modalsignup.hide();
          // $window.location.reload();

        }).error(function (data, status, header, config) {

          $ionicPopup.alert({
            title: 'Login Failed.'
          });

        });

      }, 1000);
    };

    // Perform the signup action when the user submits the signup form
    $scope.doSignup = function () {

      // console.log('Doing login', $scope.loginData);
      // alert('Doing Signup');

      $scope.data = {};
      $scope.data.firstName = $scope.signupData.signupFirstName;
      $scope.data.lastName = $scope.signupData.signupSurname;
      $scope.data.email = $scope.signupData.signupEmail;
      $scope.data.username = $scope.signupData.signupUsername;
      $scope.data.password = $scope.signupData.signupPassword;
      // $scope.data.password2 = $scope.signupData.signupPassword2;

      // http://www.coffeemate.club/api/auth/signin


      $timeout(function () {

        $http.post("http://www.coffeemate.club/api/auth/signup", $scope.data).success(function (data1, status) {
          $scope.hello = data1;

          $scope.loginData.username = $scope.hello.username;
          $scope.loginData.password = $scope.signupData.signupPassword;


          $scope.doLogin();

          $timeout(function () {
            $scope.modalsignup.hide();
          }, 1000);

        }).error(function (data, status, header, config) {

          $ionicPopup.alert({
            title: 'Signup Incorrect'
          });

        });

      }, 1000);
    };


    $http.get('http://www.coffeemate.club/api/coffees').success(function (dataProfile) {
      $scope.coffeesProfile = dataProfile;

      $scope.coffeesCountTotal = 0;
      for (i = 0; i < $scope.coffeesProfile.length; i++) {

        if ($scope.coffeesProfile[i].user._id === $scope.storage._id) {

          $scope.coffeesCountTotal++;
        }
      }

    });
    $http.get('http://www.coffeemate.club/coffees/usersSavingsPostedTotal/' + $scope.storage._id).success(function (dataProfile) {
      $scope.coffeesByUser = dataProfile;
      $scope.totalUpvotes = 0;
      $scope.totalDownvotes = 0;

      for (var i = 0; i < $scope.coffeesByUser.length; i++) {

        $scope.totalUpvotes = $scope.totalUpvotes + $scope.coffeesByUser[i].upVoters.length;
      }

      for (var x = 0; x < $scope.coffeesByUser.length; x++) {

        $scope.totalDownvotes = $scope.totalDownvotes + $scope.coffeesByUser[x].downVoters.length;
      }
    });

    $scope.refreshProfile = function () {

      $http.get('http://www.coffeemate.club/api/coffees').success(function (dataProfile) {
        $scope.coffeesProfile = dataProfile;
        $scope.idFilter = $scope.storage._id;


      });

    };

    $scope.productImage = function (coffee) {

      var coffeeURL = coffee.urlimage.charAt(0);
      // console.log(coffeeURL);

      if (coffeeURL === '.') {

        while (coffee.urlimage.charAt(0) === '0')
          coffee.urlimage = coffee.urlimage.substr(1);

        // console.log('http://www.coffeemate.club/'+ coffee.urlimage);

        return 'http://www.coffeemate.club/' + coffee.urlimage;


      } else {

        return coffee.urlimage;

      }


    };
  })


  .controller('SavingsCtrl', function ($http, $scope, $window, $timeout, $cookieStore) {

    $scope.user = $cookieStore.get('userInfo');
    // console.log($scope.user);

    $scope.openSaving = function (coffee) {

      $window.open(coffee.link);


    };

    $http.get('http://www.coffeemate.club/api/coffees').success(function (data) {
      $scope.coffees = data;

    });


    $scope.refreshList = function () {


      $http.get('http://www.coffeemate.club/api/coffees').success(function (data) {
        $scope.coffees = data;

      });

    };

    $scope.productImage = function (coffee) {

      var coffeeURL = coffee.urlimage.charAt(0);
      // console.log(coffeeURL);

      if (coffeeURL === '.') {

        while (coffee.urlimage.charAt(0) === '0')
          coffee.urlimage = coffee.urlimage.substr(1);

        // console.log('http://www.coffeemate.club/'+ coffee.urlimage);

        return 'http://www.coffeemate.club/' + coffee.urlimage;


      } else {

        return coffee.urlimage;

      }


    };

    $scope.userImage = function (coffee) {

      var cut = '';
      var userImageURL = '';


      if(coffee.user.profileImageURL !== undefined){

        userImageURL = coffee.user.profileImageURL.charAt(0);


        if (userImageURL === '.') {

          cut  = coffee.user.profileImageURL.substring(3);

          console.log('http://www.coffeemate.club/' + cut);
          return 'http://www.coffeemate.club/' + cut;


        }else if(userImageURL === 'm'){


          return 'http://www.coffeemate.club/' + coffee.user.profileImageURL;

        }else{


          return coffee.user.profileImageURL;

        }
      }




    };






  })

  .controller('SavingCtrl', function ($stateParams, $scope, $http, $cookieStore, $timeout) {

    // $scope.coffeeUrl = function (coffee) {
    //
    //   $scope.coffeeLink = 'http://coffeemate.club/coffees/' + $scope.coffee._id;
    //   // console.log($scope.coffeeLink);
    //   return $scope.coffeeLink;
    //
    // };

    // $scope.votedCold = true;
    // $scope.votedHot = true;

    $scope.userImage = function (coffee) {

      var cut = '';
      var userImageURL = '';

      console.log("userImageURL " + userImageURL);

      if(coffee.user.profileImageURL !== undefined){

        userImageURL = coffee.user.profileImageURL.charAt(0);

        console.log("userImageURL " + userImageURL);

        if (userImageURL === '.') {

         cut  = coffee.user.profileImageURL.substring(3);

          console.log('http://www.coffeemate.club/' + cut);
          return 'http://www.coffeemate.club/' + cut;

        }else if(userImageURL === 'm'){

          console.log("userImageURL " + userImageURL);

          return 'http://www.coffeemate.club/' + coffee.user.profileImageURL;

        }else{

          console.log("userImageURL " + userImageURL);

          return coffee.user.profileImageURL;

        }
      }




    };

    $scope.user = $cookieStore.get('userInfo');

    $scope.productImage = function (coffee) {

      var coffeeURL = coffee.urlimage.charAt(0);
      // console.log(coffeeURL);

      if (coffeeURL === '.') {

        while (coffee.urlimage.charAt(0) === '0')
          coffee.urlimage = coffee.urlimage.substr(1);

        // console.log('http://www.coffeemate.club/'+ coffee.urlimage);

        return 'http://www.coffeemate.club/' + coffee.urlimage;


      } else {

        return coffee.urlimage;

      }


    };

    $scope.id = $stateParams.coffeeId;

    $http.get('http://www.coffeemate.club/api/coffees/' + $scope.id).success(function (data) {
      $scope.coffee = data;
      $scope.priceFormatted = '€' + $scope.coffee.price;
      $scope.retailerFormatted = '@ (' + $scope.coffee.retailer + ')';
      $scope.coffeeLink = 'http://coffeemate.club/coffees/' + $scope.coffee._id;

      var hasVoted = $scope.coffee.downVoters.filter(function (voter) {

          return voter === $scope.storage.email;

        }).length > 0;


      if (hasVoted) {

        $scope.votedCold = true;
        $scope.votedHot = false;

      }

      var hasVoted2 = $scope.coffee.upVoters.filter(function (voter) {

          return voter === $scope.storage.email;

        }).length > 0;


      if (hasVoted2) {

        $scope.votedCold = false;
        $scope.votedHot = true;

      }

    });

    $http.get('http://www.coffeemate.club/posts').success(function (data) {
      $scope.posts = data;

    });


    $scope.productImageSaving = function (coffee) {

      console.log(coffee);

      var coffeeURL = $scope.coffee.urlimage.charAt(0);
      // console.log(coffeeURL);

      if (coffeeURL === '.') {

        while ($scope.coffee.urlimage.charAt(0) === '0')
          $scope.coffee.urlimage = $scope.coffee.urlimage.substr(1);

        // console.log('http://www.coffeemate.club/'+ coffee.urlimage);

        return 'http://www.coffeemate.club/' + $scope.coffee.urlimage;


      } else {

        return $scope.coffee.urlimage;

      }


    };

    $scope.voteDown = function (coffee) {


      $scope.data = {};

      $timeout(function () {

        $http.put("http://www.coffeemate.club/api/coffees/app/downvote/" + $scope.coffee._id + "/" + $scope.storage.email, $scope.data).success(function (data1, status) {

          $scope.hello = data1;

          $scope.votedCold = true;
          $scope.votedHot = false;

        })

      }, 1);


    };

    $scope.voteUp = function (coffee) {

      $scope.data = {};

      $timeout(function () {

        $http.put("http://www.coffeemate.club/api/coffees/app/upvote/" + $scope.coffee._id + "/" + $scope.storage.email, $scope.data).success(function (data1, status) {

          $scope.hello = data1;

          $scope.votedCold = false;
          $scope.votedHot = true;

        })

      }, 1);


    };


  })

  .controller('CouponsCtrl', function ($scope) {
    $scope.coupons = [
      {title: 'Reggae1', id: 1},
      {title: 'Chill2', id: 2},
      {title: 'Dubstep3', id: 3},
      {title: 'Indie4', id: 4},
      {title: 'Rap5', id: 5},
      {title: 'Cowbell6', id: 6}
    ];
  })

  .controller('CouponCtrl', function ($scope, $stateParams) {
  })

  .controller('LoginCtrl', function ($scope, $state, $cookieStore, $http) {

  })

  .controller('SignupCtrl', function ($scope, $state, $cookieStore, $http) {

  })

  .controller('ProfileCtrl', function ($scope, $state, $http) {


  });





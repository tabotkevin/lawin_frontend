angular.module('starter.controllers', [])

.controller('DemoCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, Users, $ionicLoading, $state, $timeout, PhotoService) {
  $scope.users = Users.all();

  $scope.toggleMenu = function() {
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.hideKeyboard = function() {
    if (typeof cordova !== 'undefined') {
      $timeout(function() {
        cordova.plugins.Keyboard.close();
      }, 500);
    }
  }

  $scope.refresh = function() {
    // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.goToHome = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    $timeout(function() {
      $ionicLoading.hide();
      $state.go('tab.moi');
      $scope.closeLogin();
      $scope.closeRegister();
    }, 2000);
  }

  $scope.actionSheet = function() {
    var hideSheet = $ionicActionSheet.show({
      // titleText: 'Modify your album',
      buttons: [
        { text: 'Block or report' },
        { text: 'Copy Link' }
      ],
      destructiveText: 'Delete',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        return true;
      }
    });
  }

  // Add connection modal
  $ionicModal.fromTemplateUrl('templates/modal/new_connection.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalAdd = modal;
  });
  $scope.openAdd = function() {
    $scope.modalAdd.show();
  };
  $scope.closeAdd = function() {
    $scope.modalAdd.hide();
  };

  // Add connection modal
  $scope.dividerFunction = function(key){
    return key;
  }

  var items = Users.all();
  items.sort(function(a,b){
    var textA = a.name.toUpperCase();
    var textB = b.name.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  })
  $scope.connections = items;

  $ionicModal.fromTemplateUrl('templates/modal/connections.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalConnections = modal;
  });
  $scope.openConnections = function() {
    $scope.modalConnections.show();
  };
  $scope.closeConnections = function() {
    $scope.modalConnections.hide();
  };

  // New Post modal
  $scope.newPost = {
    imgSrc: null
  }

  $scope.removePhoto = function() {
    $scope.newPost.imgSrc = null;
  }

  $scope.addPhoto = function() {
    PhotoService.add()
      .then(function(imageData) {
        $scope.newPost.imgSrc = imageData;
      })
  }

  $ionicModal.fromTemplateUrl('templates/modal/new_post.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalPost = modal;
  });
  $scope.openPost = function() {
    $scope.modalPost.show();
  };
  $scope.closePost = function() {
    $scope.modalPost.hide();
  };

  // Login modal
  $ionicModal.fromTemplateUrl('templates/welcome/login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalLogin = modal;
  });
  $scope.openLogin = function() {
    $scope.modalLogin.show();
  };
  $scope.closeLogin = function() {
    $scope.modalLogin.hide();
  };

  // Sign up modal
  $ionicModal.fromTemplateUrl('templates/welcome/register.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalRegister = modal;
  });
  $scope.openRegister = function() {
    $scope.modalRegister.show();
  };
  $scope.closeRegister = function() {
    $scope.modalRegister.hide();
  };

  /* Chat */
  $scope.messages = [];
})
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $localStorage, $base64) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {

  $scope.url = 'http://138.197.42.32';
  
  $scope.reload = function () {
        $http({
      method: 'GET',
          url: $scope.url + '/api/total',
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token}
    }).then(function successCallback(response) {
       $scope.total = response.data.total;
      }, function errorCallback(response) {
      });
    };

    $scope.reload();
  
  $scope.user = $localStorage.user;

})

.controller('FeedsCtrl', function($scope, $http, $localStorage, $ionicModal, $ionicLoading, $interval) {

    $scope.url = 'http://138.197.42.32';
    
    $ionicModal.fromTemplateUrl('templates/modal/composs.html', {
    scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalPost = modal;
    });
    $scope.openPost = function() {
      $scope.modalPost.show();
    };
    $scope.closePost = function() {
      $scope.modalPost.hide();
    };

     $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    $scope.reload = function () {
      $http({
      method: 'GET',
      url: $scope.url + '/api/feeds',
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token}
    }).then(function successCallback(response) {
        console.log(response);
        $scope.feeds = response.data.feeds;
        $scope.pages = response.data.pages;
        $ionicLoading.hide();
      }, function errorCallback(response) {
        console.log('It did not work');
        $ionicLoading.hide();
      });
    };

    $scope.reload();
    $interval($scope.reload, 120000);

    $scope.doLike = function (id) {
        $http({
      method: 'GET',
      url: $scope.url + '/api/like/' + id,
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token}
    }).then(function successCallback(response) {
        console.log(response);
         $scope.reload();
      }, function errorCallback(response) {
        console.log('It did not work');
        $ionicLoading.hide();
      });
    };


})


.controller('LawyersCtrl', function($scope, $http, $localStorage, $ionicModal, $ionicLoading, $interval) {

   $scope.url = 'http://138.197.42.32';

     $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    $scope.reload = function () {
        $http({
      method: 'GET',
      url: $scope.url + '/api/lawyers',
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token}
    }).then(function successCallback(response) {
        console.log(response);
        $scope.lawyers = response.data.lawyers;
        $scope.pages = response.data.pages;
        $ionicLoading.hide();
      }, function errorCallback(response) {
        console.log('It did not work');
        $ionicLoading.hide();
      });
    };

    $scope.reload();
    $interval($scope.reload, 120000);


})


.controller('SearchCtrl', function($scope, $http, $localStorage, $ionicModal, $ionicLoading, $stateParams) {

    $scope.searchData = {};
    $scope.url = 'http://138.197.42.32';
    $scope.searchData.query = $stateParams.query
  
     $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    $http({
      method: 'POST',
      url: $scope.url + '/api/search',
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token},
      data: $scope.searchData
    }).then(function successCallback(response) {
        console.log(response);
       $scope.lawyers = response.data.result;
        $ionicLoading.hide();
        $scope.searchData.query = '';
      }, function errorCallback(response) {
        $ionicLoading.hide();
        alert('Hmm... there was an error');
      });
 

})

.controller('FeedCtrl', function($scope, $stateParams, $http, $localStorage, $ionicModal, $ionicLoading) {
   
   $scope.url = 'http://138.197.42.32';
   $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

  

    $scope.reload = function () {
      $http({
      method: 'GET',
      url: $scope.url + '/api/feed/' + $stateParams.id,
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token}
    }).then(function successCallback(response) {
        console.log(response);
       $scope.feed = response.data.feed;
       $scope.comments  = response.data.comments;
       $ionicLoading.hide();
        //$scope.pages = responds.data.pages;
      }, function errorCallback(response) {
        $ionicLoading.hide();
        console.log('It did not work');
      });
    };

    $scope.reload();

  $scope.commentData = {};

  // Perform the login action when the user submits the login form
  $scope.doComment = function() {
     $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    $http({
      method: 'POST',
      url: $scope.url + '/api/comment/' + $stateParams.id,
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token},
      data: $scope.commentData
    }).then(function successCallback(response) {
        console.log(response);
        $scope.comments.push(response.data.comment);
        $ionicLoading.hide();
        $scope.commentData.body = '';
      }, function errorCallback(response) {
        $ionicLoading.hide();
        alert('Hmm... there was an error');
      });
  };

  $scope.doLike = function () {
        $http({
      method: 'GET',
      url: $scope.url + '/api/like/'+$stateParams.id,
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token}
    }).then(function successCallback(response) {
        console.log(response);
        $scope.reload();
      }, function errorCallback(response) {
        console.log('It did not work');
        $ionicLoading.hide();
      });
    };


})

.controller('UserCtrl', function($scope, $stateParams, $http, $localStorage) {

  $scope.url = 'http://138.197.42.32';

  $http({
      method: 'GET',
      url: $scope.url + '/api/user/' + $stateParams.id,
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token}
    }).then(function successCallback(response) {
        console.log(response);
       $scope.user = response.data;
        //$scope.pages = responds.data.pages;
      }, function errorCallback(response) {
        console.log('It did not work');
      });
})


.controller('ProfileCtrl', function($scope, $localStorage, $ionicModal, $ionicLoading, $base64, $state, $http, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet, $timeout, $window) {
  
  $scope.url = 'http://138.197.42.32';

  $scope.image = null;

  $scope.reload = function () {
        $scope.user = $localStorage.user;
   };

  $scope.reload();

  $scope.$watch('user', function() {
    $scope.user = $localStorage.user;
  });


  $scope.userData = {};

   $scope.userData.name = $scope.user.name;
   $scope.userData.email = $scope.user.email;
   $scope.userData.location = $scope.user.location;
   $scope.userData.about = $scope.user.about;
   $scope.userData.company = $scope.user.company;
   $scope.userData.position = $scope.user.position;
   $scope.userData.password = $scope.user.password;


  $scope.doEdit = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    $http({
      method: 'POST',
      url: $scope.url + '/api/edit-user/' + $scope.user.id,
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token},
      data: $scope.userData
    }).then(function successCallback(response) {
        $localStorage.token = 'Basic ' + $base64.encode(unescape(encodeURIComponent(response.data.token + ': ')));
        $scope.user = response.data.user;
        $localStorage.user = response.data.user;
        $ionicLoading.hide();
        $window.location.reload();
        $state.go('tab.moi');
        $scope.closeEdit();
      }, function errorCallback(response) {
        $ionicLoading.hide();
        alert('Hmm... there was an error');
      });
  };
 
  $scope.showAlert = function(title, msg) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: msg
      });
    };


    $scope.loadImage = function() {
    var options = {
      title: 'Select Image Source',
      buttonLabels: ['Load from Gallery', 'Use Camera'],
      addCancelButtonWithLabel: 'Cancel',
      androidEnableCancelButton : true,
    };
    $cordovaActionSheet.show(options).then(function(btnIndex) {
      var type = null;
      if (btnIndex === 1) {
        type = Camera.PictureSourceType.PHOTOLIBRARY;
      } else if (btnIndex === 2) {
        type = Camera.PictureSourceType.CAMERA;
      }
      if (type !== null) {
        $scope.selectPicture(type);
      }
    });
  };
  

  $scope.selectPicture = function(sourceType) {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 640,
        targetHeight: 1280,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation:true
      };
     
      $cordovaCamera.getPicture(options).then(function(imagePath) {
        // Grab the file name of the photo in the temporary directory
        var currentName = imagePath.replace(/^.*[\\\/]/, '');
     
        //Create a new name for the photo
        var d = new Date(),
        n = d.getTime(),
        newFileName =  n + ".jpg";
     
        // If you are trying to load image from the gallery on Android we need special treatment!
        if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
          window.FilePath.resolveNativePath(imagePath, function(entry) {
            window.resolveLocalFileSystemURL(entry, success, fail);
            function fail(e) {
              console.error('Error: ', e);
            }
     
            function success(fileEntry) {
              var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
              // Only copy because of access rights
              $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
                $scope.image = newFileName;
              }, function(error){
                $scope.showAlert('Error', error.exception);
              });
            };
          }
        );
        } else {
          var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          // Move the file to permanent storage
          $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
            $scope.image = newFileName;
          }, function(error){
            $scope.showAlert('Error', error.exception);
          });
        }
      },
      function(err){
        // Not always an error, maybe cancel was pressed...
      })
  };

  $scope.pathForImage = function(image) {
    if (image === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + image;
    }
  };


  $scope.uploadImage = function() {

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

      // Destination URL
      var url = "http://138.197.42.32/api/upload_user_photo";
     
      // File for Upload
      var targetPath = $scope.pathForImage($scope.image);
     
      // File name only
      var filename = $scope.image;
     
      var options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename},
        headers : {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token}
      };
     
      $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
        $ionicLoading.hide();
        var data = JSON.parse(result.response);
        // $scope.showAlert('Success', 'Profile Image Updated.');
        $scope.image = null;
        $scope.user = data.user;
        $localStorage.user = data.user;
        $scope.user.image = data.user.image;
        $window.location.reload();
        $state.go('tab.moi');
      });
     // $ionicLoading.hide();
  };


})


.controller('MessagesMenuCtrl', function($scope, $http, $localStorage, $ionicLoading, $interval, $cordovaLocalNotification) {
   
  $scope.url = 'http://138.197.42.32';

  $http({
      method: 'GET',
      url: 'http://138.197.42.32/api/profile',
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token}
    }).then(function successCallback(response) {
        console.log(response);
        $scope.user = response.data;
      }, function errorCallback(response) {
        console.log('It did not work');
      });

    $scope.data = {
      };

      $scope.reload = function () {
        $http({
      method: 'GET',
      url: 'http://138.197.42.32/api/inbox',
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token}
    }).then(function successCallback(response) {
       $scope.messages = response.data.messages;
       $scope.data.badgeCount = 0;
       $scope.ids = new Array();
       for(i=0; i < $scope.messages.length; i++ ){
          if(!$scope.messages[i].read) {
          
          if($scope.ids.indexOf($scope.messages[i].id)==-1){
                  cordova.plugins.notification.local.schedule({
                      id: $scope.messages[i].id,
                      title: "LawIn",
                      text: $scope.messages[i].body.slice(1, 20),
                      icon: 'res://icon',
                      smallIcon: 'res://icon' ,
                      sound: 'file://sound.mp3',
                  });

                  $scope.ids.push($scope.messages[i].id);
            }

            $scope.data.badgeCount += 1 ;
          }
       }
       $ionicLoading.hide();
      }, function errorCallback(response) {
        console.log('It did not work');
        $ionicLoading.hide();
      });
    };

    document.addEventListener('deviceready', function () {
       cordova.plugins.backgroundMode.enable();

       cordova.plugins.backgroundMode.onactivate = function() {
            $scope.reload();
            $interval($scope.reload, 120000);
        }

    }, false);

    $scope.reload();
    $interval($scope.reload, 120000);

})


.controller('InboxCtrl', function($scope, $http, $localStorage, $ionicLoading, $interval) {

  $scope.url = 'http://138.197.42.32';

   $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    $scope.reload = function () {
        $http({
      method: 'GET',
          url: $scope.url + '/api/inbox',
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token}
    }).then(function successCallback(response) {
       $scope.messages = response.data.messages;
       $ionicLoading.hide();
      }, function errorCallback(response) {
        console.log('It did not work');
        $ionicLoading.hide();
      });
    };

    $scope.reload();
    $interval($scope.reload, 120000);

})

.controller('SignupCtrl', function($scope, $http, $localStorage, $base64, $state,  $ionicSideMenuDelegate, $ionicModal,  $ionicLoading, $timeout, $ionicPopup) {

  $scope.url = 'http://138.197.42.32';

  $scope.signupData = {};
  $scope.loginData = {};

  $scope.showAlert = function(title, msg) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: msg
      });
    };

  $scope.hideKeyboard = function() {
    if (typeof cordova !== 'undefined') {
      $timeout(function() {
        cordova.plugins.Keyboard.close();
      }, 500);
    }
  }

  // Sign up modal
  $ionicModal.fromTemplateUrl('templates/welcome/register.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalRegister = modal;
  });
  $scope.openRegister = function() {
    $scope.modalRegister.show();
  };
  $scope.closeRegister = function() {
    $scope.modalRegister.hide();
  };

  // Perform the login action when the user submits the login form
  $scope.doSignup = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    $http({
      method: 'POST',
      url: $scope.url + '/api/user',
      data: $scope.signupData
    }).then(function successCallback(response) {
        console.log(response);
        $localStorage.token = 'Basic ' + $base64.encode(unescape(encodeURIComponent(response.data.token + ': ')));
        $localStorage.user = response.data.user;
        $ionicLoading.hide();
        $state.go('tab.home');
        $scope.closeRegister();
      }, function errorCallback(response) {
        $ionicLoading.hide();
        alert('Hmm... there was an error');
      });
  };


  // Login modal
  $ionicModal.fromTemplateUrl('templates/welcome/login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalLogin = modal;
  });
  $scope.openLogin = function() {
    $scope.modalLogin.show();
  };
  $scope.closeLogin = function() {
    $scope.modalLogin.hide();
  };


  $scope.doLogin = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    $http({
      method: 'POST',
      url: $scope.url + '/api/login',
      data: $scope.loginData
    }).then(function successCallback(response) {
          if(response.data.failed){
            $ionicLoading.hide();
            $scope.showAlert('Failed', 'Incorrect email or password');
          } else {
          $localStorage.token = 'Basic ' + $base64.encode(unescape(encodeURIComponent(response.data.token + ': ')));
          $localStorage.user = response.data.user;
          $ionicLoading.hide();
          $state.go('tab.home');
          $scope.closeLogin();
          }
      }, function errorCallback(response) {
        $ionicLoading.hide();
        alert('Hmm... there was an error');
      });
  };

})


.controller('OutboxCtrl', function($scope, $http, $localStorage, $ionicLoading, $interval) {
   
  $scope.url = 'http://138.197.42.32';
  
   $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });


    $scope.reload = function () {
        $http({
      method: 'GET',
      url: $scope.url +  '/api/outbox',
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token}
    }).then(function successCallback(response) {
      console.log(response);
       $scope.messages = response.data.messages;
       $ionicLoading.hide();
      }, function errorCallback(response) {
        console.log('It did not work');
        $ionicLoading.hide();
      });
    };

    $scope.reload();
    $interval($scope.reload, 120000);

})


.controller('LogOutCtrl', function($scope,  $localStorage, $state, $ionicLoading) {

  $scope.logOut = function() {
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
      });
      $localStorage.token = null;
      $state.go('welcome');
      $ionicLoading.hide();  
  };

})


.controller('MessageCtrl', function($scope, $stateParams, $http, $localStorage, $ionicModal, $ionicLoading) {

  $scope.url = 'http://138.197.42.32';

  $scope.user = $localStorage.user;

   $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

  $http({
      method: 'GET',
     url: $scope.url + '/api/message/'+$stateParams.id,
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token}
    }).then(function successCallback(response) {
        console.log(response);
       $scope.message = response.data.message;
       $scope.replies  = response.data.replies;
       $ionicLoading.hide();
        //$scope.pages = responds.data.pages;
      }, function errorCallback(response) {
        $ionicLoading.hide();
        console.log('It did not work');
      });

  $scope.replyData = {};

  // Perform the login action when the user submits the login form
  $scope.doReply = function() {
     $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    $http({
      method: 'POST',
      url: $scope.url + '/api/reply/'+$stateParams.id,
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token},
      data: $scope.replyData
    }).then(function successCallback(response) {
        console.log(response);
        $scope.replies.push(response.data.reply);
        $ionicLoading.hide();
        $scope.replyData.body = '';
      }, function errorCallback(response) {
        $ionicLoading.hide();
        alert('Hmm... there was an error');
      });
  };


})


.controller('CompossCtrl', function($scope, $http, $localStorage, $stateParams, $state, $ionicLoading) {

  $scope.url = 'http://138.197.42.32';

  $scope.messageData = {};
  $scope.messageData.receiver_id = $stateParams.userId
  $scope.user = $localStorage.user;

  $scope.doSend = function() {

   $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    $http({
      method: 'POST',
      url: $scope.url + '/api/message',
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token},
      data: $scope.messageData
    }).then(function successCallback(response) {
        $ionicLoading.hide();
        $scope.messageData.title = '';
        $scope.messageData.body = '';
        $state.go('tab.home');
      }, function errorCallback(response) {
        $ionicLoading.hide();
        console.log('Error');
      });
    };

})

.controller('NetCompossCtrl', function($scope, $http, $localStorage, $stateParams, $state, $ionicLoading) {

  $scope.url = 'http://138.197.42.32';

  $scope.messageData = {};
  $scope.messageData.receiver_id = $stateParams.userId
  $scope.user = $localStorage.user;

  $scope.doSend = function() {

   $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    $http({
      method: 'POST',
      url: $scope.url + '/api/message',
      headers: {'Access-Control-Allow-Origin':'*','Authorization': $localStorage.token},
      data: $scope.messageData
    }).then(function successCallback(response) {
        $ionicLoading.hide();
        $scope.messageData.title = '';
        $scope.messageData.body = '';
        $state.go('tab.lawyers');
      }, function errorCallback(response) {
        $ionicLoading.hide();
        console.log('Error');
      });
    };

});

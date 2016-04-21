angular.module('myProductsApp')
	.controller('myProductAppCtrl',['$http','$location',function ($http,$location) {
		var vm = this;

		vm.show_element_status = false;
		vm.products = {};
		vm.new_product = {};

		//get all products from db
		$http.get("/api/products").success(function(respond){
            console.log("res:", respond);
            vm.products = respond;
        });

		//save product in db
		vm.save = function(){
			$http.post("/api/product/save", vm.new_product)
            .success(function(res){

              console.log(res);
              vm.show_element_status = true;
              vm.status_data = res.status_data

              if(vm.status_data.status){
              	console.log(vm.status_data.status);
              	$location.path("/");
              }
            });
		}

		vm.showProduct = function(_id){
			$location.path("product/"+_id);
		}

	}])
	.controller('myProductAppViewCtrl', ['$http','$location','$routeParams', function($http, $location,$routeParams){
		var vm = this;

		vm.show_element_status = false;
		vm.new_comment = {};
		vm.new_comment.product_id = $routeParams.id; //get product id
		vm.comments = {};

		//get single product from db
		$http.get("/api/product/" + $routeParams.id).success(function(respond){
            console.log("res:", respond);
            vm.product = respond;

        });

		//save comment in db
        vm.saveComment = function(){
        	$http.post("/api/comment/save", vm.new_comment)
            .success(function(res){

              console.log(res);
              vm.show_element_status = true;
              vm.status_data = res.status_data

              if(vm.status_data.status){
              	vm.product = res.product;
              	vm.new_comment.text = "";
              }
            });
        }
	}])

  .controller('mainCtrl', ['$scope', function($scope) {

  //initialize souncd cloud
  SC.initialize({ client_id: 'ac1f1ed168eb81bdc55189b230fd36c9' });

  var player          = document.querySelector('iframe');
  var defaultTrackUrl = 'https://w.soundcloud.com/player/?url=https://soundcloud.com/red-bull-records/sail';
  player.src = defaultTrackUrl;

  $scope.widget = SC.Widget(player);
  $scope.widget.bind(SC.Widget.Events.FINISH, function() {
    var myTracksScope = angular.element('#my-tracks').scope();
    if (myTracksScope.repeatMode == 'song') {
      myTracksScope.play();
    }
    else if (myTracksScope.repeatMode == 'playlist') {
      myTracksScope.next();
    }
  });

  //Search Playlist
  $scope.searchPlaylists = function() {
    $scope.playlists = [];
    $scope.tracks    = [];
    $('#loader').show();
    SC.get('/playlists', { q: $scope.keyword }, function(playlists) {
      for (var i in playlists) {
        $scope.playlists.push(playlists[i]);
      }
      $('#loader').hide();
      $scope.$apply();
    });
  }

}])

//Not Loading Properly
.controller('playlistCtrl', ['$scope', function($scope) {


  var mainScope = angular.element('#main').scope();

  $scope.getTracks = function() {
    mainScope.playlists = [];
    mainScope.tracks    = [];
    //loader not working properly
    $('#loader').show();
    SC.get('/playlists/' + $scope.playlist.id, {}, function(playlist) {
      var tracks = playlist.tracks;
      for (var i in tracks) {
        $scope.tracks.push(tracks[i]);
      }
      //not hiding
      $('#loader').hide();
      $scope.$apply();
    });
  }

}])

.controller('trackCtrl', ['$scope', function($scope) { 

  var myTracksScope = angular.element('#my-tracks').scope();

  $scope.addToMyTrack = function() {
    myTracksScope.myTracks.push(angular.copy($scope.track));
    myTracksScope.myTrackNum++;
  }

}])


.controller('myTracksCtrl', ['$scope', function($scope) { 

  $scope.index      = 0;
  $scope.myTrackNum = 0;
  $scope.repeatMode = 'song';
  $scope.myTracks   = [];

  $scope.play = function() {
    var myTrackId    = '#my-track-' + $scope.index;
    var myTrackScope = angular.element(myTrackId).scope();
    myTrackScope.set();
    $(myTrackId).addClass('active');
  }

  $scope.prev = function() {
    var beforeIndex = $scope.index;
    if ($scope.index == 0) {
      $scope.index = $scope.myTrackNum - 1;
    } else {
      $scope.index--;
    }
    $scope.play();
    $('#my-track-' + beforeIndex).removeClass('active');
  }

  $scope.next = function() {
    var beforeIndex = $scope.index;
    if ($scope.index == $scope.myTrackNum - 1) {
      $scope.index = 0;
    } else {
      $scope.index++;
    }
    $scope.play();
    $('#my-track-' + beforeIndex).removeClass('active');
  }

  $scope.repeatSong = function() {
    $scope.repeatMode = 'song';
    $('#btn-repeat-song').addClass('active');
    $('#btn-repeat-playlist').removeClass('active');
  }

  $scope.repeatPlaylist = function() {
    $scope.repeatMode = 'playlist';
    $('#btn-repeat-song').removeClass('active');
    $('#btn-repeat-playlist').addClass('active');
  }

  $scope.remove = function(index) {
    $scope.myTracks.splice(index, 1);
    if (index <= $scope.index) {
      if ($scope.index > 0) {
        $scope.index--;
      }
    }
    $scope.myTrackNum--;
  }

}])

.controller('myTrackCtrl', ['$scope', function($scope) { 

  var mainScope = angular.element('#main').scope();

  $scope.set = function() {
    mainScope.widget.load($scope.myTrack.uri, {
      auto_play: true,
    });
  }

}])







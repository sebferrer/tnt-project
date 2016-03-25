var app = angular.module('tntApp', []);
app.controller('journeyCtrl', function($scope, $http)
{
  $scope.URL = "http://" + window.location.hostname + ":3000/tnt";

  $scope.addressesList = Array(); 

  $scope.departure1 = {lat: 0, lng: 0};
  $scope.arrival1 = {lat: 0, lng: 0};
  $scope.departure2 = {lat: 0, lng: 0};
  $scope.arrival2 = {lat: 0, lng: 0};

  angular.element(document).ready(function () {

    $scope.map = new google.maps.Map(document.getElementById('map'), {});

    var url = $scope.URL + '/address/list';

    var promise_cities = new Promise(function(resolve, reject) {
      $http.get(url)
      .success(function (data, status, headers, config) {
        resolve("Cities loaded!");
        $scope.addressesList = data;
      })
      .error(function (data, status, headers, config) {
        reject(Error("Unable to load cities"));
      });
    });

    promise_cities.then(function(result) {
      $(".chosen-select-1").each(function() {
        var id = $(this).attr('id');
        $('#'+id+' option').eq(0).remove();
        $('#'+id).chosen();
      });
    }, function(err) {
        console.log(err);
      });
    });

    $scope.toggleBackJourney = function(id) {
      if($('#'+id).is(":checked")) {
          $('#backJourney').fadeOut(200);
      }
      else {
         $('#backJourney').fadeIn(200, function () {
            $(".chosen-select-2").each(function() {
              var id = $(this).attr('id');
              $('#'+id).chosen();
            });
        });
      }
    }

    $scope.setLocation = function(id) {
      console.log($scope.address);
    }

    $scope.edit_outward = function() {
      /*var departure = {lat: 48.725559, lng: 2.260095};
      var arrival = {lat: 48.709267, lng: 2.171263};*/
      $scope.initMap($scope.departure, $scope.arrival);
    }

    $scope.edit_return = function() {
      var departure = {lat: 48.725559, lng: 2.260095};
      var arrival = {lat: 48.709267, lng: 2.171263};
      $scope.initMap(departure, arrival);
    }

    $scope.initMap = function(departure, arrival) {
      $scope.map.center = {lat: departure.lat, lng: departure.lng};
      $scope.map.zoom = 4;

      var wpts = Array();

      var directionsService = new google.maps.DirectionsService;
      $scope.directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: $scope.map,
      });

      $scope.request = {
        origin: departure,
        destination: arrival,
        waypoints: wpts,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true
      };

      $scope.directionsDisplay.addListener('directions_changed', function() {
          $scope.computeTotalDistance($scope.directionsDisplay.getDirections());
      });

      $scope.displayRoute($scope.request, directionsService, $scope.directionsDisplay);

      var location = {lat: $scope.map.center.lat, lng: $scope.map.center.lng};
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
        google.maps.event.trigger($scope.map, 'resize');
        $scope.map.setCenter(location);
      });
    }

    $scope.validate_journey = function() {
      $scope.sendDirections();
    }

    $scope.sendDirections = function() {
      var myroute = $scope.directionsDisplay.getDirections().routes[0];
      var waypoints = Array();
      
      for (var i = 0; i < myroute.legs.length; i++) {
        console.log(myroute.legs[i].via_waypoints.length);
        for(var j = 0; j < myroute.legs[i].via_waypoints.length; j++) {
            waypoints.push({lat:myroute.legs[i].via_waypoints[j].lat(),
                            lng:myroute.legs[i].via_waypoints[j].lng()});
        }
        if(i < myroute.legs.length-1) {
          waypoints.push({lat:$scope.request.waypoints[i].location.lat(),
                          lng:$scope.request.waypoints[i].location.lng()});
        }
      }
      console.log(waypoints);
    }

    $scope.displayRoute = function(request, service, display) {
      service.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(response);
          display.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      });
    }

    $scope.computeTotalDistance = function(result) {
      var total = 0;
      var temps = 0;
      var myroute = result.routes[0];
      var i, j, somme = 0;

      for (i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
        temps += myroute.legs[i].duration.value;
        for(j = 0;j < myroute.legs[i].via_waypoints.length; j++) {
            somme++;
            console.log(myroute.legs[i].via_waypoints[j].lat());
            console.log(myroute.legs[i].via_waypoints[j].lng());
        }
      }
    }

});
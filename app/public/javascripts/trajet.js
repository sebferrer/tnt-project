function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: -24.345, lng: 134.46}  // Australia.
  });
  
  var depart = {lat: 48.725559, lng: 2.260095}; //48.725559, 2.260095
  var arrivee = {lat: 48.709267, lng: 2.171263}; //48.709267, 2.171263
  var wpts = Array();
  
  // Set wpts (via input)
  wpts.push({location:new google.maps.LatLng(48.7311728,2.255312199999935)});
  wpts.push({location:new google.maps.LatLng(48.737497,2.229105)});
  wpts.push({location:new google.maps.LatLng(48.7575442,2.1729616999999735)});
  wpts.push({location:new google.maps.LatLng(48.7191667,2.151718599999981)});
  
  console.log(wpts);
    
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map,
    //markerOptions : { visible : false },
    //panel: document.getElementById('right-panel')
  });
  
  var request = {
    origin: depart,
    destination: arrivee,
    waypoints: wpts,//[{location:new google.maps.LatLng(48.737497,2.229105)}],   //{lat:48.737497, lng:2.229105}
    travelMode: google.maps.TravelMode.DRIVING,
    avoidTolls: true
  };

  directionsDisplay.addListener('directions_changed', function() {
    computeTotalDistance(directionsDisplay.getDirections());
  });

  displayRoute(request, directionsService, directionsDisplay);
  //sendDirections(depart, arrivee, directionsDisplay.getDirections());
  
  document.getElementById("envoi").addEventListener("click", function(){
    sendDirections(depart, arrivee, directionsDisplay.getDirections(), request);
  });
}

// Creation du tableau des points intermediaires pour output
function sendDirections(depart, arrivee, trajets, request) {
  var myroute = trajets.routes[0];
  var waypoints = Array();
  
  for (var i = 0; i < myroute.legs.length; i++) {
    console.log(myroute.legs[i].via_waypoints.length);
    for(var j = 0;j < myroute.legs[i].via_waypoints.length; j++) {
      // waypoints.push({lat:48.709267, lng:2.171263});
      //if(myroute.legs[i].via_waypoints[j])
        waypoints.push({lat:myroute.legs[i].via_waypoints[j].lat(),
                        lng:myroute.legs[i].via_waypoints[j].lng()});
    }
    //console.log(request.waypoints[i].location);
    if(i < myroute.legs.length-1) {
      waypoints.push({lat:request.waypoints[i].location.lat(),
                      lng:request.waypoints[i].location.lng()});
    }
  }
  console.log(waypoints);
}

function displayRoute(request, service, display) {
  service.route(request, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      console.log(response);
      display.setDirections(response);
    } else {
      alert('Could not display directions due to: ' + status);
    }
  });
}

function computeTotalDistance(result) {
  var total = 0;
  var temps = 0;
  var myroute = result.routes[0];
  var i,j,somme=0;

  for (i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
    temps += myroute.legs[i].duration.value;
    for(j = 0;j < myroute.legs[i].via_waypoints.length; j++) {
        somme++;
        console.log(myroute.legs[i].via_waypoints[j].lat());
        console.log(myroute.legs[i].via_waypoints[j].lng());
    }
  }
  
  total = total / 1000;
  document.getElementById('total').innerHTML = total + ' km';
  document.getElementById('temps').innerHTML = ~~(temps/3600) + 'h' + ~~(temps/60)%60 + 'm' + temps%60 + 's';
  document.getElementById('legs').innerHTML = somme + ' wpts';
     
}
let map;
let service;
let infowindow;

// Initialize map with user location or default
function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        loadMap(userLocation);
      },
      () => {
        // User denied location or error → use default
        loadMap({ lat: 6.9271, lng: 79.8612 }); // Colombo
      }
    );
  } else {
    // Browser does not support geolocation
    loadMap({ lat: 6.9271, lng: 79.8612 }); // Colombo
  }
}

// Load map and search nearby cafes
function loadMap(location) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 15,
  });
  searchNearby(location);
}

// Search nearby cafes using Places API
function searchNearby(location) {
  const request = {
    location: location,
    radius: '1000', // 1 km
    type: ['cafe']
  };
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

// Callback for search results
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    const listDiv = document.getElementById('cafeList');
    listDiv.innerHTML = '';
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i]);
      listDiv.innerHTML += `<p>${results[i].name} - ${results[i].vicinity} (Rating: ${results[i].rating || 'N/A'})</p>`;
    }
  } else {
    const listDiv = document.getElementById('cafeList');
    listDiv.innerHTML = '<p>No cafes found nearby.</p>';
  }
}

// Create map markers
function createMarker(place) {
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow = new google.maps.InfoWindow({
      content: `<h3>${place.name}</h3><p>${place.vicinity}</p>`
    });
    infowindow.open(map, this);
  });
}

// Search location input by user
function searchLocation() {
  const locationName = document.getElementById("locationInput").value;
  
  if (!locationName) {
    alert('Please enter a location.');
    return;
  }

  const geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ address: locationName }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const loc = results[0].geometry.location;
      map.setCenter(loc);        // Center map on searched location
      map.setZoom(15);           // Optional: zoom in
      searchNearby(loc);         // Show cafes near that location
    } else {
      alert('Location not found! Please enter a valid city, e.g., "Colombo, Sri Lanka".');
    }
  });
}

// Optional: Autocomplete for city names (prevents errors)
const input = document.getElementById("locationInput");
const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["(cities)"]
});

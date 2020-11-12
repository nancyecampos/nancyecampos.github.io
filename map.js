var API_KEY = "pk.eyJ1IjoibmFuY3llY2FtcG9zIiwiYSI6ImNrNnhyYzRnYjA5YXkzbG1tOG5wOG85dHQifQ.hJIEqB5FAZZvJY44XK_dDg";
// Store our API endpoint inside queryUrl 
// API from mapbox
var queryUrl = "https://raw.githubusercontent.com/nancyecampos/Kinship-Mapout/main/Kinship%20Locations%20111220.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  createMap(data.features);
});
function assignColor(kstatus){
  if (kstatus === "Open"){
    return 'green'
  }else if(kstatus === "Permanency Achieved"){
    return 'red'
  }else{
    return 'blue'
  }
}
function createMap(kinloc) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [streetmap]
  });
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, null, {
    collapsed: false
  }).addTo(myMap);
  // use a "canvas" to render the layer
  // instead of a 'heavy' DOM element for the pushpins
  // the circles are rendered on their own layer at top GPU speeds
  var myRenderer = L.canvas({ padding: 0.5 }); // create the canvas 'renderer'
  console.log('starting to create corals')
  for (kinlocs of kinloc) {
    let latlon = swap(kinlocs.geometry.coordinates); // for some reason we had to swap the coords
    L.circleMarker(latlon, { // create the circle
      renderer: myRenderer, // tell it which renderer to use to draw the circle
      color: assignColor(kinlocs.properties.Status), 
      radius: 1.0
    }).addTo(myMap).bindPopup(`coral: ${kinlocs.properties.Status}, source: ${kinlocs.properties.Location}, number of records: ${kinlocs.properties.Status}`); // add the layer to your map
  }
  console.log('done creating cases')
}
function swap(a){
  return [a[1], a[0]]
}

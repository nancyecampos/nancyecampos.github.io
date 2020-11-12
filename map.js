var API_KEY = "pk.eyJ1IjoibmFuY3llY2FtcG9zIiwiYSI6ImNrNnhyYzRnYjA5YXkzbG1tOG5wOG85dHQifQ.hJIEqB5FAZZvJY44XK_dDg";
var queryUrl = "https://raw.githubusercontent.com/nancyecampos/Kinship-Mapout/main/Kinship%20Locations%20111220.geojson";
d3.json(queryUrl, function (data) {
  createMap(data.features);
});
function assignColor(kstatus){
  if (kstatus === "Open"){
    return 'green'
  }else if(kstatus === "Permanency Achieved"){
    return 'purple'
  }else{
    return 'yellow'
  }
}
function createMap(kinloc) {
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  var baseMaps = {
    "Street Map": streetmap
  };
  var myMap = L.map("map", {
    center: [
      37.43, -78.65
    ],
    zoom: 5,
    layers: [streetmap]
  });
  L.control.layers(baseMaps, null, {
    collapsed: false
  }).addTo(myMap);
  var myRenderer = L.canvas({ padding: 0.5 });
  for (kinlocs of kinloc) {
    let latlon = swap(kinlocs.geometry.coordinates); 
    L.circleMarker(latlon, { 
      renderer: myRenderer, 
      color: assignColor(kinlocs.properties.Status), 
      radius: 5.0
    }).addTo(myMap).bindPopup(`Status: ${kinlocs.properties.Status}, Location: ${kinlocs.properties.Location}, Number of Cases: ${kinlocs.properties.Count}`);
  }
}
function swap(a){
  return [a[1], a[0]]
}

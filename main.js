$(function() {

  var parkPathsCircles = [],
      busyRoadsCircles = [],
      pedestrianAreasCircles = [],

      parkPathsPredictedCircles = [],
      busyRoadsPredictedCircles = [],
      pedestrianAreasPredictedCircles = [];

  var parkPathsLayer, busyRoadsLayer, pedestrianAreasLayer,
      parkPathsPredictedLayer, busyRoadsPredictedLayer, pedestrianAreasPredictedLayer;

  var map = L.map('map');

  var menuControl =  L.Control.extend({

    options: {
      position: 'topright'
    },

    onAdd: function (map) {
      var container = L.DomUtil.create('button', 'ui icon button leaflet-bar leaflet-control sidebar-trigger');
      container.innerHTML = '<i class="sidebar icon"></i>';
      container.style.backgroundColor = 'white';

      return container;
    }
  });

  //add a tile layer to add to our map, in this case it's the 'standard' OpenStreetMap.org tile server
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  map.addControl(new menuControl());

  map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text. Attribution overload

  var edinburgh = new L.LatLng(55.9413041, -3.1918722); // geographical point (longitude and latitude)

  // set view of Edinburgh
  map.setView(edinburgh, 14);

  // parse json
  $.getJSON('json/predicted_kmeans_outputs.json', function(data) {
    data.features.forEach(function(feature) {

      // add trained outputs
      if (feature.properties.urban_environment == 1) {
        parkPathsCircles.push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          color: 'pink',
          fillColor: 'pink',
          fillOpacity: 0.2,
          radius: feature.properties.pm10*0.05
        }).bindPopup("Timestamp: " + feature.properties.time + "\n" +
                      "Latitude: " + feature.geometry.coordinates[1] + '\n' +
                      "Longitude: " + feature.geometry.coordinates[0]));
      } else if (feature.properties.urban_environment == 0) {
        busyRoadsCircles.push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          color: 'yellow',
          fillColor: 'yellow',
          fillOpacity: 0.2,
          radius: feature.properties.pm10*0.05
        }).bindPopup("Timestamp: " + feature.properties.time + "\n" +
                      "Latitude: " + feature.geometry.coordinates[1] + '\n' +
                      "Longitude: " + feature.geometry.coordinates[0]));
      } else if (feature.properties.urban_environment == 2) {
        pedestrianAreasCircles.push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          color: 'brown',
          fillColor: 'brown',
          fillOpacity: 0.2,
          radius: feature.properties.pm10*0.05
        }).bindPopup("Timestamp: " + feature.properties.time + "\n" +
                      "Latitude: " + feature.geometry.coordinates[1] + '\n' +
                      "Longitude: " + feature.geometry.coordinates[0]));
      }

      // add predicted outputs from kmeans
      if (feature.properties.predicted_environment == 1) {
        parkPathsPredictedCircles.push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          color: 'pink',
          fillColor: 'pink',
          fillOpacity: 0.2,
          radius: feature.properties.pm10*0.05
        }).bindPopup("Timestamp: " + feature.properties.time + "\n" +
                      "Latitude: " + feature.geometry.coordinates[1] + '\n' +
                      "Longitude: " + feature.geometry.coordinates[0]));
      } else if (feature.properties.predicted_environment == 0) {
        busyRoadsPredictedCircles.push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          color: 'yellow',
          fillColor: 'yellow',
          fillOpacity: 0.2,
          radius: feature.properties.pm10*0.05
        }).bindPopup("Timestamp: " + feature.properties.time + "\n" +
                      "Latitude: " + feature.geometry.coordinates[1] + '\n' +
                      "Longitude: " + feature.geometry.coordinates[0]));
      } else if (feature.properties.predicted_environment == 2) {
        pedestrianAreasPredictedCircles.push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          color: 'brown',
          fillColor: 'brown',
          fillOpacity: 0.2,
          radius: feature.properties.pm10*0.05
        }).bindPopup("Timestamp: " + feature.properties.time + "\n" +
                      "Latitude: " + feature.geometry.coordinates[1] + '\n' +
                      "Longitude: " + feature.geometry.coordinates[0]));
      }
    });

    // initialize map layers once data is parsed
    parkPathsLayer = L.layerGroup(parkPathsCircles);
    busyRoadsLayer = L.layerGroup(busyRoadsCircles);
    pedestrianAreasLayer = L.layerGroup(pedestrianAreasCircles);
    // predicted layers
    parkPathsPredictedLayer = L.layerGroup(parkPathsPredictedCircles);
    busyRoadsPredictedLayer = L.layerGroup(busyRoadsPredictedCircles);
    pedestrianAreasPredictedLayer = L.layerGroup(pedestrianAreasPredictedCircles);
  });


  // toggle event listeners and triggers

  // checkboxes toggles
  $('input[name="parkPathsToggleTrain"]').change(function() {
    if (this.checked) {
      map.addLayer(parkPathsLayer);
    } else {
      map.removeLayer(parkPathsLayer);
    }
  });

  $('input[name="busyRoadsToggleTrain"]').change(function() {
    if (this.checked) {
      map.addLayer(busyRoadsLayer);
    } else {
      map.removeLayer(busyRoadsLayer);
    }
  });

  $('input[name="pedestrianAreasToggleTrain"]').change(function() {
    if (this.checked) {
      map.addLayer(pedestrianAreasLayer);
    } else {
      map.removeLayer(pedestrianAreasLayer);
    }
  });

  $('input[name="parkPathsPrediTogglePredict"]').change(function() {
    if (this.checked) {
      map.addLayer(parkPathsPredictedLayer);
    } else {
      map.removeLayer(parkPathsPredictedLayer);
    }
  });

  $('input[name="busyRoadsTogglePredict"]').change(function() {
    if (this.checked) {
      map.addLayer(busyRoadsPredictedLayer);
    } else {
      map.removeLayer(busyRoadsPredictedLayer);
    }
  });

  $('input[name="pedestrianAreasTogglePredict"]').change(function() {
    if (this.checked) {
      map.addLayer(pedestrianAreasPredictedLayer);
    } else {
      map.removeLayer(pedestrianAreasPredictedLayer);
    }
  });



  $('.sidebar-trigger').click(function(){
    $('.ui.sidebar').sidebar({
      transition: 'overlay',
      dimPage: false,
      closable: false
    }).sidebar('toggle');
  });

  $('.mapView').click(function(){
    $('.graphs-section').hide();
    $('.lmap').show();
    $('.ui.sidebar .checkbox input').attr('disabled', false);
  });

  $('.graphView').click(function() {
    $('.graphs-section').show();
    $('.lmap').hide();
    $('.ui.sidebar .checkbox input').attr('disabled', true);
  });

});

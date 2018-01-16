$(function() {

  var circles = {
    "0": [],
    "1": [],
    "2": [],
    "3": [],
    "4": [],
  };

  var colors = ["pink", "yellow", "red", "green", "brown"];

  var layers = {
    "0": {},
    "1": {},
    "2": {},
    "3": {},
    "4": {},
  };

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

  $.getJSON('json/labelled_afternoon.json', function(data) {
    data.features.forEach(function(feature) {
      circles[feature.properties.environment_index].push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        color: colors[feature.properties.environment_index],
        fillColor: colors[feature.properties.environment_index],
        fillOpacity: 0.2,
        radius: feature.properties.bin0*0.1
      }));
    });
    for (key in layers) {
      layers[key] = L.layerGroup(circles[key]);
    }
  });

  $('input[name="labelledAfternoonFeatures"]').change(function() {
    if (this.checked) {
      map.addLayer(layers['0']);
      map.addLayer(layers['1']);
      map.addLayer(layers['2']);
      map.addLayer(layers['3']);
      map.addLayer(layers['4']);
    } else {
      map.removeLayer(layers['0']);
      map.removeLayer(layers['1']);
      map.removeLayer(layers['2']);
      map.removeLayer(layers['3']);
      map.removeLayer(layers['4']);
    }
  });

  // $('input[name="parkPathsToggleTrain"]').change(function() {
  //   if (this.checked) {
  //     map.addLayer(parkPathsLayer);
  //   } else {
  //     map.removeLayer(parkPathsLayer);
  //   }
  // });

  // $('input[name="busyRoadsToggleTrain"]').change(function() {
  //   if (this.checked) {
  //     map.addLayer(busyRoadsLayer);
  //   } else {
  //     map.removeLayer(busyRoadsLayer);
  //   }
  // });

  // $('input[name="pedestrianAreasToggleTrain"]').change(function() {
  //   if (this.checked) {
  //     map.addLayer(pedestrianAreasLayer);
  //   } else {
  //     map.removeLayer(pedestrianAreasLayer);
  //   }
  // });

  // $('input[name="parkPathsPrediTogglePredict"]').change(function() {
  //   if (this.checked) {
  //     map.addLayer(parkPathsPredictedLayer);
  //   } else {
  //     map.removeLayer(parkPathsPredictedLayer);
  //   }
  // });

  // $('input[name="busyRoadsTogglePredict"]').change(function() {
  //   if (this.checked) {
  //     map.addLayer(busyRoadsPredictedLayer);
  //   } else {
  //     map.removeLayer(busyRoadsPredictedLayer);
  //   }
  // });

  // $('input[name="pedestrianAreasTogglePredict"]').change(function() {
  //   if (this.checked) {
  //     map.addLayer(pedestrianAreasPredictedLayer);
  //   } else {
  //     map.removeLayer(pedestrianAreasPredictedLayer);
  //   }
  // });



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

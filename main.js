$(function() {

  var requestData = function(dataFile, circles, layers, radiusProperty, colors, scale) {
    $.getJSON(dataFile, function(data) {
      data.features.forEach(function(feature) {
        if (!circles[feature.properties.environment_index]) {
          circles[feature.properties.environment_index] = [];
        }
        circles[feature.properties.environment_index].push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          color: colors[feature.properties.environment_index],
          fillColor: colors[feature.properties.environment_index],
          fillOpacity: 0.2,
          radius: feature.properties[radiusProperty]*scale
        }));
      });
      for (key in circles) {
        layers[key] = L.layerGroup(circles[key]);
      }
    });
  }

  var colors = ["green", "yellow", "orange", "red", "brown"];

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

  var circles = {
    "labelledMiddayFeaturesBins": {},
    "labelledAfternoonFeaturesBins": {},
    "labelledMiddayFeaturesPm25": {},
    "labelledMiddayFeaturesPm": {},
    "labelledAfternoonFeaturesPm25": {},
    "labelledAfternoonFeaturesPm": {}
  };

  var layers = {
    "labelledMiddayFeaturesBins": {},
    "labelledAfternoonFeaturesBins": {},
    "labelledMiddayFeaturesPm25": {},
    "labelledMiddayFeaturesPm": {},
    "labelledAfternoonFeaturesPm25": {},
    "labelledAfternoonFeaturesPm": {}
  };

  var binScale = 0.1, pmScale = 2;

  // requests to json files of data
  requestData('json/labelled_midday.json', circles.labelledMiddayFeaturesBins, layers.labelledMiddayFeaturesBins, 'bin0', colors, binScale);
  requestData('json/labelled_afternoon.json', circles.labelledAfternoonFeaturesBins, layers.labelledAfternoonFeaturesBins, 'bin0', colors, binScale);
  requestData('json/labelled_midday_pm.json', circles.labelledMiddayFeaturesPm25, layers.labelledMiddayFeaturesPm25, 'pm2_5', colors, pmScale);
  requestData('json/labelled_afternoon_pm.json', circles.labelledAfternoonFeaturesPm25, layers.labelledAfternoonFeaturesPm25, 'pm2_5', colors, pmScale);
  requestData('json/labelled_midday_pm_all.json', circles.labelledMiddayFeaturesPm, layers.labelledMiddayFeaturesPm, 'pm2_5', colors, pmScale);
  requestData('json/labelled_afternoon_pm_all.json', circles.labelledAfternoonFeaturesPm, layers.labelledAfternoonFeaturesPm, 'pm2_5', colors, pmScale);


  $('input').change(function() {
    var featureKey = $(this).attr('name');
    if (this.checked) {
      for (key in layers[featureKey]) {
        map.addLayer(layers[featureKey][key]);
      }
    } else {
      for (key in layers[featureKey]) {
        map.removeLayer(layers[featureKey][key]);
      }
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

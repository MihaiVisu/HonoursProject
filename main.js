$(function() {

  var pm1Circles = [],
      pm25Circles = [],
      pm10Circles = [];

  var pm1Layer, pm25Layer, pm10Layer;

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
  $.getJSON('cc.json', function(data) {
    data.features.forEach(function(feature) {
      // add a layer of pm1 circles
      pm1Circles.push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.2,
        radius: feature.properties.pm1*20
      }).bindPopup("Timestamp: " + feature.properties.time));
      // add a layer of pm2.5 circles
      pm25Circles.push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.2,
        radius: feature.properties.pm2_5*1
      }).bindPopup("Timestamp: " + feature.properties.time));
      // add a layer of pm10 circles
      pm10Circles.push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.2,
        radius: feature.properties.pm10*0.2
      }).bindPopup("Timestamp: " + feature.properties.time + '\n' +
                    "Latitude: " + feature.geometry.coordinates[1] + '\n' +
                    "Longitude: " + feature.geometry.coordinates[0]));
    });
    // initialize map layers once data is parsed
    pm1Layer = L.layerGroup(pm1Circles);
    pm25Layer = L.layerGroup(pm25Circles);
    pm10Layer = L.layerGroup(pm10Circles);
  });


  // toggle event listeners and triggers

  $('input[name="pm1Toggle"]').change(function() {
    if (this.checked) {
      map.addLayer(pm1Layer);
    } else {
      map.removeLayer(pm1Layer);
    }
  });

  $('input[name="pm25Toggle"]').change(function() {
    if (this.checked) {
      map.addLayer(pm25Layer);
    } else {
      map.removeLayer(pm25Layer);
    }
  });

  $('input[name="pm10Toggle"]').change(function() {
    if (this.checked) {
      map.addLayer(pm10Layer);
    } else {
      map.removeLayer(pm10Layer);
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

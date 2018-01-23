$(function() {

  var env_colors = ["green", "yellow", "orange", "red", "brown"];
  var londonColors = ["red", "purple", "yellow", "cyan", "brown", "orange", "grey", "pink"];
  var unsupervisedLondonColors = ["red", "yellow", "brown", "orange", "grey", "pink"];

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
    "labelledAfternoonFeaturesPm": {},
    "londonData": {},
    "unsupervisedLondonData": {}
  };

  var layers = {
    "labelledMiddayFeaturesBins": {},
    "labelledAfternoonFeaturesBins": {},
    "labelledMiddayFeaturesPm25": {},
    "labelledMiddayFeaturesPm": {},
    "labelledAfternoonFeaturesPm25": {},
    "labelledAfternoonFeaturesPm": {},
    "londonData": {},
    "unsupervisedLondonData": {}
  };

  var binScale = 0.1, pmScale = 2;

  // requests to json files of data
  requestData('json/labelled_midday.json', circles.labelledMiddayFeaturesBins, layers.labelledMiddayFeaturesBins, 'bin0', env_colors, binScale, "environment_index");
  requestData('json/labelled_afternoon.json', circles.labelledAfternoonFeaturesBins, layers.labelledAfternoonFeaturesBins, 'bin0', env_colors, binScale, "environment_index");
  requestData('json/labelled_midday_pm.json', circles.labelledMiddayFeaturesPm25, layers.labelledMiddayFeaturesPm25, 'pm2_5', env_colors, pmScale, "environment_index");
  requestData('json/labelled_afternoon_pm.json', circles.labelledAfternoonFeaturesPm25, layers.labelledAfternoonFeaturesPm25, 'pm2_5', env_colors, pmScale, "environment_index");
  requestData('json/labelled_midday_pm_all.json', circles.labelledMiddayFeaturesPm, layers.labelledMiddayFeaturesPm, 'pm2_5', env_colors, pmScale, "environment_index");
  requestData('json/labelled_afternoon_pm_all.json', circles.labelledAfternoonFeaturesPm, layers.labelledAfternoonFeaturesPm, 'pm2_5', env_colors, pmScale, "environment_index");
  requestData('json/filtered_london_data.json', circles.londonData, layers.londonData, 'PM2.5', londonColors, pmScale, "environment_index");
  requestData('json/filtered_london_data_unsupervised.json', circles.unsupervisedLondonData, layers.unsupervisedLondonData, 'PM2.5', unsupervisedLondonColors, pmScale, "unsupervised_environment_index")


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

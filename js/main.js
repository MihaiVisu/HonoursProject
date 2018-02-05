$(function() {

  var env_colors = ["green", "yellow", "orange", "red", "brown"];
  var londonColors = ["red", "purple", "yellow", "cyan", "brown", "orange", "grey", "pink"];
  var unsupervisedLondonColors = ["red", "yellow", "brown", "orange", "grey", "pink"];

  var url = "http://localhost:8080";

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

  var binVals = [];
  for (var i = 0; i < 16; i++) {
    binVals.push('bin'+i);
  }

  var binScale = 0.1, pmScale = 2;

  var pmVals = ['pm1', 'pm2_5', 'pm10'];

  // requests to json files of data
  // requestData(url+'/api_mihai/labelled_data/1/', circles.labelledMiddayFeaturesBins, layers.labelledMiddayFeaturesBins, 'bin0', env_colors, binScale, "label", binVals);
  // requestData(url+'/api_mihai/labelled_data/2/', circles.labelledAfternoonFeaturesBins, layers.labelledAfternoonFeaturesBins, 'bin0', env_colors, binScale, "label", binVals);
  // requestData(url+'/api_mihai/labelled_data/1/', circles.labelledMiddayFeaturesPm25, layers.labelledMiddayFeaturesPm25, 'pm2_5', env_colors, pmScale, "label", ['pm2_5']);
  // requestData(url+'/api_mihai/labelled_data/2/', circles.labelledAfternoonFeaturesPm25, layers.labelledAfternoonFeaturesPm25, 'pm2_5', env_colors, pmScale, "label", ['pm2_5']);
  // requestData(url+'/api_mihai/labelled_data/1/', circles.labelledMiddayFeaturesPm, layers.labelledMiddayFeaturesPm, 'pm2_5', env_colors, pmScale, "label", pmVals);
  // requestData(url+'/api_mihai/labelled_data/2/', circles.labelledAfternoonFeaturesPm, layers.labelledAfternoonFeaturesPm, 'pm2_5', env_colors, pmScale, "label", pmVals);
  // requestData(url+'/api_mihai/labelled_london_data/supervised/', circles.londonData, layers.londonData, 'pm2_5', londonColors, pmScale, "label");
  // requestData(url+'/api_mihai/labelled_london_data/unsupervised/', circles.unsupervisedLondonData, layers.unsupervisedLondonData, 'pm2_5', unsupervisedLondonColors, pmScale, "label", pmVals);


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

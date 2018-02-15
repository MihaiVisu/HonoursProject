$(function() {

  var env_colors = ["green", "yellow", "orange", "red", "brown"];
  var londonColors = ["red", "purple", "yellow", "cyan", "brown", "orange", "grey", "pink"];
  var unsupervisedLondonColors = ["red", "yellow", "brown", "orange", "grey", "pink"];

  // -----JQUERY VARIABLES-----
  var $attrsDropdown = $('.attributes .ui.dropdown');

  var url = "http://localhost:8080";

  var binVals = [];
  for (var i = 0; i < 16; i++) {
    binVals.push('bin'+i);
  }

  var currentAttrs;

  var map = L.map('map');

  // -----SEMANTIC UI INIT-----

  // enable the dropdown
  $('.ui.dropdown').dropdown();

  $('.include-all-bins input').change(function() {

    if (this.checked) {
      currentAttrs = $attrsDropdown.dropdown('get value');
      $attrsDropdown.dropdown('set selected', binVals);
    }
    else {
      $attrsDropdown.dropdown('clear');
      $attrsDropdown.dropdown('set selected', currentAttrs);
    }
  });

  // get attributes
  $.getJSON(url+'/api_mihai/attributes/', function(data) {
    data.forEach(function(val) {
      $('.attributes .ui.dropdown .menu').append(
        '<div class="item" data-value="'+val+'">'+val+'</div>'
      );
    });
  });

  var staticSensors = [
    [55.94246859, -3.19137017],
    [55.94006915, -3.19115559],
    [55.94520598, -3.19119151],
    [55.94039595, -3.19428355],
    [55.94011133, -3.18323372]
  ];

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

  // add static sensors on map
  for (var i = 0; i < staticSensors.length; i++) {
    var marker = L.marker(staticSensors[i]).addTo(map);
    marker.bindPopup('Static Sensor s'+(i+1));
  }

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
      transition: 'scale down',
      dimPage: true,
      closable: true
    }).sidebar('toggle');
  });

  // hide the map initially
  $('.lmap').hide();

  // ----INTERFACE EVENTS-----

  // check if menu items are active 
  $('.menu a.item').on('click', function() {
    $('.menu a.item').removeClass('active');
    $(this).addClass('active');
  }); 

  $('.map-view').click(function(){
    $('.menu-section').hide();
    $('.lmap').show();
    $('.menu a.item').removeClass('active');
    $('.map-view').addClass('active');
  });

  $('.menu-view').click(function() {
    $('.menu-section').show();
    $('.lmap').hide();
  });

  // -----REQUESTS-----
  $('#classify-data-button').click(function() {
    requestData(url + '/api_mihai/labelled_london_data');
  });

});

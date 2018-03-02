$(function() {

  var env_colors = ["green", "yellow", "orange", "red", "brown"];
  var londonColors = ["red", "purple", "yellow", "cyan", "brown", "orange", "grey", "pink"];
  var unsupervisedLondonColors = ["red", "yellow", "brown", "orange", "grey", "pink"];

  // -----JQUERY VARIABLES-----
  var $classifyAttrsDropdown = $('.classification-form .attributes .ui.dropdown');
  var $clusterAttrsDropdown = $('.kmeans-form .attributes .ui.dropdown');
  var $environmentClustersInput = $('.kmeans-form input[name="environment-clusters-number"]');
  var $locationClustersInput = $('.kmeans-form input[name="location-clusters-number"]');

  var $classifierDropdown = $('.classifier .ui.dropdown');
  var $validationCriterionDropdown = $('.validation-criterion .ui.dropdown');
  var $foldsNumberInput = $('.folds-number input');
  var $includeUrbanEnvironments = $('.include-urban-environments input:checked');
  var $normaliseBinCounts = $('.normalise-bins input:checked');

  var url = "http://localhost:8080";

  // local variables
  var dataset = 2;

  var binVals = [];
  for (var i = 0; i < 16; i++) {
    binVals.push('bin'+i);
  }

  var currentAttrs;

  var map = L.map('map');

  // -----SEMANTIC UI INIT-----

  // enable the dropdown
  $('.ui.dropdown').dropdown();

  $('.kmeans-form .include-all-bins input').change(function() {

    if (this.checked) {
      currentAttrs = $clusterAttrsDropdown.dropdown('get value');
      $clusterAttrsDropdown.dropdown('set selected', binVals);
    }
    else {
      $clusterAttrsDropdown.dropdown('clear');
      $clusterAttrsDropdown.dropdown('set selected', currentAttrs);
    }
  });

  $('.classification-form .include-all-bins input').change(function() {

    if (this.checked) {
      currentAttrs = $classifyAttrsDropdown.dropdown('get value');
      $classifyAttrsDropdown.dropdown('set selected', binVals);
    }
    else {
      $classifyAttrsDropdown.dropdown('clear');
      $classifyAttrsDropdown.dropdown('set selected', currentAttrs);
    }
  });

  // on dataset radios change change dataset variable
  $('.dataset .checkbox').checkbox({
    onChecked: function() {
      dataset = $(this).data('val');
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
  // for (var i = 0; i < staticSensors.length; i++) {
  //   var marker = L.marker(staticSensors[i]).addTo(map);
  //   marker.bindPopup('Static Sensor s'+(i+1));
  // }

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

  var binScale = 0.1, pmScale = 2;

  var pmVals = ['pm1', 'pm2_5', 'pm10'];

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

  $('#cluster-data-button').click(function() {

    // clear all layers before
    map.eachLayer(function(layer) {
      if(!layer._url) {
        map.removeLayer(layer);
      }
    });

    var locationClustersNumber = $locationClustersInput.val();
    var environmentClustersNumber = $environmentClustersInput.val();
    var attrs = $clusterAttrsDropdown.dropdown('get value');
    var colors = env_colors;

    if (dataset == 2) {
      colors = unsupervisedLondonColors;
    }

    requestData(url+'/api_mihai/labelled_clustered_data/' + 
      (dataset+1) + '/' +
      locationClustersNumber + '/' +
      environmentClustersNumber, 
      circles.unsupervisedLondonData, 'pm2_5', colors, pmScale, "label", attrs, map);
  });

  $('#classify-data-button').click(function() {

    // clear all layers before
    map.eachLayer(function(layer) {
      if(!layer._url) {
        map.removeLayer(layer);
      }
    });

    var colors = londonColors;
    var classifier = $classifierDropdown.dropdown('get value');
    var attrs = $classifyAttrsDropdown.dropdown('get value');
    var validationCriterion = $validationCriterionDropdown.dropdown('get value');
    var foldsNumber = $foldsNumberInput.val();
    var includeUrbanEnvironments = $includeUrbanEnvironments.length;
    var normaliseBinCounts = $normaliseBinCounts.length;

    requestData(url+'/api_mihai/labelled_classified_data/' +
      (dataset+1) + '/' +
      classifier + '/' +
      validationCriterion + '/' +
      normaliseBinCounts + '/' +
      includeUrbanEnvironments + '/' +
      foldsNumber, circles.londonData, 'pm2_5', colors, pmScale, "label", attrs, map);
  });

});

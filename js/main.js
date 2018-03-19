$(function() {

  var envColors = ["green", "yellow", "orange", "red", "brown"];
  var transportColors = ['pink','red','yellow','purple','orange','gray'];

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

  var $pusher = $('.pusher')

  var url = "http://localhost:8080";

  // local variables
  var dataset = 2;

  var binVals = [];
  for (var i = 0; i < 16; i++) {
    binVals.push('bin'+i);
  }

  var currentAttrs;

  var map = L.map('map');

  // -----LEGENDS FOR MAP-------

  var urbanEnvironmentsLegend = L.control({position: 'bottomright'});
  var transportLegend = L.control({position: 'bottomright'});

  urbanEnvironmentsLegend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend'),
        labels = ['park path', 'pedestrian road', 'quiet area', 'medium traffic area', 'high traffic area'];

    for (var i = 0; i < labels.length; i++) {
        div.innerHTML +=
            '<i style="background:' + envColors[i] + '"></i> ' + labels[i] + '<br>';
    }
    map.removeControl(transportLegend);
    return div;
  };

  transportLegend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend'),
        labels = ['on foot', 'car', 'train', 'bicycle', 'bus', 'subway'];

    for (var i = 0; i < labels.length; i++) {
        div.innerHTML +=
            '<i style="background:' + transportColors[i] + '"></i> ' + labels[i] + '<br>';
    }
    map.removeControl(urbanEnvironmentsLegend);
    return div;
  };

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

  var binScale = 0.05;

  var pmVals = ['pm1', 'pm2_5', 'pm10'];

  $('.sidebar-trigger').click(function(){
    $pusher.css('height','');
    $('.ui.sidebar').sidebar({
      transition: 'scale down',
      dimPage: true,
      closable: true
    }).sidebar('toggle');
  });

  // hide the map initially
  $('.lmap').hide();
  $('.upload-section').hide();

  // ----INTERFACE EVENTS-----

  // check if menu items are active 
  $('.menu a.item').on('click', function() {
    $('.menu a.item').removeClass('active');
    $(this).addClass('active');
  }); 

  $('.map-view').click(function(){
    $('.menu-section').hide();
    $('.upload-section').hide();
    $('.lmap').show();
    $('.menu a.item').removeClass('active');
    $('.map-view').addClass('active');
    // add height for pusher
    $pusher.css('height', '100%');
  });

  $('.menu-view').click(function() {
    $('.menu-section').show();
    $('.upload-section').hide();
    $('.lmap').hide();
    $('.menu a.item').removeClass('active');
    $('.menu-view').addClass('active');
  });

  $('.upload-view').click(function() {
    $('.menu-section').hide();
    $('.upload-section').show();
    $('.lmap').hide();
    $('.menu a.item').removeClass('active');
    $('.upload-view').addClass('active');
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
    var colors = envColors;


    urbanEnvironmentsLegend.addTo(map);

    requestData(url+'/api_mihai/labelled_clustered_data/' + 
      (dataset+1) + '/' +
      locationClustersNumber + '/' +
      5, // 5 environment clusters 
      circles.unsupervisedLondonData, 'total', colors, binScale, "label", attrs, map);
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

    transportLegend.addTo(map);

    requestData(url+'/api_mihai/labelled_classified_data/' +
      (dataset+1) + '/' +
      classifier + '/' +
      normaliseBinCounts + '/' +
      includeUrbanEnvironments + '/' +
      foldsNumber, circles.londonData, 'pm2_5', colors, pmScale, "label", attrs, map);
  });

});

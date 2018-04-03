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
  var $useForValidationCheckbox = $('.validation input');
  var $includeUrbanEnvironments = $('.include-urban-environments input:checked');
  var $normaliseBinCounts = $('.normalise-bins input:checked');
  var $datasetDropdown = $('.classification-form .dataset .ui.dropdown');

  var $pusher = $('.pusher');

  var $fileUploadInput = $('#file-upload');

  var url = "http://localhost:8080";

  // local variables
  var dataset = 1;

  var binVals = [];
  for (var i = 0; i < 16; i++) {
    binVals.push('bin'+i);
  }

  var currentAttrs;

  var map = L.map('map');

  // -----LEGENDS FOR MAP INITIALISATION-------

  var urbanEnvironmentsLegend = L.control({position: 'bottomright'});
  var transportLegend = L.control({position: 'bottomright'});

  urbanEnvironmentsLegend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend'),
        labels = [
        'Low Vehicular Traffic Density', 
        'Low to Medium Vehicular Traffic Density', 
        'Medium Vehicular Traffic Density', 
        'Medium to High Vehicular Traffic Density',
        'High Vehicular Traffic Density'];

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
  $('.menu-section .ui.dropdown').dropdown();
  $('.upload-section .ui.dropdown').dropdown({
    allowAdditions: true,
    forceSelection: false,
    hideAdditions: false, // this line
    onChange: function(value, text) {
      $('.upload-section input[name="dataset"]').val(text);
    },
  });


  $('.kmeans-form .include-all-bins input[name="all-bins"]').change(function() {

    if (this.checked) {
      currentAttrs = $clusterAttrsDropdown.dropdown('get value');
      $clusterAttrsDropdown.dropdown('set selected', binVals);
    }
    else {
      $clusterAttrsDropdown.dropdown('clear');
      $clusterAttrsDropdown.dropdown('set selected', currentAttrs);
    }
  });

  $('.classification-form .include-all-bins input[name="all-bins"]').change(function() {

    if (this.checked) {
      currentAttrs = $classifyAttrsDropdown.dropdown('get value');
      $classifyAttrsDropdown.dropdown('set selected', binVals);
    }
    else {
      $classifyAttrsDropdown.dropdown('clear');
      $classifyAttrsDropdown.dropdown('set selected', currentAttrs);
    }
  });

  $('.classification-form .mixed-model-attributes .include-all-bins input[name="all-bins-one"]').change(function() {

    if (this.checked) {
      currentAttrs = $('.attributes-one .ui.dropdown').dropdown('get value');
      $('.attributes-one .ui.dropdown').dropdown('set selected', binVals);
    }
    else {
      $('.attributes-one .ui.dropdown').dropdown('clear');
      $('.attributes-one .ui.dropdown').dropdown('set selected', currentAttrs);
    }
  });

  $('.classification-form .mixed-model-attributes .include-all-bins input[name="all-bins-two"]').change(function() {

    if (this.checked) {
      currentAttrs = $('.attributes-two .ui.dropdown').dropdown('get value');
      $('.attributes-two .ui.dropdown').dropdown('set selected', binVals);
    }
    else {
      $('.attributes-two .ui.dropdown').dropdown('clear');
      $('.attributes-two .ui.dropdown').dropdown('set selected', currentAttrs);
    }
  });

  // get attributes
  $.getJSON(url+'/api_mihai/attributes/', function(data) {
    data.forEach(function(val) {
      $('.attributes .ui.dropdown .menu').append(
        '<div class="item" data-value="'+val+'">'+val+'</div>'
      );
      $('.attributes-one .ui.dropdown .menu').append(
        '<div class="item" data-value="'+val+'">'+val+'</div>'
      );
      $('.attributes-two .ui.dropdown .menu').append(
        '<div class="item" data-value="'+val+'">'+val+'</div>'
      );
    });
  });

  // get datasets
  $.getJSON(url+'/api_mihai/datasets/', function(data) {
    data.forEach(function(val) {
      $('.dataset .ui.dropdown .menu').append(
        '<div class="item" data-value="'+val.id+'">'+val.name+'</div>'
      );
      $('.train-dataset .ui.dropdown .menu').append(
        '<div class="item" data-value="'+val.id+'">'+val.name+'</div>'
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
    if (!$('.map-view').hasClass('active')) {
      $pusher.css('height','');
    }
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

  // classifier dropdown event for onchange
  $classifierDropdown.dropdown('setting', 'onChange', function(value, text) {
    if(value === 'mixed_model') {
      $('.attributes-segment').hide();
      $('.mixed-model-attributes').show();
    }
    else {
      $('.attributes-segment').show();
      $('.mixed-model-attributes').hide();
    }
  });

  // use dataset for validation checkbox change event
  $useForValidationCheckbox.change(function() {
    if(this.checked) {
      $('.folds-number').hide();
      $('.train-dataset').show();
    }
    else {
      $('.folds-number').show();
      $('.train-dataset').hide();
    }
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
    var dataset = $datasetDropdown.dropdown('get value');


    urbanEnvironmentsLegend.addTo(map);

    requestData(url+'/api_mihai/labelled_clustered_data/' + 
      (dataset) + '/' +
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

    var colors = transportColors;
    var classifier = $classifierDropdown.dropdown('get value');
    var attrs = $classifyAttrsDropdown.dropdown('get value');
    var validationCriterion = $validationCriterionDropdown.dropdown('get value');
    var foldsNumber = $foldsNumberInput.val() || 0;
    var includeUrbanEnvironments = $includeUrbanEnvironments.length;
    var normaliseBinCounts = $normaliseBinCounts.length;
    var dataset = $datasetDropdown.dropdown('get value');

    transportLegend.addTo(map);

    requestData(url+'/api_mihai/labelled_classified_data/' +
      (dataset) + '/' +
      classifier + '/' +
      normaliseBinCounts + '/' +
      includeUrbanEnvironments + '/' +
      foldsNumber, circles.londonData, 'total', colors, binScale, "label", attrs, map);
  });

//   var file = null;

//   $(':file').on('change', function() {
//     file = this.files[0];
// });

//   $('#upload-file-button').click(function() {
//     var file = $fileUploadInput.val();

//     console.log(file.indexOf('csv') !== -1);
//     uploadFile(url+'/api_mihai/upload_file/', file);
//   });

});

function requestData(dataUrl, circles, radiusProperty, colors, scale, index, attrs, map, extra) {
  // use encodeURIComponent for XSS validation
  $.getJSON(dataUrl, {
    "attrs[]": encodeURIComponent(attrs),
    "train_dataset": encodeURIComponent(extra['train_dataset']),
    "attrs_0": encodeURIComponent(extra['attrs_0']),
    "attrs_1": encodeURIComponent(extra['attrs_1']),
  }, function(data) {
    data.features.forEach(function(feature) {
      if (!circles[feature.properties[index]]) {
        circles[feature.properties[index]] = [];
      }
      circles[feature.properties[index]].push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        color: colors[feature.properties[index]],
        fillColor: colors[feature.properties[index]],
        fillOpacity: 0.2,
        radius: feature.properties[radiusProperty]*scale
      }));
    });
    for (key in circles) {
      map.addLayer(L.layerGroup(circles[key]));
    }

    if (data.score) {
      $('.accuracy').html("<i class='crosshairs icon'></i> Accuracy: " + data.score);
    }
    if (data.total_features) {
      $('.total-features').html("<i class='bar chart icon'></i> Total Features: " + data.total_features);
    }
  });
}

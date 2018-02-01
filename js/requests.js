function requestData(dataUrl, circles, layers, radiusProperty, colors, scale, index) {
  $.post(dataUrl, JSON.stringify({"attrs": ["bin0", "bin1", "bin2"]}), function(data) {
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
      layers[key] = L.layerGroup(circles[key]);
    }
  }, 'json');
}
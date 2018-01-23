function requestData(dataFile, circles, layers, radiusProperty, colors, scale) {
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
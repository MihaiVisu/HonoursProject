function requestData(dataUrl, circles, radiusProperty, colors, scale, index, attrs, map) {
  // use encodeURIComponent for XSS validation
  $.getJSON(dataUrl, {"attrs[]": encodeURIComponent(attrs)}, function(data) {
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
  });
}

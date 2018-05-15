/* globals L */

var codesByName = {};
Object.keys(codes).forEach(function (c) {
  codesByName[codes[c]] = c;
});

var map2016 = L.map('map2016', {
  zoomControl: false,
  maxZoom: 6,
  maxBounds: [[-90, -180], [90, 180]]
}).setView([20, 0], 3);

var reset = L.control({ position: 'bottomright' });
reset.onAdd = function(map) {
  var div = document.createElement('div');
  div.className = 'reset';
  div.onclick = function () {
    map.setView([20, 0], 3);
  };
  return div;
}
reset.addTo(map2016);

L.control.zoom({position: 'bottomright'}).addTo(map2016);

var tiles2016 = L.tileLayer('tiles/2016/{z}/{x}/{y}.png', {
  attribution: '',
  maxZoom: 7,
  minZoom: 2,
  detectRetina: true,
  tms: true
}).addTo(map2016);

var geojson = topojson.feature(countriesData, countriesData.objects.countries);

var style = {
  fillOpacity: 0,
  fillColor: '#fff',
  stroke: true,
  color: '#999',
  weight: .5,
  fill: true
}

var highlightStyle = {fillOpacity: .15};

var highlightedFeatures = [];

var countries2016 = L.geoJSON(geojson, {
  style: function (){ return style; }
}).on('click', function (e) {
  document.getElementById('prompt').style.display = 'none';
  if (highlightedFeatures.indexOf(e.layer) == -1) {
    highlightFeature(e.layer);
  } else {
    removeHighlight();
  }
}).addTo(map2016);

map2016.on('move', move2016)
  .on('click', function (e) {
    var target = e.originalEvent.target;
    if (!target || target.tagName.toLowerCase() != 'path') {
      removeHighlight();
    }
  });

function move2016 (e) {
  document.getElementById('prompt').style.display = 'none';
  clearTimeout(resetTimer);
  resetTimer = setTimeout(resetAll, 60000);
}

function highlightFeature (layer) {
  removeHighlight();
  countries2016.eachLayer(function (l) {
    if (l.feature.properties.NAME == layer.feature.properties.NAME) {
      highlightedFeatures.push(l);
      l.setStyle(highlightStyle);
    }
  });
  map2016.fitBounds(layer.getBounds());
}

function removeHighlight () {
  highlightedFeatures.forEach(function (l) {
    l.setStyle(style);
  });
  highlightedFeatures = [];
}

window.onresize = function () {
  map2016.invalidateSize();
}

var resetTimer;
function resetAll () {
  document.getElementById('prompt').style.display = 'block';
}
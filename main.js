var codesByName = {};
Object.keys(codes).forEach(function (c) {
  codesByName[codes[c]] = c;
});

var map2012 = L.map('map2012', {zoomControl: false}).setView([20, 0], 3);
var map2016 = L.map('map2016', {zoomControl: false}).setView([20, 0], 3);

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


var tiles2012 = L.tileLayer('tiles/2012/{z}/{x}/{y}.png', {
  attribution: '',
  maxZoom: 16,
  tms: true
}).addTo(map2012);

var tiles2016 = L.tileLayer('tiles/2016/{z}/{x}/{y}.png', {
  attribution: '',
  maxZoom: 16,
  tms: true
}).addTo(map2016);

var geojson = topojson.feature(countriesData, countriesData.objects.countries);

var style = {
  fillOpacity: 0.15,
  fillColor: '#fff',
  stroke: false,
  fill: false
}

var highlightedFeature;

var countries2012 = L.geoJSON(geojson, {
  style: function (){ return style; }
}).on('click', function (e) {
  if (highlightedFeature != e.layer) {
    highlightFeature(e.layer);
  } else {
    removeHighlight();
  }
}).addTo(map2012);

var countries2016 = L.geoJSON(geojson, {
  style: function (){ return style; }
}).on('click', function (e) {
  document.getElementById('prompt').style.display = 'none';
  if (highlightedFeature != e.layer) {
    highlightFeature(e.layer);
  } else {
    removeHighlight();
  }
}).addTo(map2016);

map2012.on('move', move2012)
  .on('click', function (e) {
    var target = e.originalEvent.target;
    if (!target || target.tagName.toLowerCase() != 'path') {
      removeHighlight();
    }
  });

map2016.on('move', move2016)
  .on('click', function (e) {
    var target = e.originalEvent.target;
    if (!target || target.tagName.toLowerCase() != 'path') {
      removeHighlight();
    }
  });

function move2012 (e) {
  map2016.off('move', move2016);
  var c = map2012.getCenter();
  var z = map2012.getZoom();
  map2016.setView(c, z, {animate: false});
  map2016.on('move', move2016);
}

function move2016 (e) {
  map2012.off('move', move2016);
  var c = map2016.getCenter();
  var z = map2016.getZoom();
  map2012.setView(c, z, {animate: false});
  map2012.on('move', move2016);
}

function highlightFeature (layer) {
  removeHighlight();
  layer.setStyle({fill: true});
  highlightedFeature = layer;
}

function removeHighlight () {
  if (highlightedFeature) highlightedFeature.setStyle({fill: false});
  highlightedFeature = null;
}

var slider = document.getElementById('slider');
var handle = document.getElementById('handle');

handle.addEventListener('mousedown', handleDown);
handle.addEventListener('touchstart', handleDown);

function handleDown (e) {
  var mapLeft = document.getElementById('map2012');
  var mapRight = document.getElementById('map2016');
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleMove);
  document.addEventListener('mouseup', handleUp);
  document.addEventListener('touchend', handleUp);
  document.getElementById('prompt').style.display = 'none';

  function handleMove (e) {
    var x;
    if (e.touches && e.touches[0]) {
      x = e.touches[0].pageX;
    } else {
      x = e.pageX;
    }
    x = Math.min(window.innerWidth - 60, Math.max(x, 60));
    slider.style.left = x + 'px';
    mapLeft.style.width = x + 'px';
    mapRight.style.left = x + 'px';
    mapRight.style.width = (window.innerWidth - x) + 'px';
    map2012.invalidateSize();
    map2016.invalidateSize();
  }

  function handleUp () {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleUp);
    document.removeEventListener('touchend', handleUp);
  }
}
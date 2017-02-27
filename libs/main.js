var map = L.map('map', {
    minZoom: 6
});

var scale = L.control.scale().addTo(map);

var layerDZKOrto = new L.tileLayer('http://map.land.gov.ua/map/ortho10k_all/{z}/{x}/{y}.jpg', {
    tms: true,
    maxNativeZoom: 16,
    maxZoom: 18,
    attribution: 'Image tiles: &copy <a href="https://land.gov.ua/">StateGeoCadastre of Ukraine</a>'
});

var layerThunderforestOutdoors = L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	maxZoom: 18,
	apikey: '1125d196db264df79003c570338eef2b'
}).addTo(map);

var baseLayers = {
    "Thunderforest Outdoors": layerThunderforestOutdoors,
    "Ortophotoplan": layerDZKOrto
};

L.control.layers(baseLayers, null, {
    collapsed: false,
    position: 'bottomright'
}).addTo(map);

var caveColors = {
    "1": "#3434FC",
    "2": "#64CC34",
    "3": "F49494",
    "4": "#CC3434",
    "5": "#9C34CC",
    "6": "#FFFF00",
    "7": "#FC0434",
    "8": "#244499",
    "9": "#9CFCFC",
    "10": "#FC9C34",
    "11": "#FFFF00",
    "12": "#890406",
    "13": "#3464FC",
    "14": "#04CC34",
    "15": "#FFFF00",
    "16": "#FC04CC",
    "17": "#04FC04",
    "18": "#3434FC",
    "19": "#FC0434"
};

function resetFeatureStyle(e) {
    cavePolygon.eachLayer(function (layer) {
        layer.setStyle({
            color: '#000099',
            fillColor: caveColors[layer.feature.properties.number],
            weight: 1,
            opacity: 1,
            fillOpacity: 0.2
        });
    });
    info.update();
};

function selectFeature(e) {
    resetFeatureStyle();

    var layer = e.target;
    layer.setStyle({
        color: "#00FFFF",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.2
    });
    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    };

    map.fitBounds(layer.getBounds());

    info.update(layer.feature.properties);
};

// overlay layer init
var cavePolygon = L.geoJson(null, {
    style: function (feature) {
        return {
            color: '#000099',
            fillColor: caveColors[feature.properties.number],
            weight: 1,
            opacity: 1,
            fillOpacity: 0.2
        };
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            layer.on({
                click: selectFeature
            });
        }
    }
});
$.getJSON("data/optimistic_poly.geojson", function (data) {
    cavePolygon.addData(data);
    map.fitBounds(cavePolygon.getBounds());
});
cavePolygon.addTo(map);
map.attributionControl.addAttribution('Data: &copy <a href="http://speleo.land.kiev.ua">Caves of Ukraine</a>');

map.on("click", function (e) {
    resetFeatureStyle();
});

// info control
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Map of the cave Optymistychna</h4><div><i>232 km in length</i></div>' + (props ?
        '<div class="c-name">Rayon: ' + props.name + '</div><div>area: ' + (props.area).toFixed(2) + ' m<sup>2</sup></div>perimeter: ' + (props.perimeter / 1000).toFixed(2) + ' km' : '');
};

info.addTo(map);
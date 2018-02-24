var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var mapboxURL = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?"
var mapboxKey = "pk.eyJ1IjoiZ3Jvb3Z5Z2FsIiwiYSI6ImNqZTBtcGJkMjIwMmcyd3FwcGdnejN6YmcifQ.6oEieEsDvwHpvZifLvIawQ"

d3.json(URL, function(data) {
    createFeatures(data.features);
});

function chooseColor(magnitude) {
    if (magnitude < 1) {
        return "green"
    }
    else if (magnitude < 2) {
        return "yellow"
    }
    else if (magnitude < 3) {
        return "gold"
    }
    else if (magnitude < 4) {
        return "orange"
    }
    else if (magnitude < 5) {
        return "orangered"
    }
    else if (magnitude < 6) {
        return "red"
    }
    else {
        return "maroon"
    };

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer){
        layer.bindPopup(feature.properties.place)
    };

    var earthquakes =l.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 2,
             fillColor: chooseColor(feature.properties.mag),
                opacity: 1,
                fillOpacity: 0.5
            });
         },
        onEachFeature: onEachFeature
    });
    createMap(earthquakes);
};

function createMap(earthquakes) {
    var map = L.tileLayer(`${mapboxURL}access_token=${mapboxKey}`);
    var myMap = l.map("map", {
        center: [40,-99], 
        zoom: 5,
        layers: [streetmap, earthquakes]
    });
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5, 6],
            labels = [];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(grades[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
}

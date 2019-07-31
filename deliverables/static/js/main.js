// function to select color depending on magnitude
function choseColor(d) {
    return d < 1 ? '#edf8fb' :
        d < 2 ? '#bfd3e6' :
        d < 3 ? '#9ebcda' :
        d < 4 ? '#8c96c6' :
        d < 5 ? '#8856a7' :
        '#810f7c';
}


function onEachFeatureP(feature, layer) {
    layer.on({
        // mouseover: highlightFeature,
        // mouseout: resetHighlightUNEMP        
    });
    layer.bindTooltip('<h3>Number of regulations in ' + feature.properties.NAME + ': ' + feature.properties.laws + '</h3>');


}


function onEachFeatureCounty(feature, layer) {
    layer.on({
        // mouseover: highlightFeature,
        // mouseout: resetHighlightUNEMP        
    });
    layer.bindTooltip('<h3>' + feature.properties.NAME + ' ' + feature.properties.LSAD + '<br>' + 'Number of Incidents: ' + feature.properties.INCIDENTS + '<br>Population: ' + feature.properties.POPULATION + '<br> Incident Ratio: ' + feature.properties.INC_RATIO + '</h3>');


}





// Adding a tile layer (the background map image) to our map
// We use the addTo method to add default object to our map
var baseLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

var baseLayer2 = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
});

var baseLayer3 = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});


var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 0.4,
    "maxOpacity": .8,
    // scales the radius based on map zoom
    "scaleRadius": true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": false,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count'
};


var heatmapLayer = new HeatmapOverlay(cfg);

// creating base map
var myMap = L.map("usmap", {
    zoomDelta: 0.25,
    zoomSnap: 0.25,
    center: [37.8, -97],
    zoom: 4.75,
    layers: [baseLayer3]
});


heatmapLayer.setData(Data2014);






var url_states = "https://raw.githubusercontent.com/kjhealy/us-county/master/data/geojson/gz_2010_us_040_00_500k.json";
console.log(url_states);
d3.json(url_states, function(states_data) {

    console.log(laws);

    // adding law info into geoJson object
    for (i = 0; i < states_data.features.length; i++) {
        Object.entries(laws).forEach(([key, value]) => {
            if (key == states_data.features[i].properties.NAME) {
                states_data.features[i].properties['laws'] = value;
            }
        })
    }

    // console.log(states_data);

    // creating layer for amount of laws per state
    geojson_laws = L.choropleth(states_data, {

        valueProperty: "laws",

        // Set color scale
        scale: ["#ffffb2", "#000000"],
        // scale: ["#ffffb2", "#b10026"],

        // Number of breaks in step range
        steps: 10,

        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
            // Border color
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
        },
        onEachFeature: onEachFeatureP

    });


    // var url_counties = "https://raw.githubusercontent.com/kjhealy/us-county/master/data/geojson/gz_2010_us_050_00_500k.json";
    // console.log(url_counties);
    // d3.json(url_counties, function(county_data) {
    // console.log(county_data);



    // adding crime into geoJson object
    // for (i = 0; i < county_data.features.length; i++) {
    //     Object.entries(--------).forEach(([key, value]) => {
    //         if (key == states_data.features[i].properties.name) {
    //             states_data.features[i].properties['laws'] = value;
    //         }
    //     })
    // }


    // creating layer for squaremiles per county
    geojson_county = L.choropleth(county_data, {

        valueProperty: "INC_RATIO",

        // Set color scale
        // scale: ["#ffffb2", "#000000"],
        scale: ["#ffffb2", "#b10026"],

        // Number of breaks in step range
        steps: 10,

        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
            // Border color
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
        },
        onEachFeature: onEachFeatureCounty

    });



































    // basemaps
    var baseMaps = {
        "Light map": baseLayer,
        "Dark map": baseLayer2,
        "Outdoors": baseLayer3
    };

    // Overlays that may be toggled on or off
    var overlayMaps = {
        "Firearm incidents": heatmapLayer,
        "Firearm regulations": geojson_laws,
        "Incidents by County": geojson_county
    };

    //adding checkmarks with layers in right bottom corner
    L.control.layers(baseMaps, overlayMaps, { collapsed: false, position: 'bottomright' }).addTo(myMap);


    // Add legend (don't forget to add the CSS from index.html)
    var legend = L.control({ position: 'bottomleft' })
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend')
        var limits = geojson_laws.options.limits
        var colors = geojson_laws.options.colors
        var labels = []

        // Add min & max
        div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Number of firearm laws<div class="max">' + limits[limits.length - 1] + '</div></div>'

        limits.forEach(function(limit, index) {
            labels.push('<li style="background-color: ' + colors[index] + '"></li>')
        })

        div.innerHTML += '<ul>' + labels.join('') + '</ul>'
        return div
    }
    legend.addTo(myMap)

});
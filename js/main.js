// List Basemap
var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '©OpenStreetMap Contributors',
});

var satelliteMap = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    attribution: '©Google Satellite Map',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20
});

var googleHibridMap = L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}', {
    attribution: '©Google Hybrid Map',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20
});

var googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '©Google Terrain'
});

// Membuat objek peta
var map = L.map('map', {
    center: [-8.334039, 115.1043217],
    zoom: 10,
    layers: openStreetMap
});

// Menambahkan marker
var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.')
var cities = L.layerGroup([littleton]);

// Membuat layerGrup
var ibukota = L.layerGroup();
var batasKab = L.layerGroup();

// Kontrol layer
var overlayMaps = {
    "Ibukota Kabupaten": ibukota,
    "Batas Kabupaten": batasKab,
};

// Kontrol basemap
var baseMaps = {
    "OpenStreetMap": openStreetMap,
    "Satelite Map": satelliteMap,
    "Google Hibrid": googleHibridMap,
    "Google Terain": googleTerrain,
};

// Menambahkan kontrol layer ke peta
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// Mengambil GeoJSON dari file lokal
fetch("geojson/ibukota.geojson")
    .then(response => response.json())
    .then(data => {
        // Membuat layer GeoJSON
        var geojsonLayer = L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                // Konten popup
                var popupContent = '<div style="width: 200px;" ><img src="' + feature.properties.image + '" alt="img" style="width: 100%;"><br>';
                popupContent += "<b><center>" + feature.properties.name + "</center></b></div>";

                layer.bindPopup(popupContent);
            }
        });
        // Menambahkan layer GeoJSON ke grup ibukota
        geojsonLayer.addTo(ibukota);
    })
    .catch(error => console.error("Error fetching GeoJSON:", error));

// Menambahkan layer dari GeoServer WMS
L.tileLayer.wms('http://geoserver.wefgis-sync.com:8585/geoserver/bali/wms', {
    layers: 'bali:batas-kabupaten-bali',
    format: 'image/png',
    transparent: true
}).addTo(batasKab);

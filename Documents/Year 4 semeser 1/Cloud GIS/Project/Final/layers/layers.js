var wms_layers = [];


        var lyr_PositronBasemap_0 = new ol.layer.Tile({
            'title': 'Positron Basemap',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: '<a href="https://cartodb.com/basemaps/">Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.</a>',
                url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
            })
        });
var format_OverlandStations_1 = new ol.format.GeoJSON();
var features_OverlandStations_1 = format_OverlandStations_1.readFeatures(json_OverlandStations_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_OverlandStations_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_OverlandStations_1.addFeatures(features_OverlandStations_1);
var lyr_OverlandStations_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_OverlandStations_1, 
                style: style_OverlandStations_1,
                popuplayertitle: 'Overland Stations',
                interactive: true,
                title: '<img src="styles/legend/OverlandStations_1.png" /> Overland Stations'
            });
var format_VLineTrainStations_2 = new ol.format.GeoJSON();
var features_VLineTrainStations_2 = format_VLineTrainStations_2.readFeatures(json_VLineTrainStations_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_VLineTrainStations_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_VLineTrainStations_2.addFeatures(features_VLineTrainStations_2);
var lyr_VLineTrainStations_2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_VLineTrainStations_2, 
                style: style_VLineTrainStations_2,
                popuplayertitle: 'V/Line Train Stations',
                interactive: true,
                title: '<img src="styles/legend/VLineTrainStations_2.png" /> V/Line Train Stations'
            });
var format_TramStops_3 = new ol.format.GeoJSON();
var features_TramStops_3 = format_TramStops_3.readFeatures(json_TramStops_3, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_TramStops_3 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_TramStops_3.addFeatures(features_TramStops_3);
var lyr_TramStops_3 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_TramStops_3, 
                style: style_TramStops_3,
                popuplayertitle: 'Tram Stops',
                interactive: true,
                title: '<img src="styles/legend/TramStops_3.png" /> Tram Stops'
            });
var format_MetroTrainStations_4 = new ol.format.GeoJSON();
var features_MetroTrainStations_4 = format_MetroTrainStations_4.readFeatures(json_MetroTrainStations_4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_MetroTrainStations_4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_MetroTrainStations_4.addFeatures(features_MetroTrainStations_4);
var lyr_MetroTrainStations_4 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_MetroTrainStations_4, 
                style: style_MetroTrainStations_4,
                popuplayertitle: 'Metro Train Stations',
                interactive: true,
                title: '<img src="styles/legend/MetroTrainStations_4.png" /> Metro Train Stations'
            });
var format_OverlandLines_5 = new ol.format.GeoJSON();
var features_OverlandLines_5 = format_OverlandLines_5.readFeatures(json_OverlandLines_5, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_OverlandLines_5 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_OverlandLines_5.addFeatures(features_OverlandLines_5);
var lyr_OverlandLines_5 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_OverlandLines_5, 
                style: style_OverlandLines_5,
                popuplayertitle: 'Overland Lines',
                interactive: false,
                title: '<img src="styles/legend/OverlandLines_5.png" /> Overland Lines'
            });
var format_VlineTrainLines_6 = new ol.format.GeoJSON();
var features_VlineTrainLines_6 = format_VlineTrainLines_6.readFeatures(json_VlineTrainLines_6, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_VlineTrainLines_6 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_VlineTrainLines_6.addFeatures(features_VlineTrainLines_6);
var lyr_VlineTrainLines_6 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_VlineTrainLines_6, 
                style: style_VlineTrainLines_6,
                popuplayertitle: 'V/Line Train Lines',
                interactive: false,
                title: '<img src="styles/legend/VlineTrainLines_6.png" /> V/Line Train Lines'
            });
var format_TramLines_7 = new ol.format.GeoJSON();
var features_TramLines_7 = format_TramLines_7.readFeatures(json_TramLines_7, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_TramLines_7 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_TramLines_7.addFeatures(features_TramLines_7);
var lyr_TramLines_7 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_TramLines_7, 
                style: style_TramLines_7,
                popuplayertitle: 'Tram Lines',
                interactive: false,
                title: '<img src="styles/legend/TramLines_7.png" /> Tram Lines'
            });
var format_MetroTrainLines_8 = new ol.format.GeoJSON();
var features_MetroTrainLines_8 = format_MetroTrainLines_8.readFeatures(json_MetroTrainLines_8, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_MetroTrainLines_8 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_MetroTrainLines_8.addFeatures(features_MetroTrainLines_8);
var lyr_MetroTrainLines_8 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_MetroTrainLines_8, 
                style: style_MetroTrainLines_8,
                popuplayertitle: 'Metro Train Lines',
                interactive: false,
                title: '<img src="styles/legend/MetroTrainLines_8.png" /> Metro Train Lines'
            });

lyr_PositronBasemap_0.setVisible(true);lyr_OverlandStations_1.setVisible(true);lyr_VLineTrainStations_2.setVisible(true);lyr_TramStops_3.setVisible(true);lyr_MetroTrainStations_4.setVisible(true);lyr_OverlandLines_5.setVisible(true);lyr_VlineTrainLines_6.setVisible(true);lyr_TramLines_7.setVisible(true);lyr_MetroTrainLines_8.setVisible(true);
var layersList = [lyr_PositronBasemap_0,lyr_OverlandStations_1,lyr_VLineTrainStations_2,lyr_TramStops_3,lyr_MetroTrainStations_4,lyr_OverlandLines_5,lyr_VlineTrainLines_6,lyr_TramLines_7,lyr_MetroTrainLines_8];
lyr_OverlandStations_1.set('fieldAliases', {'fid': 'fid', 'STOP_ID': 'STOP_ID', 'STOP_NAME': 'STOP_NAME', 'MODE': 'MODE', });
lyr_VLineTrainStations_2.set('fieldAliases', {'fid': 'fid', 'STOP_ID': 'STOP_ID', 'STOP_NAME': 'STOP_NAME', 'MODE': 'MODE', });
lyr_TramStops_3.set('fieldAliases', {'fid': 'fid', 'STOP_ID': 'STOP_ID', 'STOP_NAME': 'STOP_NAME', 'MODE': 'MODE', });
lyr_MetroTrainStations_4.set('fieldAliases', {'fid': 'fid', 'STOP_ID': 'STOP_ID', 'STOP_NAME': 'STOP_NAME', 'MODE': 'MODE', });
lyr_OverlandLines_5.set('fieldAliases', {'fid': 'fid', 'SHAPE_ID': 'SHAPE_ID', 'HEADSIGN': 'HEADSIGN', 'SHORT_NAME': 'SHORT_NAME', 'LONG_NAME': 'LONG_NAME', 'MODE': 'MODE', });
lyr_VlineTrainLines_6.set('fieldAliases', {'fid': 'fid', 'SHAPE_ID': 'SHAPE_ID', 'HEADSIGN': 'HEADSIGN', 'SHORT_NAME': 'SHORT_NAME', 'LONG_NAME': 'LONG_NAME', 'MODE': 'MODE', });
lyr_TramLines_7.set('fieldAliases', {'fid': 'fid', 'SHAPE_ID': 'SHAPE_ID', 'HEADSIGN': 'HEADSIGN', 'SHORT_NAME': 'SHORT_NAME', 'LONG_NAME': 'LONG_NAME', 'MODE': 'MODE', });
lyr_MetroTrainLines_8.set('fieldAliases', {'fid': 'fid', 'SHAPE_ID': 'SHAPE_ID', 'HEADSIGN': 'HEADSIGN', 'SHORT_NAME': 'SHORT_NAME', 'LONG_NAME': 'LONG_NAME', 'MODE': 'MODE', });
lyr_OverlandStations_1.set('fieldImages', {'fid': 'TextEdit', 'STOP_ID': 'TextEdit', 'STOP_NAME': 'TextEdit', 'MODE': 'TextEdit', });
lyr_VLineTrainStations_2.set('fieldImages', {'fid': 'TextEdit', 'STOP_ID': 'TextEdit', 'STOP_NAME': 'TextEdit', 'MODE': 'TextEdit', });
lyr_TramStops_3.set('fieldImages', {'fid': 'TextEdit', 'STOP_ID': 'TextEdit', 'STOP_NAME': 'TextEdit', 'MODE': 'TextEdit', });
lyr_MetroTrainStations_4.set('fieldImages', {'fid': 'Range', 'STOP_ID': 'TextEdit', 'STOP_NAME': 'TextEdit', 'MODE': 'TextEdit', });
lyr_OverlandLines_5.set('fieldImages', {'fid': 'TextEdit', 'SHAPE_ID': 'TextEdit', 'HEADSIGN': 'TextEdit', 'SHORT_NAME': 'TextEdit', 'LONG_NAME': 'TextEdit', 'MODE': 'TextEdit', });
lyr_VlineTrainLines_6.set('fieldImages', {'fid': 'TextEdit', 'SHAPE_ID': 'TextEdit', 'HEADSIGN': 'TextEdit', 'SHORT_NAME': 'TextEdit', 'LONG_NAME': 'TextEdit', 'MODE': 'TextEdit', });
lyr_TramLines_7.set('fieldImages', {'fid': 'TextEdit', 'SHAPE_ID': 'TextEdit', 'HEADSIGN': 'TextEdit', 'SHORT_NAME': 'TextEdit', 'LONG_NAME': 'TextEdit', 'MODE': 'TextEdit', });
lyr_MetroTrainLines_8.set('fieldImages', {'fid': 'TextEdit', 'SHAPE_ID': 'TextEdit', 'HEADSIGN': 'TextEdit', 'SHORT_NAME': 'TextEdit', 'LONG_NAME': 'TextEdit', 'MODE': 'TextEdit', });
lyr_OverlandStations_1.set('fieldLabels', {'fid': 'hidden field', 'STOP_ID': 'hidden field', 'STOP_NAME': 'no label', 'MODE': 'hidden field', });
lyr_VLineTrainStations_2.set('fieldLabels', {'fid': 'hidden field', 'STOP_ID': 'hidden field', 'STOP_NAME': 'no label', 'MODE': 'hidden field', });
lyr_TramStops_3.set('fieldLabels', {'fid': 'hidden field', 'STOP_ID': 'hidden field', 'STOP_NAME': 'no label', 'MODE': 'hidden field', });
lyr_MetroTrainStations_4.set('fieldLabels', {'fid': 'hidden field', 'STOP_ID': 'hidden field', 'STOP_NAME': 'no label', 'MODE': 'hidden field', });
lyr_OverlandLines_5.set('fieldLabels', {'fid': 'no label', 'SHAPE_ID': 'no label', 'HEADSIGN': 'no label', 'SHORT_NAME': 'no label', 'LONG_NAME': 'no label', 'MODE': 'no label', });
lyr_VlineTrainLines_6.set('fieldLabels', {'fid': 'no label', 'SHAPE_ID': 'no label', 'HEADSIGN': 'no label', 'SHORT_NAME': 'no label', 'LONG_NAME': 'no label', 'MODE': 'no label', });
lyr_TramLines_7.set('fieldLabels', {'fid': 'no label', 'SHAPE_ID': 'no label', 'HEADSIGN': 'no label', 'SHORT_NAME': 'no label', 'LONG_NAME': 'no label', 'MODE': 'no label', });
lyr_MetroTrainLines_8.set('fieldLabels', {'fid': 'no label', 'SHAPE_ID': 'no label', 'HEADSIGN': 'no label', 'SHORT_NAME': 'no label', 'LONG_NAME': 'no label', 'MODE': 'no label', });
lyr_MetroTrainLines_8.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});
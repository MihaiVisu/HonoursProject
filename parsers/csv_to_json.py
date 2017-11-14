import csv
import json
import sys


features = {
    "type": "FeatureCollection",
    "features": []
}


def add_geojson_feature(feature):
    features['features'].append(feature)


def create_feature(row, header):
    properties = {}
    for k in range(0,len(header)):
        if header[k] == 'gpsLatitude' or header[k] == 'latitude':
            latitude = row[k]
        elif header[k] == 'gpsLongitude' or header[k] == 'longitude':
            longitude = row[k]
        else:
            properties[header[k]] = row[k]
    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [float(longitude), float(latitude)],
        },
        "properties": properties
    }
    return feature


def read_file(file_name):
    with open(file_name, 'rt') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='\"')
        header = next(reader)
        for row in reader:
            add_geojson_feature(create_feature(row, header))


read_file(sys.argv[1])

with open('../'+sys.argv[2], 'w') as jsonfile:
    json.dump(features, jsonfile, indent=4)

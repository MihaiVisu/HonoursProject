import csv
import sys
import glob


cycling_files = glob.glob('../data/20*.csv')

rows = []
header = []

def read_file(file_name):
    with open(file_name, 'rt') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=',', quotechar='\"')
        for row in reader:
            # latitude is second, index 1
            # longitude is third, index 2
            if row['latitude'] == 'latitude' or row['latitude'] == '-1':
                continue
            if 55.939115 < float(row['latitude']) < 55.9421333 and -3.2003785 < float(row['longitude']) < -3.1913327:
                urban_env = 1
            else:
                urban_env = 0
            row['urban_environment'] = urban_env
            if row['latitude'] != '-1':
                rows.append(row)


def write_file(file_name, rows):
    with open(file_name, 'wt') as csvfile:
        writer = csv.DictWriter(csvfile, delimiter=',', quotechar='\"', fieldnames=list(rows[0].keys()))
        writer.writeheader()
        for row in rows:
            writer.writerow(row)

for f in cycling_files:
    read_file(f)

write_file('../data/' + sys.argv[1], rows)

import csv
import sys


latitude1 = float(sys.argv[1])
longitude1 = float(sys.argv[2])

latitude2 = float(sys.argv[3])
longitude2 = float(sys.argv[4])

urban_env = int(sys.argv[5])

rows = []
with open('../../data/output.csv', 'rt') as csvfile:
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='\"')
    for row in reader:
        if row['urban_environment'] == 0:
            if latitude1 < row['latitude'] < latitude2 and longitude1 < row['longitude'] < longitude2:
                row['urban_environment'] = urban_env
        rows.append(row)

with open('../../data/split_outputs.csv', 'wt') as csvfile:
    writer = csv.DictWriter(csvfile, delimiter=',', quotechar='\"', fieldnames=list(rows[0].keys()))
    writer.writeheader()
    writer.writerows(rows)

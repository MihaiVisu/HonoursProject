import csv
import sys
import glob


cycling_files = glob.glob('../../data/20*.csv')

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

            time = row['time']

            row['time'] = "{}-{}-{} {}:{}:{}".format(
                time[:4], time[4:6], time[6:8], time[8:10], time[10:12], time[12:14]
            )

            if (55.939996 < float(row['latitude']) < 55.9425649 and -3.191918 < float(row['longitude']) < -3.1913328) or (55.9421331 < float(row['latitude']) < 55.942758 and -3.2003784 < float(row['longitude']) < -3.1915322) or (55.942602 < float(row['latitude']) < 55.942926 and -3.195157 < float(row['longitude']) < -3.191799):
                urban_env = 1
            elif (55.942691 < float(row['latitude']) < 55.945123 and -3.191755 < float(row['longitude']) < -3.190914) or (55.942650 < float(row['latitude']) < 55.943167 and -3.191122 < float(row['longitude']) < -3.188162):
                urban_env = 2
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

write_file('../../data/' + sys.argv[1], rows)

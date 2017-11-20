from sklearn.cluster import KMeans
from sklearn.cross_validation import KFold

import numpy as np
import pandas as pd
import csv


def get_training_accuracy_with_kfolds(estimator, x_tr, y_tr, kf):

    score_array = np.empty(kf.n_folds)

    for (idx, (train_feature, test_feature)) in enumerate(kf):
        estimator.fit(x_tr.iloc[train_feature], y_tr.iloc[train_feature])
        score_array[idx] = estimator.score(x_tr.iloc[test_feature], y_tr.iloc[test_feature])

    return np.mean(score_array)


data = pd.read_csv('../data/output.csv')
pm_vals = ['pm1', 'pm2_5', 'pm10']

x_pm = data[pm_vals]
y = data['urban_environment']

# kf_3 = KFold(len(x_pm), n_folds=3, shuffle=True, random_state=0)
kmeans = KMeans(n_clusters=3, random_state=0)
kmeans.fit(x_pm, y)

predicted_results = kmeans.predict(x_pm)

rows = []
with open('../data/output.csv', 'rt') as csvfile:
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='\"')
    cnt = 0
    for row in reader:
        row['predicted_environment'] = predicted_results[cnt]
        rows.append(row)
        cnt += 1

with open('../data/predicted_outputs.csv', 'wt') as csvfile:
    writer = csv.DictWriter(csvfile, delimiter=',', quotechar='\"', fieldnames=list(rows[0].keys()))
    writer.writeheader()
    writer.writerows(rows)

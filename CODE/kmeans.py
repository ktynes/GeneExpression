#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Apr  1 21:47:39 2020

@author: dell
"""

import pandas as pd

from time import time
import numpy as np
import matplotlib.pyplot as plt

from sklearn import metrics
from sklearn.cluster import KMeans
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.preprocessing import scale
from sklearn.metrics import confusion_matrix, classification_report


from mpl_toolkits import mplot3d


df1 = pd.read_csv('/home/dell/Desktop/workspace/GeneExpression/combinedFiltered.csv')
#df2=df1[:, df1.columns != 'CancerType']
df2 = df1.drop(['CancerType'], axis=1)
#print(df2)
n_samples, n_features = df2.shape
#print(n_samples, n_features)
kmeans = KMeans(n_clusters = 4, n_init= 20, random_state =0)

kmeans.fit(df2)

true_labels=df1['CancerType'].to_numpy()
colour_theme = np.array(['red', 'blue', 'green', 'purple'])

true_labels2 = []
for i in true_labels:
    if i == 'Lung':
        true_labels2.append(3)
    if i == 'Blood':
        true_labels2.append(0)
    if i == 'Kidney':
        true_labels2.append(1)
    if i == 'Breast':
        true_labels2.append(2)

#print(df2.columns)
fig = plt.figure(figsize=[8, 5])
"""
#figure, axes = plt.subplots(nrows=2, ncols=2)
plt.subplot(1,2,1)
plt.scatter( y=df2['ENSG00000003400.13'], x=df2['ENSG00000280002.1'],c=colour_theme[true_labels2])
plt.subplot(1,2,2)
plt.scatter( y=df2['ENSG00000003400.13'], x=df2['ENSG00000280002.1'],c=colour_theme[kmeans.labels_])
#fig.savefig('kmeans.png')
"""
 
#print(set(kmeans.labels_))
fig = plt.figure(figsize=(10,10))
ax = fig.add_subplot(111, projection='3d')
ax.scatter(df2['ENSG00000279019.1'],df2['ENSG00000279141.2'],df2['ENSG00000280366.1'], 
            c=true_labels2, cmap='plasma',
            edgecolor='k', s=20, alpha = 1)


ax.view_init(30, -60)
plt.draw()
    

"""
print(df2.columns)
Sum_of_squared_distances = []
K = range(1,15)
for k in K:
    km = KMeans(n_clusters=k)
    km = km.fit(df2)
    Sum_of_squared_distances.append(km.inertia_)


fig = plt.figure(figsize=[5, 5])
plt.plot(K, Sum_of_squared_distances, 'bx-')
plt.xlabel('k')
plt.ylabel('Sum_of_squared_distances')
plt.title('Elbow Method For Optimal k')
plt.show()
fig.savefig('elbowplot.png')
"""


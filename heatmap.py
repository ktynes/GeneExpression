#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Mar 20 20:47:08 2020

@author: dell
"""

import numpy as np; np.random.seed(0)
import seaborn as sns; sns.set()
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
from sklearn import preprocessing




matplotlib.rcParams['pdf.fonttype'] = 3
matplotlib.rcParams['ps.fonttype'] = 3



#print(arr1)

df1 = pd.read_csv('/home/dell/Desktop/workspace/GeneExpression/combinedFiltered.csv')

df1 = df1.drop(['CancerType'], axis =1)
print(df1)

x = df1.values #returns a numpy array
min_max_scaler = preprocessing.MinMaxScaler()
x_scaled = min_max_scaler.fit_transform(x)
df2 = pd.DataFrame(x_scaled)

print(df2)


ax = plt.subplots(figsize=(10,10))
fig = sns.heatmap(df1)
plt.savefig('HeatMap_DVA.pdf', transparent = True, dpi=400)





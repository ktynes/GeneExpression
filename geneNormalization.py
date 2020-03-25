
import pandas as pd
import numpy as np
import statistics as stat

#read dataset csv file  
data= pd.read_csv('3Samples_format2.csv')

#remove any non gene column
for notGene in data.columns:
    if not(notGene.startswith('ENSG')) :
        data = data.drop(columns=[notGene])

#remove any gene not expressed in all samples
for unexpressedGene in data.columns:
    if not(data.loc[:,unexpressedGene].any()) :     
        data = data.drop(columns=[unexpressedGene])

numberOfGenes = len(data.columns)  
numberOfSamples = len(data)

#take log of all values
dataLog = data.copy()
for i in range(0,numberOfSamples):
    dataLog.loc[i,:] = np.log(dataLog.loc[i,:])    



#calculate average of each gene
genesAverage = []
for i in range(0, numberOfGenes):
    genesAverageList = []
    for j in range(0,numberOfSamples):
        genesAverageList.append(dataLog.iloc[j,i])
    genesAverage.append(stat.mean(genesAverageList))
    
#add average as column in dataframe
dataLog = dataLog.append(pd.Series(genesAverage, index=dataLog.columns, name = 'average'))

#filter genes that have infinite average values
dataLog = dataLog.replace([np.inf,-np.inf], np.nan)
dataLog = dataLog.dropna(axis=1)


#subtract average from log(counts)
for i in range(0,numberOfSamples):
    dataLog.loc[i,:] -= dataLog.loc['average',:] 


#calculate scaling factor of each sample = exp(median())
scalingFactors = []
for i in range(0,numberOfSamples):
    scalingFactors.append(np.exp(np.median(dataLog.loc[i,:])))

print(scalingFactors)


#divide original read counts by the scaling factors
for i in range(0,numberOfSamples):
    data.loc[i,:] /= scalingFactors[i]
    
data.head()








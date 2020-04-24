# Gene Expression Disease Prediction

## Description
In this project, we explored the relationship between genes and cancer type using machine learning and interactive visualization. Our machine learning analysis consists of unsupervised clustering of genes and principal component analysis. We also employed supervised algorithms for feature selection and disease prediction. We ended up using the results of our supervised algorithm (Random Forest) in the interactive visualization tool. The results of the other algorithms can be found in the final report. In our interactive visualization, you can hover over different organs (Blood, Kidney, Breast, Lung) to explore a bar graph of the most important genes for predicting that organ's cancer type, and a heat map of gene expression levels for that cancer type.

## Online Access
The d3 visualization for our project is hosted here: https://ktynes.github.io/GeneExpression/

## Installation & Execution
Firstly, you need to create a python3 virtual environment, these instructions assume you have the virtualenv and pip python package already installed. Do this by installing the requirements in requirements.txt shown below.
```
virtualenv gene_exp
source gene_exp/bin/activate
pip install -r requirements.txt
python -m http.server 8000
```
After following the above instructions, navigate to http://0.0.0.0:8000/ to view the visualization.

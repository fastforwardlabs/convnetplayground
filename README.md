# semsearch
A semantic search module for image cagetorization



# Tasks

[ x ] Explore tensorflow hub or keras for pretrained model loading.
[ x ] Extract features using selected model.
[ x] Semantic seach interface


## How it works

### Datasets



### Extracting Images with Pretrained Neural Networks
We use the keras library modelzoo which contains keras implementations of several well known convolutional neural networks for image analysis. We load a pretrained version of these implementations with weights learned from training on imagenet.

### Similarity Score Rating

For each of the extracted feature we compute a similarity score using multiple similarity distance metrics.


## Prototype Design

The prototype interface is designed as a learning experience where the user is introduced to several concepts related to how CNNs work.

### Semsearch

For each selected image, the user is able to view the top 50 most similar images in the dataset. The level of similarity is conveyed by an orange bar below each image icon.
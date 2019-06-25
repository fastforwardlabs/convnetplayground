# ConveNet Playground

> A prototype that allows you explore how convolutional neural network models. It covers areas like feature extraction and semantic search (image retrieval), visualizations of internal components of CNNs etc.


[<img src="docs/screen.jpg" width="100%">](https://fastforwardlabs.github.io/semsearch/)
https://github.com/fastforwardlabs/semsearch

## Prototype

ConvNet Playground, the prototype created for this report, allows users to explore representations learned by a CNN model and has two main parts. The first part - Semantic Search demonstrates an example of using layers from pretrained CNN models to extract features which are then used to implement similarity search. The intuition here is that various layers in a CNN have learned important concepts which allows them extract meaningful representations that capture the similarity  between  images. The second part of the prototype - Model Explorer is a visualization tool that allows the user inspect features learned by layers in a CNN and in so doing build better intuition on how CNNs work.

## Semantic Similarity Search

<img src="docs/featextraction.jpg" width="100%">

We define the task of semantic search as follows:

>  Given a dataset of existing images, and a new arbitrary image, find a subset of images  from the dataset that are most similar to the new image.

Semantic similarity search is performed as a three step process. First, a pretrained CNN model is used to extract features (represented as vectors) from each image in the dataset. Next, a distance metric is used to compute the distance between each image vector and all other image vectors in the dataset. Finally, to perform a search, we retrieve the precomputed distance values between the searched image and all other images sorted in the order of _closest_ to _farthest_.

In practice, there are many choices to be made while implementing a similarity search tool based on convolutional neural networks. An appropriate model architecture needs to be selected, appropriate layers from the model and an appropriate distance metric. The prototype allows the user explore results from these configurations across several datasets.


### Datasets
#### Iconic200: 
This is a dataset of real world images collected from Flickr (creative commons).
It contains images spanning 10 keyword searches (arch, banana, volkswagen beetle, eiffel tower, empire state building, ferrari, pickup truck, sedan, stonehenge, tractor).
These images are chosen deliberately with conceptual overlaps (several car brands, similar colors across classes) to highlight 
how various models perform in correctly representing similarity.
 
#### Fashion200
Fashion200 is a collection of 200 images (10 categories) of real fashion models from the<a href="https://www.kaggle.com/paramaggarwal/fashion-product-images-dataset"> Kaggle Fashion Product Images Dataset</a> .
Images have a max width of 300px. Categories include flipflops, menjeans, menshirt, mentshirt, sandals, sportshoe, womenheels, womenjeans, womenshirt, womentshirt. Again, concept overlaps exists to allow the user interactively explore how well various models correctly represent and distinguish each class.
                
#### Tinyimagenet
This dataset contains 64px * 64px images and is a subset (200) of the
    <a href="https://tiny-imagenet.herokuapp.com/" target="_blank" rel="noopener noreferrer" > Tiny Imagenet Visual Recognition Challenge dataset.</a> 
It consists of images from 10 categories (arch, bottle, bridge, bus, face, frog, goldfish, sandals, teapot, tractor).
 
####  Cifar10
This is a subset (200 images) of the popular 
<a href="https://www.cs.toronto.edu/~kriz/cifar.html" target="_black"> cifar10 </a>  dataset 
containing 20 images from 10 randomly selected classes. Each image is 32px by 32px in dimension.



### Models and Layers
We provide results from 7 models (vgg16, vgg19, mobilenet, xception, resnet50, inceptionv3, densenet121) and a selection of 8 layers from each model. In selecting layers, emphasis is placed on layers that perform convolutional operations and have trainable parameters. The models are presented in order of increasing complexity (number of layers) and show marked differences in their ability to generate features that correctly identify similar images. For ease of implementation, we use implementations of pretrained models from the Keras applications package https://github.com/keras-team/keras-applications.

### Distance Metric 
We provide results that from the use of 4 different distance metrics in measuring the similarity between features extracted from all images in each dataset. These include cosine, euclidean, squared euclidean and minkowsi distances.   

## Model Explorer

The second part of the part of the prototype is a visualization interface for exploring the features or representations learned by  each layer in a pretrained CNN. We support 9 models ((vgg16, vgg19, mobilenet, mobilenetv2 xception, resnet50, inceptionv3, densenet121, nasnetmobile). Using feature based optimization methods, we generate images that maximally  excite various channels (groups of neurons) in the layers of a model.  For each model, we select a subset of layers and for each layer we select a subset of channels. Only layers with trainable parameters and activations are visualized (a requirement for optimization based feature visualization); 30 channels are sampled at random from each layer.


## Prototype Interface Design

The prototype interface is designed as a learning experience where the user is introduced to several concepts related to how CNNs work.

 Building for simplicity - selectively reveal complexity
- Designing for stability. Given that the interface has a large number of moving parts, ie aspects that change based on seelctions, it was important to structure these content such that these changes result in minimal movement of elements (moving or jarring content sudden jump). Only the most important elements should move/change and hence draw the user's attention. This was achieved by limiting the search ranking results to a fixed number, making the search result container have a maximum height after which a styled scrollbar is introduced (same for content of configuration panel)

- Multimodal Approaches for building intuition
Building on the principle of selective reveal, the interface is designed to selectively present multiple ways to exploring the underlying dataset. On one front the user may make a simple selection from the dataset catalog

- Helpful Defaults
Presenting interesting results to the user upfront.

- 


### Semantic Search

The interface provides access to 3 main datasets on which the user can view results of similarity rankings.
They can select a dataset, a model, a layer from the given model and a similarity metric value. For each model, de

As these configurations are selected the user is presented with a similarity search results based on their selections. For the given dataset, the first image is selected by default and the top 50 most similar images based on the configuration are shown.

The similarity metric is conveyed as a percentage bar below each image.

### Prototype Implementation Details
The prototype is designed in Reactjs as a static web application where the content of the  application is precomputed and loaded at runtime. 

#### Generating Images of Neurons and Layers
Images which represent layers and neurons are generated using the Lucid library which implements optimization based feature visualization for neurons, channels, logits and layers of a neural network. Given that the neural network implementations in the prototype are based on the keras application implementations, we use the Lucid4Keras package to easily import keras models to a format that can be processed by the Lucid Framework. 

#### Generating Similarity Metrics and UMAP Embeddings
For each model in the dataset, we extract embeddings which are stored in json files and subsequently loaded by the prototype interface. This process is done for each model, for each layer in each model and for each similarity metric. Similarity computation is performed using the scikit-learn library. We also pre-compute UMAP embeddings for each image in each dataset. This process is done for features extracted using each layer in each model.


 

## Business Use Case

In practice, there are numerous use cases for which it is beneficial to automatically extract meaningful representations of an image and leverage that for downstream tasks such as sorting, searching, curating etc. In our prototype, we make a few assumptions (the searched image is arbitrary and its may or may not be similar to any existing image in our dataset). In the real world, there may be additional information that can be exploited for even better search results. For example, an ecommerce retail shop with a known catalog can fine tune their search by using a specialized neural network trained to identify similarity for their dstaset. The same general principles apply.

- Client organising image documents (receipts)
- Data curation steps
- Initial training data collection
- Enabling image based search for e-commerce platforms.

Interface Considerations

-

Structuring the Problem

Caveats

- The results we see are likely because our classes are in some way related to imagenet hence the ability to extract meaning represenations of similarity. For more fine grained similiarity, more advances, and problem specific methods should be used. For instance, see the use of triplet loss for facial image similarity measurement, the use of multimodal log data to train a model for information retrieval
- Similarity score generation is compute intensive. For our prototype, a single image took about xxx seconds on a an ... It is recommended that this process is run as a parralellized batch job.

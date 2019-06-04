(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{38:function(e,t,a){e.exports=a.p+"static/media/layer.9952a8d0.png"},48:function(e,t,a){e.exports=a(97)},53:function(e,t,a){},54:function(e,t,a){},87:function(e,t,a){},88:function(e){e.exports={models:[{name:"vgg16",layers:[{name:"block1_conv1",type:"Conv2D",paremtercount:1792,layer_index:1,totallayers:19},{name:"block1_pool",type:"MaxPooling2D",paremtercount:0,layer_index:3,totallayers:19},{name:"block3_conv1",type:"Conv2D",paremtercount:295168,layer_index:7,totallayers:19},{name:"block3_pool",type:"MaxPooling2D",paremtercount:0,layer_index:10,totallayers:19},{name:"block4_conv1",type:"Conv2D",paremtercount:1180160,layer_index:11,totallayers:19},{name:"block4_pool",type:"MaxPooling2D",paremtercount:0,layer_index:14,totallayers:19},{name:"block5_conv1",type:"Conv2D",paremtercount:2359808,layer_index:15,totallayers:19},{name:"block5_pool",type:"MaxPooling2D",paremtercount:0,layer_index:18,totallayers:19}]},{name:"resnet50",layers:[{name:"res2a_branch2a",type:"Conv2D",paremtercount:4160,layer_index:5,totallayers:174},{name:"res2b_branch2a",type:"Conv2D",paremtercount:16448,layer_index:17,totallayers:174},{name:"res3b_branch2a",type:"Conv2D",paremtercount:65664,layer_index:49,totallayers:174},{name:"res4a_branch2a",type:"Conv2D",paremtercount:131328,layer_index:79,totallayers:174},{name:"res4e_branch2a",type:"Conv2D",paremtercount:262400,layer_index:121,totallayers:174},{name:"res4c_branch2a",type:"Conv2D",paremtercount:262400,layer_index:101,totallayers:174},{name:"res5a_branch2a",type:"Conv2D",paremtercount:524800,layer_index:141,totallayers:174},{name:"res5c_branch2c",type:"Conv2D",paremtercount:1050624,layer_index:169,totallayers:174}]},{name:"resnet50",layers:[{name:"res2a_branch2a",type:"Conv2D",paremtercount:4160,layer_index:5,totallayers:174},{name:"res2b_branch2a",type:"Conv2D",paremtercount:16448,layer_index:17,totallayers:174},{name:"res3b_branch2a",type:"Conv2D",paremtercount:65664,layer_index:49,totallayers:174},{name:"res4a_branch2a",type:"Conv2D",paremtercount:131328,layer_index:79,totallayers:174},{name:"res4e_branch2a",type:"Conv2D",paremtercount:262400,layer_index:121,totallayers:174},{name:"res4c_branch2a",type:"Conv2D",paremtercount:262400,layer_index:101,totallayers:174},{name:"res5a_branch2a",type:"Conv2D",paremtercount:524800,layer_index:141,totallayers:174},{name:"res5c_branch2c",type:"Conv2D",paremtercount:1050624,layer_index:169,totallayers:174}]}],datasets:[{name:"tinyimagenet",icon:"imagenet.jpg"},{name:"cifar10",icon:"cifar.jpg"}],metrics:["cosine","hamming","euclidean","jaccard","minkowski"]}},89:function(e){e.exports={0:[["0","1.0"],["2","0.547"],["8","0.505"],["1","0.435"],["9","0.4"],["3","0.374"],["7","0.37"],["5","0.343"],["6","0.329"],["4","0.316"]],1:[["1","1.0"],["7","0.759"],["9","0.695"],["2","0.639"],["3","0.563"],["5","0.446"],["0","0.435"],["8","0.416"],["6","0.203"],["4","0.111"]],2:[["2","1.0"],["1","0.639"],["7","0.624"],["8","0.557"],["0","0.547"],["9","0.546"],["3","0.446"],["5","0.434"],["4","0.252"],["6","0.173"]],3:[["3","1.0"],["7","0.568"],["1","0.563"],["9","0.523"],["2","0.446"],["8","0.394"],["0","0.374"],["6","0.316"],["5","0.288"],["4","0.209"]],4:[["4","1.0"],["6","0.394"],["8","0.317"],["0","0.316"],["5","0.283"],["2","0.252"],["3","0.209"],["7","0.199"],["9","0.144"],["1","0.111"]],5:[["5","1.0"],["7","0.514"],["1","0.446"],["2","0.434"],["9","0.409"],["0","0.343"],["8","0.305"],["6","0.302"],["3","0.288"],["4","0.283"]],6:[["6","1.0"],["4","0.394"],["0","0.329"],["3","0.316"],["5","0.302"],["8","0.301"],["7","0.269"],["9","0.22"],["1","0.203"],["2","0.173"]],7:[["7","1.0"],["1","0.759"],["9","0.683"],["2","0.624"],["3","0.568"],["8","0.533"],["5","0.514"],["0","0.37"],["6","0.269"],["4","0.199"]],8:[["8","1.0"],["2","0.557"],["7","0.533"],["0","0.505"],["1","0.416"],["3","0.394"],["9","0.357"],["4","0.317"],["5","0.305"],["6","0.301"]],9:[["9","1.0"],["1","0.695"],["7","0.683"],["2","0.546"],["3","0.523"],["5","0.409"],["0","0.4"],["8","0.357"],["6","0.22"],["4","0.144"]]}},90:function(e,t,a){e.exports=a.p+"static/media/model.20a139c6.png"},95:function(e,t,a){},96:function(e,t,a){},97:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),s=a(27),i=a.n(s),r=a(5),o=a(6),c=a(8),m=a(7),d=a(9),u=a(18),h=a(16),p=a(99),b=function(e){function t(){return Object(r.a)(this,t),Object(c.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement("div",null,"Convnet Playground is a research prototype by Clouderaa Fast Forward Labs, built to accompany our updated report on Image Analysis. More about this report is described in our blog post.",l.a.createElement("div",{className:"horrule mb10 pt10"}),"Convolutional Neural Networks (Convnets or CNNs) are deep neural networks that can learn hierarchical representations useful for image analysis. Early layers in a CNN learn low level features (e.g. lines, edges, shapes, colours) while later layers learn high level concepts (e.g eyes, legs, faces, doors etc) depending on the dataset used for training. In Convnet Playground, features extracted using layers from a CNN are used for semantic search (image retrieval based on similarity of extracted features).",l.a.createElement("div",{className:"horrule mb10 pt10"}),l.a.createElement("div",{className:"boldtext"}," Semantic Search "),"This section of the prototype allows you explore similarity rankings from various layers of a trained CNN. The user can select a configuration (dataset, model, layer, distance metric) and then view how these result in different image similarity rankings.",l.a.createElement("br",null),l.a.createElement("div",{className:"boldtext mt10"}," Models Explorer"),"This section enables the user to view visualizations of select layers and neurons within a model. This can help provide intuition on how/why CNNs are effective for image analysis tasks such as image classification object detection, image segmentation etc.",l.a.createElement("br",null))}}]),t}(n.Component),v=(a(53),a(15)),y=(a(54),a(28)),g=a.n(y),f=a(42),E=a.n(f),N=function(e){function t(){return Object(r.a)(this,t),Object(c.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement(v.Header,{"aria-label":"Convolutional Neural Network Playground"},l.a.createElement(v.SkipToContent,null),l.a.createElement(v.HeaderName,{href:"/",prefix:""},"ConvNet Playground"),l.a.createElement(v.HeaderNavigation,{"aria-label":"Convolutional Neural Network Playground"},l.a.createElement("div",{className:"navbarlinks  "},l.a.createElement(u.b,{exact:!0,to:"/"}," Semantic Search ")),l.a.createElement("div",{className:"navbarlinks "},l.a.createElement(u.b,{to:"/models"}," Model Explorer ")),l.a.createElement("div",{className:"navbarlinks "},l.a.createElement(u.b,{to:"/extra"}," Extras "))),l.a.createElement(v.HeaderGlobalBar,null,l.a.createElement(v.HeaderGlobalAction,{"aria-label":"Notifications"},l.a.createElement(g.a,null)),l.a.createElement(v.HeaderGlobalAction,{"aria-label":"App Switcher"},l.a.createElement(E.a,null)))),l.a.createElement("div",null," ",l.a.createElement("br",null)," ",l.a.createElement("br",null),"  ",l.a.createElement("br",null),"  ",l.a.createElement("br",null)," "))}}]),t}(n.Component),x=function(e){function t(){return Object(r.a)(this,t),Object(c.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement("div",null,"Made with ",l.a.createElement("span",{className:"redcolor"},"\u2665")," at ",l.a.createElement("a",{href:"http://experiments.fastforwardlabs.com/",target:"blank"},"Cloudera Fast Forward Labs"),".")}}]),t}(n.Component),k=(a(87),function(e){function t(){return Object(r.a)(this,t),Object(c.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement("div",{className:"horrule mb10 pt10"}),"Convolutional Neural Networks (Convnets or CNNs) are deep neural networks that can learn hierarchical representations useful for image analysis. Early layers in a CNN learn low level features (e.g. lines, edges, shapes, colours) while later layers learn high level concepts (e.g eyes, legs, faces, doors etc) depending on the dataset used for training. In Convnet Playground, features extracted using layers from a CNN are used for semantic search (image retrieval based on similarity of extracted features). To explore this prototype, the user can select a configuration (dataset, model, layer, distance metric) and then view how these result in different image similarity rankings.",l.a.createElement("div",{className:"horrule mb10 pt10"}),l.a.createElement("div",{className:"boldtext"}," Datasets "),"[TinyImagenet] This dataset contains 64px * 64px images and is a subset of the Tiny Imagenet Visual Recognition Challenge dataset. It consists of images from 10 categories (faces, shoes, teapots, goldfish, frogs, ..)",l.a.createElement("br",null),"[Iconic3k] This is a dataset collected from Flickr images (open attribution) of real world iconic images taken by users. It contains images spanning 10 keyword searches (toyota corolla, volkswagen beetle, honda civic, tractors, bananna, pineapples, ..)",l.a.createElement("div",{className:"boldtext mt10"}," Models and Layers"),"We provide 10 models and a selection of layers from each model. These include VGG16, ResNet50, .. .",l.a.createElement("br",null)," Click on a model or layer to select it and layer to display additional information.")}}]),t}(n.Component));function w(e,t){return e.length<=t?e:e.substring(0,t)+" .."}function C(e){return(new Intl.NumberFormat).format(Math.round(10*e)/10)}function j(e){return e<1&&e>0?e:Math.abs(e)>=1e6?C(e/1e6)+"M":Math.abs(e)>=1e3?C(e/1e3)+"k":C(e)}var S=function(e){function t(e){var n;Object(r.a)(this,t),n=Object(c.a)(this,Object(m.a)(t).call(this,e));var l=a(88),s=(l.datasets[0].name,l.models[0].name,l.metrics[0],l.models[0].layers[0],a(89));return n.state={selecteddataset:0,selectedmodel:0,selectedsimimage:0,selectedlayer:0,selectedmetric:0,similarityArray:s,datasetsList:l.datasets,modelsList:l.models,distanceMetricList:l.metrics,showorientationmodal:!1},n.updateSimilarity(),n}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){document.title="ConvNet Playground | Semantic Search Explorer"}},{key:"componentDidUpdate",value:function(e,t){this.state.selectedmodel===t.selectedmodel&&this.state.selectedmetric===t.selectedmetric&&this.state.selectedlayer===t.selectedlayer&&this.state.selecteddataset===t.selecteddataset||this.updateSimilarity()}},{key:"clickDatasetImage",value:function(e){this.setState({selecteddataset:e.target.getAttribute("indexvalue")}),this.setState({selectedmodel:0})}},{key:"clickModelImage",value:function(e){this.setState({selectedmodel:e.target.getAttribute("indexvalue")}),this.setState({selectedlayer:0})}},{key:"clickLayerImage",value:function(e){this.setState({selectedlayer:e.target.getAttribute("indexvalue")})}},{key:"clickMetricImage",value:function(e){this.setState({selectedmetric:e.target.getAttribute("indexvalue")})}},{key:"clickSimilarImage",value:function(e){this.setState({selectedsimimage:e.target.getAttribute("indexvalue")})}},{key:"toggleSemanticModal",value:function(e){this.setState({showorientationmodal:!this.state.showorientationmodal})}},{key:"updateSimilarity",value:function(){var e="/convnetplayground/assets/semsearch/similarity/"+this.state.datasetsList[this.state.selecteddataset].name+"/"+this.state.modelsList[this.state.selectedmodel].name+"/"+this.state.distanceMetricList[this.state.selectedmetric]+"/"+this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name+".json",t=fetch(e).then(function(e){if(200===e.status)return e.json().then(function(e){return e});console.log("Looks like there was a problem. Status Code: "+e.status)}).catch(function(e){console.log("Fetch Error :-S",e)}),a=this;t.then(function(e){e&&a.setState({similarityArray:e})})}},{key:"render",value:function(){var e=this,t=this.state.datasetsList.map(function(t,a){var n="/convnetplayground/assets/semsearch/images/"+t.icon;return l.a.createElement("div",{key:t.name+"fullbox"+a,className:"iblock datasetfullbox clickable mb10"},l.a.createElement("div",{className:"datasettitles"}," ",t.name.toUpperCase()),l.a.createElement("img",{onClick:e.clickDatasetImage.bind(e),src:n,alt:"",className:"datasetbox rad2 "+(e.state.selecteddataset==a?"active":""),indexvalue:a}))}),n=this.state.modelsList.map(function(t,n){return l.a.createElement("div",{key:t.name+"fullbox"+n,className:"iblock datasetfullbox clickable mb10 "},l.a.createElement("div",{className:"datasettitles"}," ",t.name.toUpperCase()),l.a.createElement("img",{onClick:e.clickModelImage.bind(e),src:a(90),alt:"",className:"datasetbox rad2 "+(e.state.selectedmodel==n?"active":""),indexvalue:n}))}),s=this.state.modelsList[this.state.selectedmodel].layers.map(function(t,n){return l.a.createElement("div",{key:t+"fullbox"+n,className:"iblock datasetfullbox clickable mb10 "},l.a.createElement("div",{className:"datasettitles"}," ",w(t.name,11).toLowerCase()),l.a.createElement("img",{onClick:e.clickLayerImage.bind(e),src:a(38),alt:"",className:"datasetbox rad2 "+(e.state.selectedlayer==n?"active":""),indexvalue:n}))}),i=this.state.distanceMetricList.map(function(t,n){return l.a.createElement("div",{key:t+"fullbox"+n,className:"iblock datasetfullbox clickable mb10 "},l.a.createElement("div",{className:"datasettitles"}," ",w(t,11).toLowerCase()),l.a.createElement("img",{onClick:e.clickMetricImage.bind(e),src:a(38),alt:"",className:"datasetbox rad2 "+(e.state.selectedmetric==n?"active":""),indexvalue:n}))}),r=this.state.similarityArray[this.state.selectedsimimage].map(function(t,a){var n,s="/convnetplayground/assets/semsearch/datasets/"+e.state.datasetsList[e.state.selecteddataset].name+"/"+t[0]+".jpg",i=(1*t[1]).toFixed(3);return l.a.createElement("div",{key:t[0]+"winper",className:"iblock similarityfullbox mr5 mb5 positionrelative"},l.a.createElement("img",{key:t[0]+"image"+t[0],onClick:e.clickSimilarImage.bind(e),src:s,alt:"",className:"simiimage clickable rad2 ",indexvalue:t[0]}),l.a.createElement("div",{className:"outersimbar"},l.a.createElement("div",{className:"innersimbar",style:{width:100*(n=i,n<0?0:n>1?1:n)+"%"}})),l.a.createElement("div",{className:"similarityscorebox"},j(i)," "))}),o="/convnetplayground/assets/semsearch/datasets/"+this.state.datasetsList[this.state.selecteddataset].name+"/"+this.state.selectedsimimage+".jpg";return l.a.createElement("div",null,this.state.showorientationmodal&&l.a.createElement(p.a,{className:"orientationmodal",open:!0,size:"lg",passiveModal:!1,primaryButtonText:"Get Started",modalHeading:"Semantic Search",modalLabel:"How this demo works",onRequestSubmit:this.toggleSemanticModal.bind(this),ref:function(t){return e.orientationModal=t},onRequestClose:this.toggleSemanticModal.bind(this)},l.a.createElement(k,null)),l.a.createElement("div",{className:"pb10 "},l.a.createElement("div",{className:"iblock pb10 sectiontitle"},"What is Semantic Search?"),l.a.createElement("div",{onClick:this.toggleSemanticModal.bind(this),className:"iblock  floatright  clickable showmodal"}," ? More Info  ")),l.a.createElement("div",{className:"horrule"}),l.a.createElement("div",{className:"flex mt10"},l.a.createElement("div",{className:"flex5 mr10 mynotif lightbluehightlight p20"},l.a.createElement("div",{className:"boldtext mb10"}," Semantic Search"),l.a.createElement("div",{className:"lh10"},'Layers in a trained convolutional neural network (CNN) can be used to extract features from images.\n        Semantic search explores the use these extracted features in computing the "similarity" between images.  ')),l.a.createElement("div",{className:"flex5  mynotif lightbluehightlight p20"},l.a.createElement("div",{className:"boldtext mb10"}," Model architectures and Layers"),l.a.createElement("div",{className:"lh10"},"How do features extracted using different model architectures compare? What layers perform better and when?\n        What similarity distance metrics work best? This demo helps you investigate these questions!"))),l.a.createElement("div",{className:"flex flexwrap"},l.a.createElement("div",{className:"flex2 mr10"},l.a.createElement("div",{className:"mt20 pb10 sectiontitle"}," Select Dataset "),l.a.createElement("div",{className:"horrule mb10"}),l.a.createElement("div",{className:"datasetselectdiv"},t),l.a.createElement("div",{className:" iblock boldtext  iblock boldtext datasetdescription  p10 lightbluehightlight"},this.state.datasetsList[this.state.selecteddataset].name.toUpperCase())),l.a.createElement("div",{className:"flex3 mr10"},l.a.createElement("div",{className:"mt20 pb10 sectiontitle"}," Select Model "),l.a.createElement("div",{className:"horrule mb10"}),l.a.createElement("div",{className:"datasetselectdiv"},n),l.a.createElement("div",{className:" iblock boldtext datasetdescription  p10 lightbluehightlight"},this.state.modelsList[this.state.selectedmodel].name.toUpperCase())),l.a.createElement("div",{className:"flex3"},l.a.createElement("div",{className:"mt20 pb10 sectiontitle"}," Select Layer "),l.a.createElement("div",{className:"horrule mb10"}),l.a.createElement("div",{className:"scrollwindow  "},l.a.createElement("div",{className:"windowcontent"}," ",s," ")),l.a.createElement("div",{className:"flex flexwrap "},l.a.createElement("div",{className:"flex1  mr10 "},l.a.createElement("div",{className:" iblock boldtext datasetdescription  p10 lightbluehightlight"}," ",this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase())),l.a.createElement("div",{className:"flex9 "},l.a.createElement("div",{className:"smalldesc boldtext pt4"}," Layer [ ",this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index,"  of ",this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].totallayers,"  ] ",this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].type," "),l.a.createElement("div",{className:"smalldesc pt3"}," ",j(this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].paremtercount)," trainable parameters ")))),l.a.createElement("div",{className:"flex2"},l.a.createElement("div",{className:"mt20 pb10 sectiontitle"}," Distance Metric "),l.a.createElement("div",{className:"horrule mb10"}),l.a.createElement("div",{className:"scrollwindow  "},l.a.createElement("div",{className:"windowcontent"}," ",i," ")),l.a.createElement("div",{className:" iblock boldtext datasetdescription  p10 lightbluehightlight"}," ",this.state.distanceMetricList[this.state.selectedmetric].toUpperCase()))),l.a.createElement("div",{className:"mt20 mb10 "},l.a.createElement("div",{className:"sectiontitle iblock mr10"}," Similarity search "),l.a.createElement("div",{className:"iblock"}," Select and image.")),l.a.createElement("div",{className:"horrule mb10"}),l.a.createElement("div",{className:"flex"},l.a.createElement("div",{className:"iblock  flex1 mr10"},l.a.createElement("img",{src:o,className:"mainsimilarityimage rad4  iblock",alt:""}),l.a.createElement("div",{className:" mt10  boldtext datasetdescription  p10 lightbluehightlight"}," SEARCH IMAGE ")),l.a.createElement("div",{className:" flexfull"},l.a.createElement("div",{className:"mb10 mainsimilaritydesc lightbluehightlight p10"},"Based on features extracted using ",l.a.createElement("span",{className:"boldtext"}," ",this.state.modelsList[this.state.selectedmodel].name.toUpperCase()," "),", layer ",l.a.createElement("span",{className:"boldtext"}," ",this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()," "),"and  ",l.a.createElement("span",{className:" boldtext"}," COSINE ")," distance metric, the  images below are ranked from most similar to least similar."),l.a.createElement("div",null,r))),l.a.createElement("br",null),l.a.createElement("br",null),l.a.createElement("br",null))}}]),t}(n.Component),_=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(c.a)(this,Object(m.a)(t).call(this,e))).state={},a.pageIntro=" Convolutional Neural Network models are comprised of layers which learn heirarchical \n        representations. What kind of representations or features does each layer learn? \n        Well, let us explore the following models. ",a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){document.title="ConvNet Playground | Model Explorer"}},{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement("div",{className:"pb10 sectiontitle"}," Model Explorer "),l.a.createElement("div",{className:"horrule"}),l.a.createElement("div",{className:"flex mt10"},l.a.createElement("div",{className:"flex5 mr10 mynotif lightbluehightlight p20"},l.a.createElement("div",{className:"boldtext mb10"}," Model Interpretability"),l.a.createElement("div",{className:"lh10"},'Layers in a trained convolutional neural network (CNN) can be used to extract features from images.\n        Semantic search explores the use these extracted features in computing the "similarity" between images.  ')),l.a.createElement("div",{className:"flex5  mynotif lightbluehightlight p20"},l.a.createElement("div",{className:"boldtext mb10"}," Optimization-based Feature Visualization"),l.a.createElement("div",{className:"lh10"},'How can we "peek" into a CNN and get an idea of what each neuron in a layer has learned to visualize?\n        One way to accomplish this is the use of optimization approaches to feature visualizations. Within this approach,\n        we begin with random noise and update it (based on gradients) to maximally excite each neuron. \n        We use the lucid library to accomplish this and results are shown for a few models below.\n        '))))}}]),t}(n.Component),O=a(101),M=(a(95),function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(c.a)(this,Object(m.a)(t).call(this,e))).datasetslist=[{name:"CIFAR100x",css:"active",index:[0]},{name:"ICONIC3K",css:""},{name:"IMAGENET3K",css:""}],a.state={selecteddataset:a.datasetslist[0]},a.algebraIntro=' With Image Algebra, we take advantage of complex meaningful representations that \n        can be learned with ConvNets and use them as variables in simple and interesting algebra operations.\n        If we "subtract" the representation of the horizon with trees from the representation of just trees ..\n        is the resulting representation most similar to that of plain horizon? Well, lets find out.',a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){document.title="ConvNet Playground | Image Algebra"}},{key:"clickDatasetImage",value:function(){alert("click here")}},{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement("div",{className:"pb10 sectiontitle"}," Image Algebra"),l.a.createElement("div",{className:"horrule"}),l.a.createElement(O.a,{title:"Image Algebra",kind:"info",subtitle:this.algebraIntro,style:{minWidth:"100%",marginBottom:".5rem"}}))}}]),t}(n.Component)),L=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(c.a)(this,Object(m.a)(t).call(this,e))).state={showorientationmodal:!0},a}return Object(d.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){}},{key:"toggleOrientationModal",value:function(e){this.setState({showorientationmodal:!this.state.showorientationmodal})}},{key:"render",value:function(){var e=this;return l.a.createElement(u.a,null,l.a.createElement(N,null),this.state.showorientationmodal&&l.a.createElement(p.a,{className:"orientationmodal",open:!0,size:"lg",passiveModal:!1,primaryButtonText:"Get Started",modalHeading:"Convnet Playground",modalLabel:"Welcome!",onRequestSubmit:this.toggleOrientationModal.bind(this),ref:function(t){return e.orientationModal=t},onRequestClose:this.toggleOrientationModal.bind(this)},l.a.createElement(b,null)),l.a.createElement("div",{className:"container-fluid p10"},l.a.createElement(h.a,{exact:!0,path:"/",component:S}),l.a.createElement(h.a,{exact:!0,path:"/datasets",component:S}),l.a.createElement(h.a,{exact:!0,path:"/models",component:_}),l.a.createElement(h.a,{exact:!0,path:"/algebra",component:M})),l.a.createElement("div",{id:"footer"}," ",l.a.createElement(x,null)," "))}}]),t}(n.Component),I=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function D(e,t){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var a=e.installing;null!=a&&(a.onstatechange=function(){"installed"===a.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}}).catch(function(e){console.error("Error during service worker registration:",e)})}a(96);i.a.render(l.a.createElement(L,null),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/convnetplayground",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",function(){var t="".concat("/convnetplayground","/service-worker.js");I?(function(e,t){fetch(e).then(function(a){var n=a.headers.get("content-type");404===a.status||null!=n&&-1===n.indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):D(e,t)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(t,e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")})):D(t,e)})}}()}},[[48,1,2]]]);
//# sourceMappingURL=main.b91f33ae.chunk.js.map
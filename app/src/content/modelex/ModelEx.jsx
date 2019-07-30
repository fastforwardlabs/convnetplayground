import React, { Component } from "react";
import { DataTable, Modal, Tooltip } from 'carbon-components-react';
import ModelsModalContent from "../../components/modals/ModelsModal"
import {registerGAEvent, greyColor, blueColor, abbreviateString, makeFriendly, checkInView, animOptions, LeaderLine } from "../../components/helperfunctions/HelperFunctions"
import "./modelex.css"

const {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
} = DataTable


const headers = [
    { key: 'layer_index', header: '', },
    { key: 'name', header: 'Layer', },
    { key: 'type', header: 'Type', },
    { key: 'numneurons', header: 'Channels', },
    { key: 'parametercount', header: 'Parameters', },
];
class ModelEx extends Component {


    constructor(props) {
        super(props);

        const modelDetailsViz = require('../../assets/models/models.json');
        const modelDetails = require('../../assets/models/model_details.json');

        let nList = []
        const {model, layer} = {
            model: modelDetails["models"][0].name ,
            layer: modelDetails["models"][0].layers[0].name ,
        }
        let currentLayers = modelDetailsViz[model]
        let neuronList = currentLayers[layer] 

        this.state = {
            selectedmodel: 0,
            selectedlayer: 0,
            selectedneuron: 0,
            modelsList: modelDetails["models"],
            layersList: modelDetailsViz[modelDetails["models"][0].name],
            neuronList: neuronList,
            showmodelorientationmodal: !this.props.pageviewed,
            showmoremodelinfomodal: false,
            showneuronsubset: true,
            numneuronsshow: 30,

        }

        this.layerList = modelDetailsViz
        this.pageIntro = ` Convolutional Neural Network models are comprised of layers which learn heirarchical 
        representations. What kind of representations or features does each layer learn? 
        Well, let us explore the following models. `
        // this.allLayerDetails = modelDetails["all_layers"]
        this.lastclicked = "model"

        this.keyFunction = this.keyFunction.bind(this);
        this.scrollEndedHandler = this.scrollEndedHandler.bind(this)
        this.lineHolder = []
    }

    drawLines(e) {
        this.removeLines()
        let self = this;
        let layers = this.state.modelsList[this.state.selectedmodel].layers
        let containerOffset = -60
        let elementOffset = -1 * self.refs["modelscrollbox"].offsetTop - 30
        // console.log("offsettop", self.refs["modelscrollbox"].offsetTop)
        let modelVisible = checkInView(self.refs["modelscrollbox"], self.refs["modelimg" + this.state.selectedmodel], true, containerOffset, elementOffset)

        let maxLineWidth = 3.5
        let minLineWidth = 1.5
        let incs = (maxLineWidth - minLineWidth) / layers.length

        layers.forEach(function (each, i) {

            let layerVisible = checkInView(self.refs["layerscrollbox"], self.refs["layerimg" + i], true, containerOffset, elementOffset)
            if (layerVisible && modelVisible) {
                // console.log("we drawing to", i) 

                let line = new LeaderLine(self.refs["modelimg" + self.state.selectedmodel], self.refs["layerimg" + i], {
                    color: self.state.selectedlayer == (i + "") ? blueColor : greyColor,
                    startPlug: 'disc',
                    endPlug: 'disc',
                    startPlugColor: blueColor,
                    path: "fluid",
                    size: Math.min(minLineWidth + i * incs, maxLineWidth),
                    hide: true,
                    startSocket: 'bottom',
                    endSocket: self.state.selectedlayer == i ? "top" : 'left',
                    endPlugSize: maxLineWidth / Math.min(minLineWidth + i * incs, maxLineWidth),

                });
                document.querySelector('.leader-line').style.zIndex = -100
                // animOptions.duration = self.state.selectedlayer == (i + "") ? 800 : 200;
                line.show("draw", animOptions)
                self.lineHolder.push({ line: line, index: i })
            }
        })

    }
    removeLines(e) {
        this.lineHolder.forEach(function (each) {
            each.line.remove()
        })
        this.lineHolder = []
    }
    recolorLines(e) {
        let self = this
        if (this.LayerScrollTop != this.refs["layerscrollbox"].scrollTop) {
            this.LayerScrollTop = this.refs["layerscrollbox"].scrollTop
            this.drawLines()
        } else {
            this.lineHolder.forEach(function (each) {
                if (each.index == self.state.selectedlayer) {
                    each.line.hide("none")
                    each.line.color = blueColor
                    // animOptions.duration = self.state.selectedlayer == each.index ? 800 : 200;
                    each.line.show("draw", animOptions)
                    each.line.endSocket = "top"
                } else {
                    each.line.color = greyColor
                    each.line.endSocket = "left"
                }
            })
        }
    }



    getNextVal(newVal, maxVal) {
        if (newVal >= 0) {
            return newVal % maxVal
        } else {
            return (maxVal - Math.abs(newVal))
        }

    }
    cycleLayerModel(val) {
        if (this.lastclicked == "model") {
            let newState = this.getNextVal((this.state.selectedmodel * 1 + val), this.state.modelsList.length);// Math.max((this.state.selectedmodel*1 + val) % this.state.modelsList.length, 0) 
             
            if (!(isNaN(newState))) {
               this.updateModelState(newState)
            }

        } else if (this.lastclicked == "layer") {
            let newState = this.getNextVal((this.state.selectedlayer * 1 + val), this.state.modelsList[this.state.selectedmodel].layers.length)
            if (!(isNaN(newState))) {
                this.updateLayerState(newState)
            }

        } else if (this.lastclicked == "neuron") {

            let numNeurons = (this.layerList[this.state.modelsList[this.state.selectedmodel].name][this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name].length)
            let newState = this.getNextVal((this.state.selectedneuron * 1 + val), numNeurons)
            // console.log(this.state.selectedneuron,newState,  val, numNeurons)
            if (!(isNaN(newState))) {
                this.setState({ selectedneuron: newState })
            }

        }
    }

    keyFunction(event) {
        if (event.keyCode === 37) {
            this.cycleLayerModel(-1)
        }
        else if (event.keyCode === 39) {
            this.cycleLayerModel(1)
        }

    }

    componentDidMount() { 
        let self = this
        document.title = "ConvNet Playground | Model Explorer";

        // this.setState({showmodelorientationmodal:!this.props.pageviewed})

        // Load query string parameters if available

        const queryString = require('query-string');  
        if (this.props.location.includes("channel")) {

            // hide orientation model
            this.setState({showmodelorientationmodal: false})
            const { model, layer, channel } = queryString.parse(this.props.location);
            console.log("query string", model, layer, channel, self.state.modelsList.length)
            
            // this.state.modelsList.forEach((each, i) => {
            for (let i = 0; i < self.state.modelsList.length; i++) { 
                let each = self.state.modelsList[i]
               
                
                if (each.name == model) {
                    
                    self.setState({ selectedmodel: i }, () => {
                        self.state.modelsList[i].layers.forEach((each,j) => { 
                            if (each.name == layer) {
                                self.setState({ selectedlayer: j }, () => {
                                    console.log(self.getNeuronList())
                                    let nlist = self.getNeuronList()
                                    nlist.forEach((each, k) => { 
                                        if (each == channel) {
                                            self.setState({selectedneuron: k})
                                        }
                                    });
                                });
                            }
                        });
                        
                    }); 
                   
                    break;
                } 
            };
        }
      


        document.addEventListener("keydown", this.keyFunction, false);
        this.drawLines()
        this.LayerScrollTop = 0
        window.addEventListener('resize', this.scrollEndedHandler)

        this.refs["layerscrollbox"].addEventListener("scroll", this.scrollEndedHandler, false)
        this.refs["modelscrollbox"].addEventListener("scroll", this.scrollEndedHandler, false)

        //timer on when component mounted
        this.componentLoadedTime = (new Date()).getTime()
    }

    updateNeuronList() { 
       
        this.setState({ neuronList: this.getNeuronList() })
        // console.log("updateNeuronList called")
    }

    getNeuronList() {
        const {model, layer} = this.getSelections(); 
        let currentLayers = this.layerList[model]
        let neuronList = currentLayers[layer] 
        // console.log(neuronList)
        return neuronList
    }

    getSelections() {
       
        return {
            model: this.state.modelsList[this.state.selectedmodel].name ,
            layer: this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name ,
        };
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyFunction, false);
        window.removeEventListener('resize', this.scrollEndedHandler)
        this.removeLines();

        this.refs["layerscrollbox"].removeEventListener("scroll", this.scrollEndedHandler, false)
        this.refs["modelscrollbox"].removeEventListener("scroll", this.scrollEndedHandler, false)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.selectedmodel !== prevState.selectedmodel) {
            this.drawLines()
           
            
        }
        if (this.state.selectedlayer !== prevState.selectedlayer) {
            this.recolorLines() 
        }
 
    }

    updateModelState(val) { 
            this.setState({ selectedlayer: 0 }, () => {
                this.setState({ selectedmodel: val }, () => { 
                    this.updateNeuronList() 
                })
                
           }) 
          
    }

    updateLayerState(val) {
        this.setState({ selectedlayer: val }, () => {
            this.updateNeuronList() 
        })
        this.setState({ selectedneuron: 0 }, () => {
           
        })
    }

    clickModelImage(e) {
        registerGAEvent("modelexplorer","modelchange", this.state.modelsList[e.target.getAttribute("indexvalue")].name, this.componentLoadedTime)
        this.updateModelState(e.target.getAttribute("indexvalue") )
        this.lastclicked = "model"
    }

    clickLayerImage(e) {
        this.updateLayerState(e.target.getAttribute("indexvalue"))
        this.lastclicked = "layer"
    }


    clickNeuronImage(e) {
        const {model, layer} = this.getSelections(); 
        registerGAEvent("modelexplorer","channelselect", model + "," + layer + "," + e.target.getAttribute("indexvalue") , this.componentLoadedTime)
        // this.setState({selectedneuronpath: e.target.getAttribute("pathinfo")  })
        this.setState({ selectedneuron: e.target.getAttribute("indexvalue") })
        this.lastclicked = "neuron"

    }


    toggleModelMoreInfoModal(e) {
        this.setState({ showmoremodelinfomodal: !(this.state.showmoremodelinfomodal) })
    }

    toggleViewNeuronSubset(e) {
       
        this.setState({ showneuronsubset: !(this.state.showneuronsubset) })
    }

    toggleModelsModal(e) {
        e.preventDefault()
        registerGAEvent("modelexplorer","modelmodal", this.state.showmodelorientationmodal ? "close" : "open", this.componentLoadedTime)
        this.setState({ showmodelorientationmodal: !(this.state.showmodelorientationmodal) })
        // console.log(this.state.showmodelorientationmodal) 
    }

    kepressLayer(e) {
        console.log(e.keyCode)
    }

    scrollEndedHandler() {
        window.clearTimeout(this.isScrolling);
        let self = this
        this.isScrolling = setTimeout(function () {
            self.drawLines()
        }, 200);
    }



    twitterShare(e) {
        e.preventDefault();

        let neuron = this.layerList[this.state.modelsList[this.state.selectedmodel].name][this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name][this.state.selectedneuron];
        let modelname = this.state.modelsList[this.state.selectedmodel].name
        let layer = this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name
        let fflurl = "http://convnetplayground.fastforwardlabs.com/#/models?model=" + modelname + "&layer=" + layer + "&channel=" + neuron
        let url = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(fflurl) + "&via=" + "fastforwardlabs" + "&text=" + encodeURIComponent("A visualization of channel " + neuron + " in the " + layer + " layer  of a " + modelname + " model. View more visualizationss of CNNs and an interactive visualization of semantic image search in the #convnetplayground prototype.");

        window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600')
    }

    render() {
        // let modelInterpretabilityIntro = `Interpretable models are models we can "understand". 
        // Interpretability explores approaches to better understand neural networks. For example, 
        // how can we "peek" into a CNN to get an idea of what each neuron in a layer has learned to detect? `    

        // let optimizationVisualization = `  
        // Within this approach to visualizing layers and neurons,
        // we begin with random noise and update it (based on gradients) to maximally excite each neuron. 
        // The  <a href="https://github.com/tensorflow/lucid/tree/master/lucid" target="_blank">Lucid</a> library is used to generate visualizations for layers in the models below.
        // `

        let modelImageList = this.state.modelsList.map((mdata, index) => {
            let selectedModel = this.state.modelsList[index].name
            let selectedlayer = this.state.modelsList[index].layers[this.state.modelsList[index].layers.length - 1].name

            let imagePath = process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/0.jpg"
            // console.log(imagePath)
            return (

                <div ref={"modelimgbox" + index} key={mdata.name + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {abbreviateString(mdata.name.toUpperCase(), 10)}</div>
                    <div className="smalldesc pb5">{makeFriendly(mdata["modelparameters"])} params. </div>

                    <img ref={"modelimg" + index} onClick={this.clickModelImage.bind(this)} src={imagePath} alt="" className={"datasetbox rad2 " + (this.state.selectedmodel == index ? "active" : "")} indexvalue={index} />
                </div>
            )
        });

        let selectedModel = this.state.modelsList[this.state.selectedmodel].name 
        let selectedlayer = this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name
         
        let layerImageList = this.state.modelsList[this.state.selectedmodel].layers.map((ldata, index) => {
            let selectedModel = this.state.modelsList[this.state.selectedmodel].name
            let selectedlayer = this.state.modelsList[this.state.selectedmodel].layers[index].name
            let neuronList = this.layerList[selectedModel][selectedlayer]
            let imagePath = process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/" + neuronList[neuronList.length - 1] + ".jpg";

            return (
                <div key={ldata + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {"layer " + ldata.layer_index} </div>
                    <div className="smalldesc pb5"> {abbreviateString(ldata.name, 11).toLowerCase()} </div>
                    <img ref={"layerimg" + index} onKeyPress={this.kepressLayer.bind(this)} onClick={this.clickLayerImage.bind(this)} src={imagePath} alt="" className={"datasetbox rad2 " + (this.state.selectedlayer == index ? "active" : "")} indexvalue={index} />
                </div>
            )
        });
      

        // this.state.neuronList = neuronList
        // this.setState({neuronList: neuronList })
        // console.log(this.state.neuronList)
        let neuronImageList = this.state.neuronList.map((ldata, index) => {
            let imagePath = process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/" + ldata + ".jpg"
          
            return (
                <div key={ldata + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> Channel {ldata}</div>
                    <img onClick={this.clickNeuronImage.bind(this)} src={imagePath} alt="" className={"neuronbox rad2 " + (this.state.selectedneuron == index ? "active" : "")} indexvalue={index} pathinfo={imagePath} neuronindex={ldata} />
                </div>
            )
        }); 


        // console.log(this.state.modelsList[this.state.selectedmodel].all_layers)

        return (

            <div>
                { <Modal className="orientationmodal"
                    open={ this.state.showmodelorientationmodal? true : false}
                    size="lg"
                    aria-label="Model Modal"
                    // style={{maxWidth: '1600px', width: '100%'}}
                    passiveModal={false}
                    primaryButtonText="Get Started"
                    // secondaryButtonText="Close"
                    modalHeading="Model Explorer"
                    modalLabel="ConvNet Playground"
                    onRequestSubmit={this.toggleModelsModal.bind(this)}
                    onRequestClose={this.toggleModelsModal.bind(this)}
                >
                    {this.state.showmodelorientationmodal && <ModelsModalContent></ModelsModalContent>}

                </Modal>}

                {(this.state.showmoremodelinfomodal) && <Modal className="orientationmodal"
                    open={this.state.showmoremodelinfomodal?true:false}
                    size="lg"
                    // style={{maxWidth: '1600px', width: '100%'}}
                    passiveModal={true}
                    primaryButtonText="Get Started"
                    // secondaryButtonText = "Do not show this again"
                    modalHeading={this.state.modelsList[this.state.selectedmodel].name.toUpperCase()}
                    // modalLabel= "How this demo works"
                    onRequestSubmit={this.toggleModelMoreInfoModal.bind(this)}
                    onRequestClose={this.toggleModelMoreInfoModal.bind(this)}
                >
                    {this.state.showmoremodelinfomodal && <div>
                        <DataTable
                            rows={this.state.modelsList[this.state.selectedmodel].all_layers}
                            headers={headers}
                            render={({ rows, headers, getHeaderProps }) => (
                                <TableContainer className="boldtext" title={"List of layers in  " + this.state.modelsList[this.state.selectedmodel].name.toUpperCase() + " Model"} >
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {headers.map(header => (
                                                    <TableHeader {...getHeaderProps({ header })}>
                                                        {header.header}
                                                    </TableHeader>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map(row => (
                                                <TableRow key={row.id}>
                                                    {row.cells.map(cell => (
                                                        <TableCell key={cell.id}>{cell.value}</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        />
                    </div>}

                </Modal>}



                <div className=" flex  ">
                    <div className="iblock sectiontitle flexfull   pt4 ">Model Explorer</div>
                    <div className="flex5  ">
                        <div onClick={this.toggleModelsModal.bind(this)} className="iblock floatright  clickable showmore"> ? More Info  </div>
                    </div>
                </div>
                {/* <div className="horrule"></div> */}
                {/* <InlineNotification
                    title={"Image Algebra"} 
                    kind={"info"} 
                    subtitle={this.pageIntro}
                    style={{ minWidth: '100%', marginBottom: '.5rem' }}
                /> */}

                <div className="flex">
                <div className="flex5 mr10 mynotif lh10 instructions lightbluehightlight maxh16">
                    <div className="boldtext pb5 advancedoptionsbox"> Optimization Based Feature Visualization </div>
                    This demo allows you to explore visualizations of patterns learned by channels (groups of neurons) in each layer of a Convolutional Neural Network (pretrained on <strong> imagenet</strong>).
                    
                    To begin, <strong> click </strong>  on a model, and a layer to view visualizations of selected channels in that layer.
    
                </div>
                    
                <div className="flex5 mynotif lh10 instructions lightbluehightlight maxh16">
                        <div className="boldtext pb5 advancedoptionsbox"> What do these images mean? </div>
                    
                These images/visualizations represent an <span className="italics">example</span> of what the given neurons in the pretrained model have  <span className="italics"> learned to look for </span>.
                They are <span className="italics"> generated </span> using 
                an iterative <a href="https://distill.pub/2017/feature-visualization/" target="_blank" rel="noopener noreferrer"> optimization</a> process which synthesizes input that causes 
                        the neurons to have high
                activation.  <a onClick={this.toggleModelsModal.bind(this)} href="">Learn more.</a>
                       
                </div>
                    
               </div>

                {/* <div className="flex mt10">
                    <div className="flex5 mr10 mynotif lightbluehightlight p20">
                        <div className="boldtext mb10"> Interpretability via Visualizations</div>
                        <div className="lh10 maxh16">{modelInterpretabilityIntro}</div>
                    </div>
                    <div className="flex5  mynotif lightbluehightlight p20">
                        <div className="boldtext mb10"> Optimization-based Feature Visualization</div>
                        <div className="lh10 maxh16">
                        Within this approach to visualizing layers and neurons,
                        we begin with random noise and update it (based on gradients) to maximally excite each neuron. 
                        The  <a href="https://github.com/tensorflow/lucid/tree/master/lucid" target="_blank">Lucid</a> library is used to generate visualizations for layers in the models below.
                        `
                        </div>
                    </div>

                </div> */}

                <div style={{ zIndex: 100 }} className="flex flexwrap ">
                    <div style={{ zIndex: 500 }} className="flex4 mr10">
                        <div className="mt20 pb10 sectiontitle" > Select Model </div>
                        <div className="horrule mb10"></div>
                        <div ref="modelscrollbox" className="scrollwindow  scrollwindowmodel">
                            {modelImageList}
                        </div>

                        <div>
                            <div className=" iblock  boldtext datasetdescription mr10 p10 greyhighlight">{this.state.modelsList[this.state.selectedmodel].name.toUpperCase()}</div>
                            <div onClick={this.toggleModelMoreInfoModal.bind(this)} className="iblock p10  greyhighlight unselectable greymoreinfo clickable"> ? More Info</div>
                        </div>

                    </div>


                    <div style={{ zIndex: 100 }} className="flex6 mr10">
                        <div className="mt20 pb10 sectiontitle" > Select Layer </div>
                        <div className="horrule mb10"></div>
                        <div ref="layerscrollbox" className="scrollwindow layerwindow  ">
                            <div className="windowcontent"> {layerImageList} </div>
                        </div>
                        <div className="flex flexwrap pr10">
                            <div className="  mr10 ">
                                {/* <div className=" iblock boldtext datasetdescription  p10 greyhighlight"> {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()}</div> */}
                                <div className=" iblock boldtext datasetdescription  p10 greyhighlight">{" LAYER " + this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index}</div>
                            </div>
                            <div className="flexfull ">
                                {/* <div className="smalldesc boldtext pt4"> Layer [ {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index}  of {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].totallayers}  ] {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].type} </div> */}
                                <div className="smalldesc pt4"> <strong>Type: {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].type} </strong> | <span className="smalldesc"> {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()}</span> </div>
                                <div className="smalldesc pt3"> {makeFriendly(this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].parametercount)} trainable parameters, {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].numneurons} channels </div>
                            </div>
                        </div>

                    </div>

                    <div style={{ zIndex: 100 }} className="">
                        <div className="mt20 pb8 sectiontitle" >

                            <div className="iblock">
                                Channel Vizualization
                            </div>

                            <div className="iblock">
                                <Tooltip
                                    direction="left"
                                    triggerText=""
                                >

                                    <div className="wscore">
                                        This is an example of an image that "maximally excites" neurons in
                                    channel <strong> {this.layerList[this.state.modelsList[this.state.selectedmodel].name][this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name][this.state.selectedneuron]}</strong> of layer <strong>{this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index}</strong>  in the <strong>  {this.state.modelsList[this.state.selectedmodel].name} </strong>  model.
                                    Learn more about how this is generated <a className="whitetext" href="https://distill.pub/2017/feature-visualization/" target="_blank" rel="noopener noreferrer"> here</a>.
                                </div>

                                </Tooltip>
                            </div>

                        </div>
                        <div className="horrule mb10"></div>
                        <div className="  ">
                            <img className="enlargedneuron rad4" src={process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/" + this.layerList[this.state.modelsList[this.state.selectedmodel].name][this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name][this.state.selectedneuron] + ".jpg"} alt="" />
                        </div>
                        <div className="flex flexwrap pr10">
                            <div className=" mt10  mr10 ">
                                {/* <div className=" iblock boldtext datasetdescription  p10 greyhighlight"> {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()}</div> */}
                                <div className=" iblock boldtext datasetdescription  p10 greyhighlight"> Channel : {this.layerList[this.state.modelsList[this.state.selectedmodel].name][this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name][this.state.selectedneuron]}  </div>
                            </div>
                            <div className="flexfull mt5 ">
                                <div className="smalldesc viewchanneldesc  iblock pt4"> View  <strong> {neuronImageList.length} </strong>  more channels from  layer  <strong>  {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index} </strong> below </div>
                                {/* <div className="smalldesc boldtext pt4"> {abbreviateString(this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase(), 26)}: {this.layerList[this.state.modelsList[this.state.selectedmodel].name][this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name][this.state.selectedneuron]} / {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].numneurons} </div> */}
                                {/* <div className="smalldesc pt4"> <strong>Type: {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].type} </strong> | <span className="smalldesc"> {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()}</span> </div> */}
                                {/* <div className="smalldesc pt3"> {makeFriendly(this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].parametercount)} trainable parameters, {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].numneurons} channels </div> */}
                            </div>
                        </div>

                    </div>


                </div>


                <div className="mt20 mb10 ">
                    <div onClick={this.toggleViewNeuronSubset.bind(this)} className={"p10 greytab greyhighlight clickable unselectable greymoreinfo iblock mr5 " + (this.state.showneuronsubset  ? "active" : "")} viewby="all"> Top {Math.min(neuronImageList.length, this.state.numneuronsshow)} Channels </div>
                    <div onClick={this.toggleViewNeuronSubset.bind(this)} className={"p10 greytab greyhighlight clickable unselectable greymoreinfo iblock mr10 " + (!this.state.showneuronsubset ? "active" : "")} viewby="category">  All Channels ({neuronImageList.length}) </div>
                        
                    <div className="sectiontitle iblock mr10 mt20"> Visualizations  of {this.state.showneuronsubset ? Math.min(this.state.numneuronsshow, neuronImageList.length) : neuronImageList.length} Channels  in layer {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index} of {this.state.modelsList[this.state.selectedmodel].name.toUpperCase()} </div>
                    {/* <div className="iblock"> A selection of channels in the current layer.</div> */}
                </div>

                <div className="horrule mb10"></div>

                <div className="flex flexwrap">
                    <div className="flex1  ">
                        <div className="enlargeddiv rad2 mr10">
                            {/* let selectedModel = this.state.modelsList[this.state.selectedmodel].name
        let currentLayers = this.layerList[selectedModel] 
        let selectedlayer = this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name
        let neuronList = currentLayers[selectedlayer] */}



                            <div onClick={this.twitterShare.bind(this)} className="mb10" > <div className="twitterbutton unselectable p10 clickable  flex greymoreinfo" href=""> Share on Twitter </div> </div>
                            <div className="boldtext enlargeddesc mb5  smalldesc">{abbreviateString(this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase(), 26)}: {this.layerList[this.state.modelsList[this.state.selectedmodel].name][this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name][this.state.selectedneuron]} / {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].numneurons} </div>
                            <img className="enlargedneuron rad4" src={process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/" + this.layerList[this.state.modelsList[this.state.selectedmodel].name][this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name][this.state.selectedneuron] + ".jpg"} alt="" />

                        </div>
                    </div>
                    <div className="flexfull ">

                        <div className=" scrollwindow neurondivbox ">
                            {this.state.showneuronsubset && neuronImageList.slice(0, Math.min(neuronImageList.length, this.state.numneuronsshow))}
                            {!this.state.showneuronsubset && neuronImageList }
                        </div>
                    </div>

                </div>




                <br />
                <br />
                <br />
            </div >
        );
    }
}

export default ModelEx;
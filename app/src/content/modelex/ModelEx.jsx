import React, { Component } from "react";
import { DataTable, Modal } from 'carbon-components-react';
import ModelsModalContent from "../../components/modals/ModelsModal"
import {abbreviateString, makeFriendly} from "../../components/helperfunctions/HelperFunctions"
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
    {key: 'layer_index',header: '',},
    {key: 'name',header: 'Layer',},
    {key: 'type',header: 'Type',},
    {key: 'numneurons',header: 'Channels',},
    {key: 'parametercount', header: 'Parameters',},
  ]; 
class ModelEx extends Component {


    constructor(props) {
        super(props);

        const modelDetailsViz = require('../../assets/models/models.json'); 
        const modelDetails = require('../../assets/models/model_details.json');
       
        let nList = []

        // console.log( modelDetails)

                    
        this.state = {
            selectedmodel: 0, 
            selectedlayer: 0,
            selectedneuron:0, 
            modelsList: modelDetails["models"],
            layersList: modelDetailsViz[modelDetails["models"][0].name],
            neuronList: nList,
            showmodelorientationmodal: false,
            showmoremodelinfomodal: false,

        }

        this.layerList = modelDetailsViz
        this.pageIntro = ` Convolutional Neural Network models are comprised of layers which learn heirarchical 
        representations. What kind of representations or features does each layer learn? 
        Well, let us explore the following models. ` 
        // this.allLayerDetails = modelDetails["all_layers"]
        this.lastclicked = "model"

        this.keyFunction = this.keyFunction.bind(this);
    }

    cycleLayerModel(val){
        if (this.lastclicked == "model"){
            let newState = Math.max((this.state.selectedmodel*1 + val) % this.state.modelsList.length, 0) 
            // console.log(newState, this.state.modelsList.length, this.state.selectedmodel, val)
            if (!(isNaN(newState))) {
                this.setState({selectedmodel: newState})
            }
  
        }else if (this.lastclicked == "layer"){
            let newState = Math.max((this.state.selectedlayer*1 + val) % this.state.modelsList[this.state.selectedmodel].layers.length, 0) 
            // console.log(newState, this.state.modelsList.length, this.state.selectedmodel, val)
            if (!(isNaN(newState))) {
                this.setState({selectedlayer: newState})
            }
  
        }else if (this.lastclicked == "neuron"){
            
            let numNeurons = (this.layerList[this.state.modelsList[this.state.selectedmodel].name][this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name].length)
            let newState = Math.max((this.state.selectedneuron*1 + val) % numNeurons, 0) 
            // console.log(this.state.selectedneuron,newState,  val, numNeurons)
            if (!(isNaN(newState))) {
                this.setState({selectedneuron: newState})
            }
  
        }
    }

    keyFunction(event){ 
        if(event.keyCode === 37) {
          this.cycleLayerModel(-1)
        }
        else if (event.keyCode === 39) {
            this.cycleLayerModel(1)
        }
        
    }

    componentDidMount() {
        document.title = "ConvNet Playground | Model Explorer"; 
        // const queryString = require('query-string'); 
        // const qs = queryString.parse(this.props.location.search);
        // this.sets
        document.addEventListener("keydown", this.keyFunction, false);
    }

    componentDidUpdate(prevProps, prevState) {
        // if ( this.state.selectedmodel !== prevState.selectedmodel ) {
        //     console.log("model updated")
        // }

        // if (this.state.selectedlayer !== prevState.selectedlayer ) {
        //     console.log("layer updated")
        // }
    }

    clickModelImage(e) {
        this.setState({ selectedmodel: e.target.getAttribute("indexvalue") }) 
        this.setState({ selectedlayer: 0 }) 
        this.lastclicked = "model"
    }

    clickLayerImage(e) {
        this.setState({ selectedlayer: e.target.getAttribute("indexvalue") }) 
        this.setState({ selectedneuron: 0 }) 
        this.lastclicked = "layer"
    }

    
    clickNeuronImage(e) {
       
        // this.setState({selectedneuronpath: e.target.getAttribute("pathinfo")  })
        this.setState({ selectedneuron: e.target.getAttribute("indexvalue") }) 
        this.lastclicked = "neuron"

    }


    toggleModelMoreInfoModal(e){
        this.setState({showmoremodelinfomodal: !(this.state.showmoremodelinfomodal)})
    }

    toggleModelsModal(e){
        this.setState({showmodelorientationmodal: !(this.state.showmodelorientationmodal)})
        // console.log(this.state.showmodelorientationmodal)
    }

    kepressLayer(e){
        console.log(e.keyCode)
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.keyFunction, false);
    }

    twitterShare(e){
        e.preventDefault();

        let neuron = this.layerList[this.state.modelsList[this.state.selectedmodel].name][this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name][this.state.selectedneuron] ;
        let modelname = this.state.modelsList[this.state.selectedmodel].name
        let layer = this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name
        let fflurl = "https://fastforwardlabs.github.io/convnetplayground/#/models?model=" + modelname + "&layer=" + layer + "&neuron=" + neuron
        let url = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(fflurl) +"&via=" + "ffl" + "&text=" + encodeURIComponent("A visualization of neuron " + neuron + " in the " + layer + " layer  of a " + modelname + " model. Interested in visualizations of layers in a CNN or an implementation of image search? Visit the #convnetplayground prototype.") ;
         
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
            let selectedlayer = this.state.modelsList[index].layers[this.state.modelsList[index].layers.length -1].name
        
            let imagePath = process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/0.jpg" 
            // console.log(imagePath)
            return (

                <div key={mdata.name + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {mdata.name.toUpperCase()}</div>
                    <div className="smalldesc pb5">{mdata.numlayers} layers </div>

                    <img onClick={this.clickModelImage.bind(this)} src={imagePath} alt="" className={"datasetbox rad2 " + (this.state.selectedmodel == index ? "active" : "")} indexvalue={index} />
                </div>
            )
        });

        let layerImageList = this.state.modelsList[this.state.selectedmodel].layers.map((ldata, index) => {    
            let selectedModel = this.state.modelsList[this.state.selectedmodel].name 
            let selectedlayer = this.state.modelsList[this.state.selectedmodel].layers[index].name
            let neuronList = this.layerList[selectedModel][selectedlayer]
            let imagePath = process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/" + neuronList[neuronList.length -1]  + ".jpg"  ;
             
            return (
                <div key={ldata + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {abbreviateString(ldata.name, 11).toLowerCase()}</div>
                    <img onKeyPress={this.kepressLayer.bind(this)} onClick={this.clickLayerImage.bind(this)} src={imagePath} alt="" className={"datasetbox rad2 " + (this.state.selectedlayer == index ? "active" : "")} indexvalue={index} />
                </div>
            )
        });
        let selectedModel = this.state.modelsList[this.state.selectedmodel].name
        let currentLayers = this.layerList[selectedModel] 
        let selectedlayer = this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name
        let neuronList = currentLayers[selectedlayer]

        // this.state.neuronList = neuronList
        // this.setState({neuronList: neuronList })
        
        let neuronImageList
        if (neuronList) {
            neuronImageList = currentLayers[selectedlayer].map((ldata, index) => {    
            let imagePath = process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/" + ldata + ".jpg" 
            // console.log(imagePath)
            let neuronIndex = ldata.split(".")[0]
            return (
                <div key={ldata + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> Channel { neuronIndex }</div>
                    <img  onClick={this.clickNeuronImage.bind(this)}   src={imagePath} alt="" className={"neuronbox rad2 " + (this.state.selectedneuron == index ? "active" : "")} indexvalue={index} pathinfo={imagePath} neuronindex={neuronIndex} />
                </div>
            )
        });
        }
        
        // console.log(this.state.modelsList[this.state.selectedmodel].all_layers)

        return (
            
            <div>
                {(this.state.showmodelorientationmodal) && <Modal className="orientationmodal"
                    open={true}
                    size="lg"
                    // style={{maxWidth: '1600px', width: '100%'}}
                    passiveModal={true}
                    primaryButtonText="Get Started"
                    // secondaryButtonText = "Do not show this again"
                    modalHeading="Model Explorer"
                    modalLabel="How it works"
                    onRequestSubmit={this.toggleModelsModal.bind(this)} 
                    onRequestClose={this.toggleModelsModal.bind(this)}
                >
                    <ModelsModalContent></ModelsModalContent>

                </Modal>}

                { (this.state.showmoremodelinfomodal) && <Modal className="orientationmodal" 
                                    open={true}
                                    size="lg"
                                    // style={{maxWidth: '1600px', width: '100%'}}
                                    passiveModal={true}
                                    primaryButtonText = "Get Started"
                                    // secondaryButtonText = "Do not show this again"
                                    modalHeading= {this.state.modelsList[this.state.selectedmodel].name.toUpperCase()}  
                                    // modalLabel= "How this demo works"
                                    onRequestSubmit = {this.toggleModelMoreInfoModal.bind(this)} 
                                    onRequestClose = {this.toggleModelMoreInfoModal.bind(this)}
                                    >
                                    <div>
                                    <DataTable
                                        rows={this.state.modelsList[this.state.selectedmodel].all_layers}
                                        headers={headers}
                                        render={({ rows, headers, getHeaderProps }) => (
                                            <TableContainer className="boldtext" title={ "List of layers in  "  + this.state.modelsList[this.state.selectedmodel].name.toUpperCase() + " Model"} >
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
                                    </div>
                                    
                </Modal>} 

                
                 
                <div className=" flex  "> 
                    <div  className="iblock sectiontitle flexfull   pt4 ">Model Explorer</div>
                    <div className="flex5  ">
                    <div onClick={this.toggleModelsModal.bind(this)}  className="iblock floatright  clickable showmore"> ? More Info  </div>
                    </div>
                </div> 
                <div className="horrule"></div>
                {/* <InlineNotification
                    title={"Image Algebra"} 
                    kind={"info"} 
                    subtitle={this.pageIntro}
                    style={{ minWidth: '100%', marginBottom: '.5rem' }}
                /> */}

                <div className="mynotif lh10 p20 mt10 instructions lightbluehightlight maxh16">
                    Interpretable models are models we can "understand". 
                    In this demo, we use  <a href="https://distill.pub/2017/feature-visualization/" target="_blank" rel="noopener noreferrer"> optimization based feature visualization </a> approaches
                    to visualize what the channels (collection of neurons) in a CNN layer has learned to detect. 
                    Each image is derived (via optimization) as the image which activates the neurons within that channel.
                    To explore, <strong> click </strong>  on a model, and a layer to view a selection of visualization of channels in that layer.
                     
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

                <div className="flex flexwrap ">
                    <div className="flex5 mr10">
                        <div className="mt20 pb10 sectiontitle" > Select Model </div>
                        <div className="horrule mb10"></div>
                        <div className="scrollwindow  scrollwindowmodel">
                            {modelImageList}
                        </div>
                        
                        <div>
                            <div className=" iblock  boldtext datasetdescription mr10 p10 greyhighlight">{this.state.modelsList[this.state.selectedmodel].name.toUpperCase()}</div>
                            <div onClick={this.toggleModelMoreInfoModal.bind(this)} className="iblock p10  greyhighlight unselectable greymoreinfo clickable"> ? More Info</div>
                        </div>
                        
                    </div>


                    <div className="flex5">
                        <div className="mt20 pb10 sectiontitle" > Select Layer </div>
                        <div className="horrule mb10"></div>
                        <div className="scrollwindow layerwindow  ">
                            <div className="windowcontent"> {layerImageList} </div>
                        </div>
                        <div className="flex flexwrap ">
                            <div className="flex1  mr10 ">
                            <div className="whitespacenowrap  boldtext datasetdescription  p10 greyhighlight unselectable "> {abbreviateString(this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name, 19).toUpperCase()}</div>
                            </div>
                            <div className="flex9 ">
                                <div className="smalldesc boldtext pt4"> Layer [ {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index }  of {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].totallayers }  ] {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].type } </div>
                                <div className="smalldesc pt3"> {makeFriendly(this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].parametercount)} trainable parameters, {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].numneurons} channels  </div>
                            </div>
                        </div>
                        
                    </div>
                </div>


                <div className="mt20 mb10 ">
                    <div className="sectiontitle iblock mr10"> Visualizations for layer {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()} Layer </div>
                    <div className="iblock"> A selection of 30 channels in the current layer.</div>
                </div>

                <div className="horrule mb10"></div>

                <div className="flex flexwrap">
                    <div className="flex1">
                        <div className="enlargeddiv rad2 mr10">
                        {/* let selectedModel = this.state.modelsList[this.state.selectedmodel].name
        let currentLayers = this.layerList[selectedModel] 
        let selectedlayer = this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name
        let neuronList = currentLayers[selectedlayer] */}

       

                            <div  onClick={this.twitterShare.bind(this)} className="mb10" > <div className="twitterbutton unselectable mt10 p10 clickable  flex greymoreinfo" href=""> Share on twitter </div> </div>
                            <div className="boldtext enlargeddesc mb5  smalldesc">{this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()}: { this.layerList[this.state.modelsList[this.state.selectedmodel].name][this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name][this.state.selectedneuron]} / {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].numneurons} </div>
                            <img className="enlargedneuron rad4" src={process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/" +  this.layerList[this.state.modelsList[this.state.selectedmodel].name][this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name][this.state.selectedneuron] + ".jpg"}  alt=""/>
                            
                        </div>
                        </div>
                    <div className="flexfull neurondivbox  ">
                        {neuronImageList}
                    </div>
                   
                </div>

               


                <br/>
                <br/>
                <br/>
            </div>
        );
    }
}

export default ModelEx;
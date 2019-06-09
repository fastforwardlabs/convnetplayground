import React, { Component } from "react";
import { DataTable, Modal } from 'carbon-components-react';
import {abbreviateString, loadJSONData, makeFriendly, boundWidth} from "../../components/helperfunctions/HelperFunctions"
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

 const initialRows = [
    {
      id: 'a',
      field1: 'Field 1a',
    },
    {
      id: 'b',
      field1: 'Field 1b',
    },
    {
      id: 'c',
      field1: 'Field 1c',
    },
  ]; 
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
    }

    componentDidMount() {
        document.title = "ConvNet Playground | Model Explorer"; 
        const queryString = require('query-string'); 
        const qs = queryString.parse(this.props.location.search);
        // this.sets
    }

    clickModelImage(e) {
        this.setState({ selectedmodel: e.target.getAttribute("indexvalue") }) 
        this.setState({ selectedlayer: 0 }) 
    }

    clickLayerImage(e) {
        this.setState({ selectedlayer: e.target.getAttribute("indexvalue") }) 
        this.setState({ selectedneuron: 0 }) 
    }

    
    clickNeuronImage(e) {
       
        // this.setState({selectedneuronpath: e.target.getAttribute("pathinfo")  })
        this.setState({ selectedneuron: e.target.getAttribute("indexvalue") }) 
        // this.setState({ selectedneuronindex: e.target.getAttribute("neuronindex") }) 
        
        // console.log(this.state.neuronList)

    }


    toggleModelMoreInfoModal(e){
        this.setState({showmoremodelinfomodal: !(this.state.showmoremodelinfomodal)})
    }

    toggleModelsModal(e){
        this.setState({showmodelorientationmodal: !(this.state.showmodelorientationmodal)})
        // console.log(this.state.showmodelorientationmodal)
    }


    render() {
        let modelInterpretabilityIntro = `Interpretable models are models we can "understand". 
        Interpretability explores approaches to better understand neural networks. For example, 
        how can we "peek" into a CNN to get an idea of what each neuron in a layer has learned to detect? `    

        let optimizationVisualization = `  
        One way to accomplish this is the use of optimization approaches to feature visualizations. Within this approach,
        we begin with random noise and update it (based on gradients) to maximally excite each neuron. 
        We use the lucid library to accomplish this and results are shown for a few models below.
        `

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
            let neuronList = this.layerList[selectedModel] [selectedlayer]
            let imagePath = process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/" + neuronList[neuronList.length -1]  + ".jpg" 
             
            return (
                <div key={ldata + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> {abbreviateString(ldata.name, 11).toLowerCase()}</div>
                    <img onClick={this.clickLayerImage.bind(this)} src={imagePath} alt="" className={"datasetbox rad2 " + (this.state.selectedlayer == index ? "active" : "")} indexvalue={index} />
                </div>
            )
        });
        let selectedModel = this.state.modelsList[this.state.selectedmodel].name
        let currentLayers = this.layerList[selectedModel] 
        let selectedlayer = this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name
        let neuronList = currentLayers[selectedlayer]

        this.state.neuronList = neuronList
        
        let neuronImageList
        if (neuronList) {
            neuronImageList = currentLayers[selectedlayer].map((ldata, index) => {    
            let imagePath = process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/" + ldata + ".jpg" 
            // console.log(imagePath)
            let neuronIndex = ldata.split(".")[0]
            return (
                <div key={ldata + "fullbox" + index} className="iblock datasetfullbox clickable mb10 ">
                    <div className="datasettitles"> Neuron { neuronIndex }</div>
                    <img  onMouseOver={this.clickNeuronImage.bind(this)}   src={imagePath} alt="" className={"neuronbox rad2 " + (this.state.selectedneuron == index ? "active" : "")} indexvalue={index} pathinfo={imagePath} neuronindex={neuronIndex} />
                </div>
            )
        });
        }
        
        // console.log(this.state.modelsList[this.state.selectedmodel].all_layers)

        return (
            
            <div>

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
                                            <TableContainer title="List of layers in Model">
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
                    <div onClick={this.toggleModelsModal.bind(this)}  className="iblock floatright  clickable showmodal"> ? More Info  </div>
                    </div>
                </div> 
                <div className="horrule"></div>
                {/* <InlineNotification
                    title={"Image Algebra"} 
                    kind={"info"} 
                    subtitle={this.pageIntro}
                    style={{ minWidth: '100%', marginBottom: '.5rem' }}
                /> */}

                <div className="flex mt10">
                    <div className="flex5 mr10 mynotif lightbluehightlight p20">
                        <div className="boldtext mb10"> Model Interpretability</div>
                        <div className="lh10 maxh16">{modelInterpretabilityIntro}</div>
                    </div>
                    <div className="flex5  mynotif lightbluehightlight p20">
                        <div className="boldtext mb10"> Optimization-based Feature Visualization</div>
                        <div className="lh10 maxh16">{optimizationVisualization}</div>
                    </div>

                </div>

                <div className="flex ">
                    <div className="flex5 mr10">
                        <div className="mt20 pb10 sectiontitle" > Select Model </div>
                        <div className="horrule mb10"></div>
                        <div className="layerwindow layerwindowmodel">
                            {modelImageList}
                        </div>
                        
                        <div>
                            <div className=" iblock  boldtext datasetdescription mr10 p10 lightbluehightlight">{this.state.modelsList[this.state.selectedmodel].name.toUpperCase()}</div>
                            <div onClick={this.toggleModelMoreInfoModal.bind(this)} className="iblock p10 lightbluehightlight clickable"> ? More info</div>
                        </div>
                        
                    </div>


                    <div className="flex5">
                        <div className="mt20 pb10 sectiontitle" > Select Layer </div>
                        <div className="horrule mb10"></div>
                        <div className="layerwindow  ">
                            <div className="windowcontent"> {layerImageList} </div>
                        </div>
                        <div className="flex flexwrap ">
                            <div className="flex1  mr10 ">
                            <div className="whitespacenowrap  boldtext datasetdescription  p10 lightbluehightlight"> {abbreviateString(this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name, 19).toUpperCase()}</div>
                            </div>
                            <div className="flex9 ">
                                <div className="smalldesc boldtext pt4"> Layer [ {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].layer_index }  of {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].totallayers }  ] {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].type } </div>
                                <div className="smalldesc pt3"> {makeFriendly(this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].parametercount)} trainable parameters, {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].numneurons} neurons  </div>
                            </div>
                        </div>
                        
                    </div>
                </div>


                <div className="mt20 mb10 ">
                    <div className="sectiontitle iblock mr10"> Neurons in {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()} Layer </div>
                    <div className="iblock"> A selection of 30 neurons on the current layer.</div>
                </div>

                <div className="horrule mb10"></div>

                <div className="flex flexwrap">
                    <div className="flex1">
                        <div className="enlargeddiv rad2 mr10">
                            <div  className="mb10" > <a className="twitterbutton" href=""> Share on twitter </a> </div>
                            <div className="boldtext enlargeddesc mb5  smalldesc">{this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].name.toUpperCase()}: {this.state.neuronList[this.state.selectedneuron].split(".")[0]} / {this.state.modelsList[this.state.selectedmodel].layers[this.state.selectedlayer].numneurons} </div>
                            <img className="enlargedneuron rad4" src={process.env.PUBLIC_URL + "/assets/models/" + selectedModel + "/" + selectedlayer + "/" + this.state.neuronList[this.state.selectedneuron] + ".jpg"}  alt=""/>
                            
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
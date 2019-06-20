import React, { Component } from 'react'
import * as THREE from 'three'
import * as _ from 'lodash'
import * as d3 from 'd3'
import * as TWEEN from '@tweenjs/tween.js'
import { loadJSONData,ColorArrayRGB } from "../../components/helperfunctions/HelperFunctions"
import "./scene.css"



class Scene extends Component {
  constructor(props) {
    super(props)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)

     
    this.state = {
        legend: [],
        dataset: this.props.data.dataset,
        model: this.props.data.model,
        layer: this.props.data.layer,
        layerindex: this.props.data.layerindex,
        highlightedindex: 0
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log("showing both values",prevProps.data, this.props.data)
    // console.log("showing both values")
    // if (this.props.data.layer !== prevProps.data.layer ) {
    //     console.log("things are different")
    //     // this.clearScene()
    //     // console.log("clearing ", this.props.data)
    //     // this.addPoints()
    // }
    if (this.props.data){
       
        if (this.props.data.dml !== prevProps.data.dml ) {
            // console.log("things have changed", this.props.data)
            this.setState({dataset: this.props.data.dataset})
            this.setState({model: this.props.data.model})
            this.setState({layer: this.props.data.layer})
            this.setState({layerindex: this.props.data.layerindex})
           
        }
        
    }

    if (this.state.dataset !== prevState.dataset || this.state.model !== prevState.model  || this.state.layer !== prevState.layer ){
        this.loadData()
    }

   }

  

  componentDidMount() {

    
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    this.fov = 75;
    this.near = 10;
    this.far = 1900;
    this.tweenDuration = 800

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      this.fov,
      width / height,
      this.near,
      this.far
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const geometry = new THREE.BoxGeometry(1000, 1000, 1000)
    const material = new THREE.MeshBasicMaterial({ color: '#433F81' })
    const cube = new THREE.Mesh(geometry, material)

    // camera.position.z = 4
    // scene.add(cube)
    renderer.setClearColor('#000000')
    renderer.setSize(width, height)

    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.material = material
    this.cube = cube
    this.width = width
    this.height = height
    this.pointScale = 120

    window.addEventListener('resize', () => {
        this.width = window.innerWidth -40; 
        // this.height = window.innerHeight;
      
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
      })
      
     

    this.mount.appendChild(this.renderer.domElement)
    // console.log([this.getScaleFromZ(this.far), this.getScaleFromZ(this.near)])
    this.zoom = d3.zoom().scaleExtent([this.getScaleFromZ(this.far), this.getScaleFromZ(this.near)])
    .on('zoom',this.zoomHandler.bind(this));

    this.view = d3.select(this.mount);
    this.setUpZoom()

    
    this.start()
    // this.addPoints()
    this.loadData()

    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 15;

    this.view.on("mousemove", () => {
        let [mouseX, mouseY] = d3.mouse(this.view.node());
        let mouse_position = [mouseX, mouseY];
        // console.log(mouse_position)
        this.checkIntersects(mouse_position);
    });

    this.view.on("mouseleave", () => {
        this.removeHighlights()
    });
      

    this.hoverContainer = new THREE.Object3D()
    this.scene.add(this.hoverContainer);
 
  }

  highlightPoint(datum) {
    this.removeHighlights();
    
    let geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(datum.x*this.pointScale, datum.y*this.pointScale,0));
    let color = ColorArrayRGB()[this.legendMap.get(datum.class)]
    color = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")" 
    // console.log(color)
    geometry.colors = [ new THREE.Color( color ) ];
    let material = new THREE.PointsMaterial({
      size: 30,
      sizeAttenuation: false,
      vertexColors: THREE.VertexColors,
      map: this.circle_sprite,
      transparent: true
    });
    
    let point = new THREE.Points(geometry, material);
    this.hoverContainer.add(point);
    // point.geometry.attributes.position.needsUpdate = true
    console.log("adding highlight")
  }


  
  removeHighlights() {
    this.hoverContainer.remove(...this.hoverContainer.children);
  }

  mouseToThree(mouseX, mouseY) {
    return new THREE.Vector3(
      mouseX / this.width * 2 - 1,
      -(mouseY / this.height) * 2 + 1,
      1
    );
  }

  checkIntersects(mouse_position) {
    let mouse_vector = this.mouseToThree(...mouse_position);
    this.raycaster.setFromCamera(mouse_vector, this.camera);
    let intersects = this.raycaster.intersectObject(this.points);
    if (intersects[0]) {
      let sorted_intersects = this.sortIntersectsByDistanceToRay(intersects);
      let intersect = sorted_intersects[0];
      let index = intersect.index;
       
      this.tooltipimg.src = process.env.PUBLIC_URL + "/assets/semsearch/datasets/" + this.state.dataset + "/" + index + ".jpg"
       
      let datum = this.pointData[index];
      this.tooltip.innerHTML =  (datum.class).toUpperCase()
      this.tooltipbox.style.display = "block"
      this.tooltipbox.style.left = mouse_position[0]  + "px"
      this.tooltipbox.style.top = (mouse_position[1] +  10) + "px" 
    //   this.highlightPoint(datum);
    //   showTooltip(mouse_position, datum);
    } else {
      this.removeHighlights();
      this.hideTooltip();
    }
  }
  hideTooltip(){
    this.tooltipbox.style.display = "none"
  }
  sortIntersectsByDistanceToRay(intersects) {
    return _.sortBy(intersects, "distanceToRay");
  }

  zoomHandler() {
    let d3_transform = d3.event.transform
    let scale = d3_transform.k;
    let x = -(d3_transform.x - this.width/2) / scale;
    let y = (d3_transform.y - this.height/2) / scale;
    let z = this.getZFromScale(scale);
    // console.log( this.width, d3_transform, x,y,z)
    this.camera.position.set(x, y, z);
    // console.log("On zoom ",x, y, z)
  }
  
  getScaleFromZ (camera_z_position) {
    let half_fov = this.fov/2;
    let half_fov_radians = this.toRadians(half_fov);
    let half_fov_height = Math.tan(half_fov_radians) * camera_z_position;
    let fov_height = half_fov_height * 2;
    let scale = this.height / fov_height; // Divide visualization height by height derived from field of view
    return scale;
  }
  toRadians (angle) {
    return angle * (Math.PI / 180);
  }
  
  getZFromScale(scale) {
    let half_fov = this.fov/2;
    let half_fov_radians = this.toRadians(half_fov);
    let scale_height = this.height / scale;
    let camera_z_position = scale_height / (2 * Math.tan(half_fov_radians));
    return camera_z_position;
  }
  

  randomPosition(radius) {
    var pt_angle = Math.random() * 2 * Math.PI;
    var pt_radius_sq = Math.random() * radius * radius;
    var pt_x = Math.sqrt(pt_radius_sq) * Math.cos(pt_angle);
    var pt_y = Math.sqrt(pt_radius_sq) * Math.sin(pt_angle);
    return [pt_x, pt_y];
  }

  setUpZoom() {
    this.view.call(this.zoom);    
    let initial_scale = this.getScaleFromZ(this.far);
    var initial_transform = d3.zoomIdentity.translate(this.width/2, this.height/1.2).scale(initial_scale);    
    this.zoom.transform(this.view, initial_transform); 
    // this.camera.position.setX(160);
    // console.log("initial position", this.camera.position)
  } 

  clearScene(){
    this.scene.remove.apply(this.scene, this.scene.children);
  }

  loadData(){
    let umapPath = process.env.PUBLIC_URL + "/assets/semsearch/umap/" + this.state.dataset+"/" + this.state.model  +"/" + this.state.layer + ".json" 
    let loadedJSON = loadJSONData(umapPath)
    // console.log(similarityPath)    
    let self = this
    loadedJSON.then(function (data) {
        if (data) {
            self.createPoints(data)
        }
    })
  }

  createPoints(data){ 
    // this.clearScene()
    let pointsGeometry = new THREE.Geometry()
    let pointsBufferGeometry = new THREE.BufferGeometry()
    let colors = []; 
    let legend = new Map()
    let legendArray = []
    let vertices = []
    let self = this
    data.forEach(function(datum,i){
        let vert = new THREE.Vector3(datum.x, datum.y, 0); 
        vertices[i] = vert 
    })

    let numVertices = vertices.length
    let positions = new Float32Array(numVertices * 3)
    let offsets = new Float32Array(numVertices * 2)
    let colorsBF = new Float32Array(numVertices * 3)
    pointsBufferGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
    pointsBufferGeometry.addAttribute('offset', new THREE.BufferAttribute(offsets, 2))
    pointsBufferGeometry.addAttribute('color', new THREE.BufferAttribute(colorsBF, 3))

    if(this.pointData){
        // let numVertices = this.pointData.length
        let position = this.points.geometry.attributes.position.array
        let target = new Float32Array(numVertices * 3)
        for (let i = 0, index = 0, l = numVertices; i < l; i++, index += 3) { 
        target[index] = data[i].x * this.pointScale + 100
        target[index + 1] = data[i].y* this.pointScale + 100
        target[index + 2] = 0
        }

        let tween = new TWEEN.Tween(position).to(target, self.tweenDuration).easing(TWEEN.Easing.Linear.None)
        tween.onUpdate(function() {
            self.points.geometry.attributes.position = new THREE.BufferAttribute(position,3)
            self.points.geometry.attributes.position.needsUpdate = true // required after the first render
        })
        tween.start()
        // console.log( this.points.geometry.attributes)
    }else {
        this.pointData = data
        for (let i = 0, index = 0, l = numVertices; i < l; i++, index += 3) {
            positions[index] = data[i].x * this.pointScale
            positions[index + 1] = data[i].y * this.pointScale
            positions[index + 2] = 0

        
            if (!legend.has(data[i].class)){ 
                legendArray.push({class: data[i].class, index: legend.size})
                legend.set(data[i].class, legend.size)
            }

            let color = ColorArrayRGB()[legend.get(data[i].class)]
            colorsBF[index] = color[0] / 255
            colorsBF[index + 1] = color[1] / 255
            colorsBF[index + 2] = color[2] / 255
        } 


        for (let datum of data){ 
            let vertex = new THREE.Vector3(datum.x* this.pointScale, datum.y*this.pointScale, 0); 
            pointsGeometry.vertices.push(vertex); 
            if (!legend.has(datum.class)){ 
                legend.set(datum.class, legend.size)
                legendArray.push({class: datum.class, index: legend.size})
            }
            let color = new THREE.Color(ColorArrayRGB()[legend.get(datum.class)]);
            colors.push(color);
        }

        this.legendMap = legend 
        this.setState({legend: legendArray}) 
        this.circle_sprite= new THREE.TextureLoader().load( 
            "images/circle-sprite.png", 
            function ( texture ) { },
            function ( xhr ) { console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );}, 
            function ( xhr ) { console.log( 'An error happened' );}
        )
        pointsGeometry.colors = colors; 
        let pointsMaterial = new THREE.PointsMaterial({
                size: 10,
                sizeAttenuation: false,
                vertexColors: THREE.VertexColors,
                map: this.circle_sprite,
                transparent: true
        });
        this.points = new THREE.Points(pointsBufferGeometry, pointsMaterial); 
        this.scene.add(this.points);
        this.scene.background = new THREE.Color("#CDCDCD");
 
    }


        
      
    
     
 
  }
 
  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  animate() {
    // this.cube.rotation.x += 0.01
    // this.cube.rotation.y += 0.01

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
    TWEEN.update()
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    let legendList = this.state.legend.map((legend, index) => {
        let color = ColorArrayRGB()[legend.index]
        color = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")" 
        return (
            <div key={"legend" + index}> 
              <div className="legendrow">
                <div className="iblock legendcolorbox " style={{ backgroundColor: color}}> </div>
                <div className="iblock boldtext legendtext ml10"  >  {legend.class}  </div>
              </div> 
            </div>
        )
    });
    return (
      <div className=" positionrelative"
       style={{ width: '100%', height: '400px' }}
      >
          <div ref={(tooltipbox) => { this.tooltipbox = tooltipbox }}  className="tooltip">
             <div className="tooltiptitle" ref={(tooltip) => { this.tooltip = tooltip }}> hi </div>
             <img className="tooltipimg rad2" ref={(tooltipimg) => { this.tooltipimg = tooltipimg }} src={"/assets/semsearch/datasets/"  + this.state.dataset + "/0.jpg"} alt=""/>
          </div>
          <div className="chartdescription">
              <div className=""> Dataset: {this.state.dataset.toUpperCase()} </div>
            <div className="charttitle boldtext pt2 "> Model: <span > {this.state.model.toUpperCase()} </span> Model </div>
    <div className="charttitle pt2"> Layer: {this.state.layerindex}  [ {this.state.layer} ]   </div>
          </div>
          <div className="legendbox "> 
              <div className="legendtitle boldtext "> Legend </div>
              <div className="mt10">
                {legendList}
              </div>
          </div>
          <div
        style={{ width: '100%', height: '400px' }}
        ref={(mount) => { this.mount = mount }}
      />
      </div>
    )
  }
}

export default Scene
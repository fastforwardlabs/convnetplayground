import React, { Component } from 'react'
import * as THREE from 'three'
import * as _ from 'lodash'
import * as d3 from 'd3'
import * as TWEEN from '@tweenjs/tween.js'
import { loadJSONData } from "../../components/helperfunctions/HelperFunctions"
import "./scene.css"

let color_array = [
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#fdbf6f",
    "#ff7f00",
    "#6a3d9a",
    "#cab2d6",
    "#ffff99"
  ]

class Scene extends Component {
  constructor(props) {
    super(props)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)

     
    this.state = {
        // data: this.props.data
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log("showing both values",prevProps.data, this.props.data)
    // console.log("showing both values")
    if (this.props.data.layer !== prevProps.data.layer ) {
        console.log("things are different")
        // this.clearScene()
        // console.log("clearing ", this.props.data)
        // this.addPoints()
    }
   }

  

  componentDidMount() {

    
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    this.fov = 75;
    this.near = 10;
    this.far = 7000;

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

    camera.position.z = 4
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

    // let width = window.innerWidth;
    // let viz_width = width;
    // let height = window.innerHeight;

    // this.fov = 40;
    // this.near = 10;
    // this.far = 7000;

    this.mount.appendChild(this.renderer.domElement)
    // console.log([this.getScaleFromZ(this.far), this.getScaleFromZ(this.near)])
    this.zoom = d3.zoom().scaleExtent([this.getScaleFromZ(this.far-1), this.getScaleFromZ(this.near)])
    .on('zoom',this.zoomHandler.bind(this));

    this.view = d3.select(this.mount);
    this.setUpZoom()

    
    this.start()
    // this.addPoints()
    this.loadData()
 
  }

  zoomHandler() {
    let d3_transform = d3.event.transform
    let scale = d3_transform.k;
    let x = -(d3_transform.x - this.width/2) / scale;
    let y = (d3_transform.y - this.height/2) / scale;
    let z = this.getZFromScale(scale);
    // console.log( this.width, d3_transform, x,y,z)
    this.camera.position.set(x, y, z);
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
    var initial_transform = d3.zoomIdentity.translate(this.width/2, this.height/2).scale(initial_scale);    
    this.zoom.transform(this.view, initial_transform);
    this.camera.position.set(0, 0, this.far);
  } 

  clearScene(){
    this.scene.remove.apply(this.scene, this.scene.children);
  }

  loadData(){
    let umapPath = process.env.PUBLIC_URL + "/assets/semsearch/umap/iconic200/vgg16/block5_conv3.json" 
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

    


    let data_points = [];
    let point_num = 1000;
    let radius = 2000;
    let color_array = [
        "#1f78b4",
        "#b2df8a",
        "#33a02c",
        "#fb9a99",
        "#e31a1c",
        "#fdbf6f",
        "#ff7f00",
        "#6a3d9a",
        "#cab2d6",
        "#ffff99"
      ]

    for (let i = 0; i < point_num; i++) {
      let position = this.randomPosition(radius);
      let name = 'Point ' + i;
      let group = Math.floor(Math.random() * 6);
      let point = { position, name, group };
      data_points.push(point);
    }

    let generated_points = data_points;
    let pointsGeometry = new THREE.Geometry();
    let colors = [];
    // for (let datum of generated_points) {
    //     // console.log(datum.position[0], datum.position[1])
    //     // Set vector coordinates from data
    //     let vertex = new THREE.Vector3(datum.position[0], datum.position[1], 0);
    //     // let vertex = new THREE.Vector3(0,0,0);
    //     pointsGeometry.vertices.push(vertex);
    //     let color = new THREE.Color(color_array[datum.group]);
    //     colors.push(color);
    // }
    let legend = new Map()
    for (let datum of data){
        // console.log(datum)
        let vertex = new THREE.Vector3(datum.x* 100, datum.y*100, 0); 
        pointsGeometry.vertices.push(vertex);

        if (!legend.has(datum.class)){
            // console.log( datum.class, "not in legend")
            legend.set(datum.class, legend.size)
        }
        let color = new THREE.Color(color_array[legend.get(datum.class)]);
        colors.push(color);
    }

    let circle_sprite= new THREE.TextureLoader().load(
        // "http://localhost:3000/images/circle-sprite.png"
        "images/circle-sprite.png",
        // Function called when download progresses
        function ( texture ) {
            // console.log(texture)
        },
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        // Function called when download errors
        function ( xhr ) {
            console.log( 'An error happened' );
        }
      )
    pointsGeometry.colors = colors; 

    let pointsMaterial = new THREE.PointsMaterial({
            size: 8,
            sizeAttenuation: false,
            vertexColors: THREE.VertexColors,
            map: circle_sprite,
            transparent: true
    });
    let points = new THREE.Points(pointsGeometry, pointsMaterial);
    // points.position.set(0,0,1) 
    this.scene.add(points);
    this.scene.background = new THREE.Color(0xefefef);

  }

  addPoints(){
    

    for (let i = 0; i < 10; i++){
        let color = new THREE.Color(color_array[ Math.round( Math.random() * color_array.length) ] ); 
        var material = new THREE.MeshBasicMaterial( { color: color } );
        var geometry = new THREE.CircleGeometry (Math.random(), 42 );
        var circle = new THREE.Mesh( geometry, material ); 
        circle.position.setX(-5+i) 
        circle.position.setY(Math.random()) 
        this.scene.add( circle );
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
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div className="border positionrelative">
          <div className="legendbox"> 
              <div> Legend </div>
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
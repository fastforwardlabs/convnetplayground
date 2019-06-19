import React, { Component } from 'react'
import * as THREE from 'three'

class Scene extends Component {
  constructor(props) {
    super(props)
 
  }

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: '#433F81' })
    const cube = new THREE.Mesh(geometry, material)

    camera.position.z = 4
    scene.add(cube)
    renderer.setClearColor('#000000')
    renderer.setSize(width, height)

    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.material = material
    this.cube = cube

    this.mount.appendChild(this.renderer.domElement)
    this.renderScene()
  }

  componentWillUnmount() {
    // this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

   

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div
        style={{ width: '100%', height: '400px' }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}

export default Scene
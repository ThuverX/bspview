import * as THREE from 'three'
import { BSPFile } from '../../parsers/bsp.class'
import { meshrep, modelToMesh } from '../../types/bsp.type'
import { dface_t } from '../../types/bsp/dface'
import { dleaf_t } from '../../types/bsp/dleaf'
import { dleafface_t } from '../../types/bsp/dleafface'
import { dnode_t } from '../../types/bsp/dnode'
import { LUMP_TYPE } from '../../types/bsp/lump_type.enum'
import { float, short } from '../../types/util'

export class ThreeWorld {
    scene: THREE.Scene = new THREE.Scene()

    camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
    
    geometry: THREE.BoxGeometry = new THREE.BoxGeometry()
    material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })

    worldscale = 200
    pos = [2368.665039,410.093781,-76.473709]

    bsptree = {}

    transformCoord(x: number,y : number,z : number) : [number, number, number] {
        return [x / this.worldscale, z / this.worldscale, y / this.worldscale]
    }

    constructor() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)

        window.addEventListener('resize', () => this.onWindowResize(), false)

        let transformedCoords = this.transformCoord(this.pos[0],this.pos[1],this.pos[2])
        this.camera.position.x = transformedCoords[0]
        this.camera.position.z = transformedCoords[1]
        this.camera.position.y = transformedCoords[2]

        this.camera.rotateY(Math.random() * 2 * Math.PI)

        this.animate = this.animate.bind(this)

        document.onkeydown = (event: KeyboardEvent) => {
            if(event.code == "Space")
                this.camera.rotateY(Math.PI * 0.5)
        }
    }

    file: BSPFile

    meshes = []
    nodes: Array<dnode_t>
    leafs: Array<dleaf_t>

    pushBSP(file: BSPFile): void {
        this.file = file

        let modelReps: Array<meshrep> = modelToMesh(this.file)

        this.nodes = this.file.getLump<dnode_t>(LUMP_TYPE.LUMP_NODES)
        this.leafs = this.file.getLump<dleaf_t>(LUMP_TYPE.LUMP_LEAFS)

        for(let model of modelReps) {
            this.pushMesh(model)
        }

        this.animate()

        let leaf = this.getLeafForPosition(this.transformCoord(this.pos[0],this.pos[1],this.pos[2]))

        console.log('leaf reached', leaf)

        let faces = this.file.getLump<dface_t>(LUMP_TYPE.LUMP_FACES)
        let leaffaces = this.file.getLump<dleafface_t>(LUMP_TYPE.LUMP_LEAFFACES)

        let facenummin = leaffaces[leaf.firstleafface]
        // let facenummax = leaffaces[leaf.firstleafface + leaf.numleaffaces]

        // console.log(faces[facenummin])

    }

    getLeafForPosition(transformedCoord: [float, float, float]): dleaf_t {
        const isInside = (coord: [float, float, float], mins: [short, short, short], maxs: [short, short, short]): boolean => {
            let x1 = coord[0]
            let y1 = coord[1]
            let z1 = coord[2]

            let x2 = mins[0] / this.worldscale
            let y2 = mins[1] / this.worldscale
            let z2 = mins[2] / this.worldscale

            let x3 = maxs[0] / this.worldscale
            let y3 = maxs[1] / this.worldscale
            let z3 = maxs[2] / this.worldscale

            return (x1 >= x2 && x1 < x3) && (y1 >= y2 && y1 < y3) && (z1 >= z2 && z1 < z3)
        }

        const pullRound = (node: dnode_t): dleaf_t => {

            let n1 = node.children[0] >= 0 ? this.nodes[node.children[0]] : this.leafs[Math.abs(node.children[0])]
            let n2 = node.children[1] >= 0 ? this.nodes[node.children[1]] : this.leafs[Math.abs(node.children[1])]


            // TODO: fix this
            // It should propegate if the coord is on a certain side of the plane (from planenum in the node)

            if(isInside(transformedCoord, n1.mins, n1.maxs)) {
                if(n1.hasOwnProperty('planenum')) return pullRound(n1 as dnode_t)
                else return n1 as dleaf_t
            } else {
                if(n2.hasOwnProperty('planenum')) return pullRound(n2 as dnode_t)
                else return n2 as dleaf_t
            }
        }

        return pullRound(this.nodes[0])
    }

    pushMesh(modelMesh: meshrep): void {
        let geometry = new THREE.BufferGeometry()

        const vertices = modelMesh.vertices.map(({x,y,z}) => this.transformCoord(x,y,z)).flat()
        const indices = modelMesh.indices

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3, false))
        geometry.setIndex(indices)

        const mesh = new THREE.Mesh(geometry, new THREE.PointsMaterial({ color: (Math.random() * 200 + 50) * 0xffffff }))
        const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x0000ff, size: 0.5 }))
        const lines = new THREE.Line(geometry, new THREE.PointsMaterial({ color: 0x00ffff, size: 0.5 }))

        this.scene.add(mesh)

        // mesh.frustumCulled = false

        // this.scene.add(lines)
        // this.scene.add(points)
    }
    
    onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.render()
    }
    
    animate(): void {
        requestAnimationFrame(this.animate)

        // for(let mesh of this.scene.children) {
        //     if(this.camera.position.distanceTo(mesh.position) < 1) {
        //         mesh.visible = true
        //     }
        //     mesh.visible = false
        // }

        this.camera.rotateY(0.001)

        this.render()
    }

    render(): void {
        this.renderer.render(this.scene, this.camera)
    }
}


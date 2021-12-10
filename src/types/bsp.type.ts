import { dedege_t, read_dedge } from './bsp/dedge'
import { dface_t, read_dface } from './bsp/dface'
import { dheader_t, read_dheader } from './bsp/dheader'
import { dmodel_t, read_dmodel } from './bsp/dmodel'
import { dplane_t, read_dplane } from './bsp/dplane'
import { dsurfedege_t, read_dsurfedege } from './bsp/dsurfedge'
import { LUMP_TYPE } from './bsp/lump_type.enum'
import { read_Vector, Vector } from './bsp/Vector'
import { FileBuffer } from './FileBuffer'
import { hasFlag, int, readArray } from './util'
import { BSPFile } from '../parsers/bsp.class'
import { read_texinfo, texinfo_t } from './bsp/texinfo'
import { TexFlags } from './bsp/texflags.enum'
import { read_texdata, texdata_t } from './bsp/texdata'
import { dnode_t, read_dnode } from './bsp/dnode'
import { dleaf_t, read_dleaf } from './bsp/dleaf'
import { dleafface_t, read_dleafface } from './bsp/dleafface'

export type HEADER_LUMPS = 64
export const HEADER_LUMPS = 64

export const IDBSPHEADER = 0x50534256

export function readLumpArray<T>(buf: FileBuffer, dheader: dheader_t,type: LUMP_TYPE, func: Function) : Array<T> {
    return readArray<T>(buf, func, null, dheader.lumps[type].fileofs, dheader.lumps[type].filelen)
}

export type bsp_t = ReturnType<typeof read_bsp>
export function read_bsp(buf: FileBuffer): {
    HEADER_LUMPS: HEADER_LUMPS
    dheader: dheader_t,
    lumps: {
        [LUMP_TYPE.LUMP_PLANES]: Array<dplane_t>,
        [LUMP_TYPE.LUMP_VERTEXES]: Array<Vector>,
        [LUMP_TYPE.LUMP_EDGES]: Array<dedege_t>,
        [LUMP_TYPE.LUMP_SURFEDGES]: Array<dsurfedege_t>,
        [LUMP_TYPE.LUMP_FACES]: Array<dface_t>,
        [LUMP_TYPE.LUMP_ORIGINALFACES]: Array<dface_t>,
        [LUMP_TYPE.LUMP_MODELS]: Array<dmodel_t>,
        [LUMP_TYPE.LUMP_TEXINFO]: Array<texinfo_t>,
        [LUMP_TYPE.LUMP_TEXDATA]: Array<texdata_t>,
        [LUMP_TYPE.LUMP_NODES]: Array<dnode_t>,
        [LUMP_TYPE.LUMP_LEAFS]: Array<dleaf_t>,
        [LUMP_TYPE.LUMP_LEAFFACES]: Array<dleafface_t>,
    }
} {
    let dheader = read_dheader(buf)
    
    let lumps = {
        [LUMP_TYPE.LUMP_PLANES]: readLumpArray<dplane_t>(buf, dheader, LUMP_TYPE.LUMP_PLANES, read_dplane),
        [LUMP_TYPE.LUMP_VERTEXES]: readLumpArray<Vector>(buf, dheader, LUMP_TYPE.LUMP_VERTEXES, read_Vector),
        [LUMP_TYPE.LUMP_EDGES]: readLumpArray<dedege_t>(buf, dheader, LUMP_TYPE.LUMP_EDGES, read_dedge),
        [LUMP_TYPE.LUMP_SURFEDGES]: readLumpArray<dsurfedege_t>(buf, dheader, LUMP_TYPE.LUMP_SURFEDGES, read_dsurfedege),
        [LUMP_TYPE.LUMP_FACES]: readLumpArray<dface_t>(buf, dheader, LUMP_TYPE.LUMP_FACES, read_dface),
        [LUMP_TYPE.LUMP_ORIGINALFACES]: readLumpArray<dface_t>(buf, dheader, LUMP_TYPE.LUMP_ORIGINALFACES, read_dface),
        [LUMP_TYPE.LUMP_MODELS]: readLumpArray<dmodel_t>(buf, dheader, LUMP_TYPE.LUMP_MODELS, read_dmodel),
        [LUMP_TYPE.LUMP_TEXINFO]: readLumpArray<texinfo_t>(buf, dheader, LUMP_TYPE.LUMP_TEXINFO, read_texinfo),
        [LUMP_TYPE.LUMP_TEXDATA]: readLumpArray<texdata_t>(buf, dheader, LUMP_TYPE.LUMP_TEXDATA, read_texdata),
        [LUMP_TYPE.LUMP_NODES]: readLumpArray<dnode_t>(buf, dheader, LUMP_TYPE.LUMP_NODES, read_dnode),
        [LUMP_TYPE.LUMP_LEAFS]: readLumpArray<dleaf_t>(buf, dheader, LUMP_TYPE.LUMP_LEAFS, read_dleaf),
        [LUMP_TYPE.LUMP_LEAFFACES]: readLumpArray<dleafface_t>(buf, dheader, LUMP_TYPE.LUMP_LEAFFACES, read_dleafface),
    }

    return { HEADER_LUMPS, dheader, lumps }
}

export type meshrep = {
    vertices: Array<Vector>,
    indices: Array<int>
}

export function facesToMesh(bsp: BSPFile, model: dmodel_t, angles: Vector = {x:0, y:0, z:0},origin: Vector = {x:0, y:0, z:0}): Array<meshrep> {
    let meshes = []

    let allFaces = bsp.getLump<dface_t>(LUMP_TYPE.LUMP_FACES)
    let allSurfEdges = bsp.getLump<dsurfedege_t>(LUMP_TYPE.LUMP_SURFEDGES)
    let allEdges = bsp.getLump<dedege_t>(LUMP_TYPE.LUMP_EDGES)
    let allVerticies = bsp.getLump<Vector>(LUMP_TYPE.LUMP_VERTEXES)
    let allTexInfos = bsp.getLump<texinfo_t>(LUMP_TYPE.LUMP_TEXINFO)
    let allTexDatas = bsp.getLump<texdata_t>(LUMP_TYPE.LUMP_TEXDATA)

    let faces = allFaces.slice(model.firstface, model.firstface + model.numfaces)

    for(let face of faces) {

        let texinfo = allTexInfos[face.texinfo]
        let texdata = allTexDatas[texinfo.texdata]

        if(hasFlag(texinfo.flags, TexFlags.SURF_NOPORTAL |
            TexFlags.SURF_TRIGGER |
            TexFlags.SURF_NODRAW |
            TexFlags.SURF_HINT |
            TexFlags.SURF_SKIP |
            TexFlags.SURF_HITBOX |
            TexFlags.SURF_SKY)) {
                // console.log('skipping surf ' + texinfo.flags)
                continue
        }

        // if(face.dispinfo < 0) continue

        let rep =  {
            indices: [],
            vertices: [],
        }

        let surfegdes = allSurfEdges.slice(face.firstedge, face.firstedge + face.numedges)
        let faceEdges = surfegdes.map(surfEdge => surfEdge < 0 ? allEdges[Math.abs(surfEdge)].reverse() : allEdges[Math.abs(surfEdge)])

        for(let verts of faceEdges) 
            rep.vertices.push(allVerticies[verts[0]])

        for(let i = 0; i < ((rep.vertices.length - 2) * 3) / 3; i++)
            rep.indices.push(0, 1 + i, 2 + i)

        meshes.push(rep)
    }

    // console.log(meshes)

    return meshes
}

export function modelToMesh(bsp: BSPFile): Array<meshrep> {
    let meshes = []

    let models = bsp.getLump<dmodel_t>(LUMP_TYPE.LUMP_MODELS)

    // World
    meshes.push(...facesToMesh(bsp, models[0], {x: 0, y:0, z:0}, {x: 0, y:0, z:0}))

    return meshes
}
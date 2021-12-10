import { BSPFile } from './parsers/bsp.class'
import { ThreeWorld } from './render/threejs/threeworld';
import { meshrep, modelToMesh } from './types/bsp.type';
import { LUMP_TYPE } from './types/bsp/lump_type.enum';
import { GetFile, int, logHex } from './types/util'

;(async () => {
    let bspfile = new BSPFile()

    let testbsp = await GetFile('./maps/de_inferno.bsp')

    bspfile.from(testbsp)
    
    let world = new ThreeWorld()

    world.pushBSP(bspfile)

    console.log(bspfile.getLump(LUMP_TYPE.LUMP_LEAFFACES))

    // @ts-ignore
    window.bspfile = bspfile; window.world = world
})()

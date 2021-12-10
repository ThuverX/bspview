import { FileBuffer } from "../FileBuffer";
import { float, int, assert } from "../util"

export type texinfo_t = ReturnType<typeof read_texinfo>
export function read_texinfo(buf: FileBuffer): {
	textureVecs: [[float, float, float, float], [float, float, float, float]],
	lightmapVecs: [[float, float, float, float], [float, float, float, float]],
	flags: int,
	texdata: int
} {
    let p = buf.getPointer()

    let textureVecs: [[float, float, float, float], [float, float, float, float]] = [[buf.float(),buf.float(),buf.float(),buf.float()],[buf.float(),buf.float(),buf.float(),buf.float()]]
    let lightmapVecs: [[float, float, float, float], [float, float, float, float]] = [[buf.float(),buf.float(),buf.float(),buf.float()],[buf.float(),buf.float(),buf.float(),buf.float()]]
    let flags = buf.int32()
    let texdata = buf.int32()

    assert(buf.getPointer() - p == 72, 'texinfo_t wrong size: ' + (buf.getPointer() - p))

    return {textureVecs, lightmapVecs, flags, texdata}
}
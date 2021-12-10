import { FileBuffer } from "../FileBuffer"
import { assert, byte, float, int, short } from "../util"

export type dface_t = ReturnType<typeof read_dface>
export function read_dface(buf: FileBuffer):
{
	planenum: short,
	side: byte,
	onNode: byte,
	firstedge: int,
	numedges: short,
	texinfo: short,
	dispinfo: short,
	surfaceFogVolumeID: short,
	styles: int,
	lightofs: int,
	area: float,
	LightmapTextureMinsInLuxels: [int, int],
	LightmapTextureSizeInLuxels: [int, int],
	origFace: int,
	numPrims: short,
	firstPrimID: short,
	smoothingGroups: int
} {
	let p = buf.getPointer()

    let planenum = buf.uint16()
	let side = buf.byte()
	let onNode = buf.byte()
	let firstedge = buf.int32()
	let numedges = buf.int16()
	let texinfo = buf.int16()
	let dispinfo = buf.int16()
	let surfaceFogVolumeID = buf.int16()
	let styles = buf.int32()
	let lightofs = buf.int32()
	let area = buf.float()
	let LightmapTextureMinsInLuxels: [int, int] = [buf.int32(), buf.int32()]
	let LightmapTextureSizeInLuxels: [int, int] = [buf.int32(), buf.int32()]
	let origFace = buf.int32()
	let numPrims = buf.uint16()
	let firstPrimID = buf.uint16()
	let smoothingGroups = buf.uint32()

	assert(buf.getPointer() - p == 56, 'dface_t wrong size: ' + (buf.getPointer() - p))

    return { planenum, side, onNode, firstedge, numedges, texinfo, dispinfo, surfaceFogVolumeID, styles, lightofs, area, LightmapTextureMinsInLuxels, LightmapTextureSizeInLuxels, origFace, numPrims, firstPrimID, smoothingGroups }
}
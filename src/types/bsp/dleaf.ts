import { FileBuffer } from "../FileBuffer"
import { assert, int, short } from "../util"

export type dleaf_t = ReturnType<typeof read_dleaf>
export function read_dleaf(buf: FileBuffer): {
	contents: int,
	cluster: short,
	area: short,
	flags: short,
	mins: [short, short, short],
	maxs: [short, short, short],
	firstleafface: short,
	numleaffaces: short,
	firstleafbrush: short,
	numleafbrushes: short,
	leafWaterDataID: short
} {
	let p = buf.getPointer()

    let contents = buf.int32()
	let cluster = buf.int16()
	let area = buf.int16()
	let flags = buf.int16()
	let mins: [short, short, short] = [buf.int16(), buf.int16(), buf.int16()]
	let maxs: [short, short, short] = [buf.int16(), buf.int16(), buf.int16()]
	let firstleafface = buf.uint16()
	let numleaffaces = buf.uint16()
	let firstleafbrush = buf.uint16()
	let numleafbrushes = buf.uint16()
	let leafWaterDataID = buf.int16()

	assert(buf.getPointer() - p == 32, 'dleaf_t wrong size: ' + (buf.getPointer() - p))

    return { contents, cluster, area, flags, mins, maxs, firstleafface, numleaffaces, firstleafbrush, numleafbrushes, leafWaterDataID }
}
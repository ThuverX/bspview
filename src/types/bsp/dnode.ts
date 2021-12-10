import { FileBuffer } from "../FileBuffer"
import { assert, int, short } from "../util"

export type dnode_t = ReturnType<typeof read_dnode>
export function read_dnode(buf: FileBuffer): {
	planenum: int,
	children: [int, int]
	mins: [short, short, short],
	maxs: [short, short, short],
	firstface: short,
	numfaces: short,
	area: short,
	paddding: short
} {
	let p = buf.getPointer()

    let planenum = buf.int32()
	let children: [int, int] = [buf.int32(), buf.int32()]
	let mins: [short, short, short] = [buf.int16(), buf.int16(), buf.int16()]
	let maxs: [short, short, short] = [buf.int16(), buf.int16(), buf.int16()]
	let firstface = buf.uint16()
	let numfaces = buf.uint16()
	let area = buf.int16()
	let paddding = buf.int16()

	assert(buf.getPointer() - p == 32, 'dnode_t wrong size: ' + (buf.getPointer() - p))

    return { planenum, children, mins, maxs, firstface, numfaces, area, paddding }
}
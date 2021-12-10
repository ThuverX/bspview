import { FileBuffer } from "../FileBuffer"
import { int, short } from "../util"
import { read_Vector, Vector } from "./Vector";

export type dmodel_t = ReturnType<typeof read_dmodel>
export function read_dmodel(buf: FileBuffer): {
    mins: Vector,
    maxs: Vector,
	origin: Vector,
	headnode: int,
	firstface: int,
    numfaces: int
}{
    let mins = read_Vector(buf)
    let maxs = read_Vector(buf)
	let origin = read_Vector(buf)
	let headnode = buf.int32()
	let firstface = buf.int32()
    let numfaces = buf.int32()

    return { mins, maxs, origin, headnode, firstface, numfaces}
}
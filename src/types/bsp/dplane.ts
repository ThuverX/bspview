import { FileBuffer } from "../FileBuffer"
import { assert, float, int } from "../util"
import { read_Vector, Vector } from "./Vector"

export type dplane_t = ReturnType<typeof read_dplane>
export function read_dplane(buf: FileBuffer): {
    normal: Vector,
	dist: float,
	type: int,
} {
    let p = buf.getPointer()

    let normal = read_Vector(buf)
    let dist = buf.float()
    let type = buf.int32()

    assert(buf.getPointer() - p == 20, 'dplane_t wrong size: ' + (buf.getPointer() - p))

    return { normal, dist, type }
}
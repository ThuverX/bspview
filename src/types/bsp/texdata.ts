import { FileBuffer } from "../FileBuffer";
import { int } from "../util"
import { read_Vector, Vector } from "./Vector";

export type texdata_t = ReturnType<typeof read_texdata>
export function read_texdata(buf: FileBuffer): {
	reflectivity: Vector,
	nameStringTableID:int,
	width: int,
	height: int,
    view_width: int,
    view_height: int
} {

    let reflectivity = read_Vector(buf)
    let nameStringTableID = buf.int32()
    let width = buf.int32()
    let height = buf.int32()
    let view_width = buf.int32()
    let view_height = buf.int32()

    return { reflectivity, nameStringTableID, width, height, view_width, view_height }
}
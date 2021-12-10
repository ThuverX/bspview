import { FileBuffer } from "../FileBuffer"
import { float } from "../util"

export type Vector = ReturnType<typeof read_Vector>
export function read_Vector(buf: FileBuffer): {
    x: float,
    y: float,
    z: float
} {
    let x = buf.float()
    let y = buf.float()
    let z = buf.float()

    return { x, y, z }
}


import { FileBuffer } from "../FileBuffer"
import { short } from "../util"

export type dedege_t = ReturnType<typeof read_dedge>
export function read_dedge(buf: FileBuffer): [
    short, short
] {
    let edgeA = buf.uint16()
    let edgeB = buf.uint16()

    return [edgeA, edgeB]
}
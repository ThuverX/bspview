import { FileBuffer } from "../FileBuffer"
import { int } from "../util"

export type dleafface_t = ReturnType<typeof read_dleafface>
export function read_dleafface(buf: FileBuffer) : int {
    return buf.uint16()
}
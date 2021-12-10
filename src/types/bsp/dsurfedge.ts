import { FileBuffer } from "../FileBuffer"
import { int } from "../util"

export type dsurfedege_t = ReturnType<typeof read_dsurfedege>
export function read_dsurfedege(buf: FileBuffer) : int {
    return buf.int32()
}
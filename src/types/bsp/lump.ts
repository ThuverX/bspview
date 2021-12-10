import { FileBuffer } from "../FileBuffer"
import { int } from "../util"

export type lump_t = ReturnType<typeof read_lump>
export function read_lump(buf: FileBuffer): {
    fileofs: int
	filelen: int
	version: int
	fourCC: int
} {
    let fileofs = buf.int32()
    let filelen = buf.int32()
    let version = buf.int32()
    let fourCC = buf.int32()

    return { fileofs, filelen, version, fourCC }
}
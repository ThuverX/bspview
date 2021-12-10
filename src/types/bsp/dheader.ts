import { HEADER_LUMPS, IDBSPHEADER } from "../bsp.type"
import { FileBuffer } from "../FileBuffer"
import { assert, FixedLengthArray, int, readArray } from "../util"
import { lump_t, read_lump } from "./lump"

export type dheader_t = ReturnType<typeof read_dheader>
export function read_dheader(buf: FileBuffer): {
    ident: int
	version: int
	lumps: FixedLengthArray<lump_t, HEADER_LUMPS>
	mapRevision: int
} {
    let ident = buf.int32()
    assert(ident == IDBSPHEADER, 'Wrong header ident: ' + ident)

    let version = buf.int32()
    let lumps = readArray<lump_t>(buf, read_lump, HEADER_LUMPS)
    let mapRevision = buf.int32()

    return { ident, version, mapRevision,
        lumps: lumps as any,
    }
}

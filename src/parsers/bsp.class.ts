import { bsp_t, read_bsp } from '../types/bsp.type'
import { dheader_t } from '../types/bsp/dheader'
import { LUMP_TYPE } from '../types/bsp/lump_type.enum'
import { Endianness, FileBuffer } from '../types/FileBuffer'

export class BSPFile {

    private fb: FileBuffer = new FileBuffer().setEndianness(Endianness.LITTLE)
    private data: bsp_t

    from(data: Buffer): void {
        this.fb.from(data)
        this.data = read_bsp(this.fb)
    }

    getData(): bsp_t {
        return this.data
    }

    getHeader(): dheader_t {
        return this.data.dheader
    }

    getLump<T>(type: LUMP_TYPE) : Array<T> {
        if(!this.data.lumps[type]) throw `Lumptype ${type} not implemented`
        return this.data.lumps[type]
    }
}
import { asHex, float, int } from "./util"

export enum Endianness {
    LITTLE = "LE",
    BIG = "BE"
}

export class FileBuffer {

    private buf: Buffer
    private pointer: int = 0
    private endianness: Endianness = Endianness.BIG

    private DEBUG = false

    constructor(buf?: Buffer) {
        if(buf) this.buf = buf

        if(this.DEBUG) {
            let self = this
            // @ts-ignore
            for(let [name, ofunc] of Object.entries(this.__proto__) as [string, Function]) {
                this[name] = function() {
                    let ret = ofunc.apply(this, arguments)

                    if(ret != this) console.log(`${asHex(self.pointer)} (${((self.pointer / self.buf.length) * 100).toFixed(2)}%): ${name}(${[...arguments as any].join(',')}) =>`, ret)

                    return ret
                }
            }
        }
    }

    from(buf: Buffer) {
        this.buf = buf

        return this
    }

    setPointer(amount: int) {
        this.pointer = amount
        return this
    }

    seek(amount: int) {
        this.pointer += amount
        return this
    }

    setEndianness(value: Endianness) {
        this.endianness = value
        return this
    }

    getPointer() : int {
        return this.pointer
    }

    int32(): int {
        let ret: int = this.buf['readInt32' + this.endianness](this.pointer)
        this.seek(4)
        return ret
    }

    uint32(): int {
        let ret: int = this.buf['readUInt32' + this.endianness](this.pointer)
        this.seek(4)
        return ret
    }

    int16(): int {
        let ret: int = this.buf['readInt16' + this.endianness](this.pointer)
        this.seek(2)
        return ret
    }

    uint16(): int {
        let ret: int = this.buf['readUInt16' + this.endianness](this.pointer)
        this.seek(2)
        return ret
    }

    byte(): int {
        let ret: int = this.buf[this.pointer]
        this.seek(1)
        return ret
    }

    float() : float {
        let ret: float = this.buf['readFloat' + this.endianness](this.pointer)
        this.seek(4)
        return ret
    }
}
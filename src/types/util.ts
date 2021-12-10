import { Buffer } from "buffer"
import { TexFlags } from "./bsp/texflags.enum"
import { FileBuffer } from "./FileBuffer"

export type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> =
  Pick<TObj, Exclude<keyof TObj, typeof Array>>
  & {
    readonly length: L 
    [ I : number ] : T
    [Symbol.iterator]: () => IterableIterator<T>   
  }

export type int = number
export type float = number
export type short = number
export type byte = number

export function assert(condition: boolean, message: string) {
  if(!condition) throw message
}

export function asHex(num: number) {
  return '0x' +  ('0000000' + num.toString(16).toUpperCase()).slice(-8)
}

export function logHex(num: number) {
  console.log(asHex(num))
}

export function hasFlag(input: int, flag: int): boolean {
  return !!(input & flag)
}

export function readArray<T>(buf: FileBuffer, readFunc: Function, amount?: number, start?: number, length?: number): Array<T> {
  let items: Array<T> = []
  if(amount) {
    for(let i = 0; i < amount; i++) items.push(readFunc(buf))
  }
  if(start) buf.setPointer(start)
  if(start && length) {
    while(buf.getPointer() < start + length) {items.push(readFunc(buf))}
  }
  return items
}

function toBuffer(ab: ArrayBuffer) {
  let buf = Buffer.alloc(ab.byteLength)
  let view = new Uint8Array(ab)
  for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i]
  }
  return buf
}

export async function GetFile(path: string) : Promise<Buffer> {
  if(!window) return;

  return toBuffer(await (await fetch(path)).arrayBuffer())
}
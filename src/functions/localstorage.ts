
import { StorageProvider, Exportable } from "../types";

class LocalStorageProvider implements StorageProvider,Exportable  {
    #prefix: string
    constructor(prefix: string) {
        this.#prefix = prefix
    }
    async Get(key: string): Promise<any> {
        let value = localStorage.getItem(this.concat(key))
        if (!value) {
            // throw Error("valuer by key is not found")
            return value
        }
        return this.unwrap(value)
    }
    async Set(key: string, value: any): Promise<void> {
        return localStorage.setItem(this.concat(key), this.wrap(value))
    }

    async Export(): Promise<any[]> {
        return Object.keys(localStorage)
            .filter(x => {
                console.log(x)
                return x.startsWith(this.#prefix)
            })
            .flatMap((value) => {
                return this.unwrap(value)
            })
    }
    async Import(values:any[]):Promise<void> {
        let promises:any = []
        values.forEach((value:{id:string})=>{
            let promise = this.Set(this.concat(value.id),this.wrap(value))
            promises.push(promise)
        })
        await Promise.all(promises)
    }
    clear(): Promise<void> {
        Object.keys(localStorage)
            .filter(x =>
                x.startsWith(this.#prefix))
            .forEach(x =>
                localStorage.removeItem(x))
        return
    }
    concat(key: string): string {
        return `${this.#prefix}_${key}`
    }
    wrap(value: any): string {
        return JSON.stringify(value)
    }
    unwrap(value: string): any {
        return JSON.parse(value)
    }
}
export function NewLocalStorageProvider(prefix: string): StorageProvider & Exportable {
    return new LocalStorageProvider(prefix)
}
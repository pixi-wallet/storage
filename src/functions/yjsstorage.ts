
import { StorageProvider, Exportable, IStorage } from "../types";
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { fromUint8Array, toUint8Array } from 'js-base64'
import { QueryContent2020, WalletContent2020 } from "@pixi-wallet/components";

interface Didable {
    id: string;
    [name: string]: any;
}
export class YJSStorageProvider implements IStorage {
    #storeName: string
    private ydoc: Y.Doc
    private indexeddbProvider: any
    private ready: Promise<boolean>

    constructor(storeName: string) {
        this.#storeName = storeName
        this.ydoc = new Y.Doc()
        this.indexeddbProvider = new IndexeddbPersistence(storeName, this.ydoc)
        this.ready = new Promise((resolve) => {
            this.indexeddbProvider.on('synced', () => {
                // log('content from the database is loaded')
                resolve(true)
            })
        })

    }

    async IsReady(): Promise<boolean> {
        return this.ready
    }

    getContents(): Y.Array<any> {
        return this.ydoc.getArray("contents")
    }

    async Contents(): Promise<any[]> {
        let contents = this.getContents().toArray()
        return contents
    }

    async Get(contentId: string): Promise<any> {
        let result = this.getContents().toArray().find((value: Didable) => {
            return value.id == contentId
        })
        return result
    }

    async Query(opts: QueryContent2020): Promise<any[]> {
        if (opts.type == "Predicate" &&  typeof opts.credentialQuery === "function") {
            return (await this.Contents()).filter(opts.credentialQuery)
        }
        throw Error(`query By ${opts} is not implemented`)
    }
    
    async Put(content: WalletContent2020): Promise<void> {
        return this.getContents().push([content])
    }
    
    async Remove(contentId:string): Promise<WalletContent2020|void> {
        let index = this.getContents().toArray().findIndex((value:Didable)=>{
            return value.id == contentId
        })
        if (index == -1) {
            return 
        }
        let value = this.getContents().get(index)
        this.getContents().delete(index, 1)
        return value
    }

    async Batch(contents: WalletContent2020[]): Promise<void> {
        return this.getContents().push(contents)
    }

    async Export(): Promise<string> {
        const documentState = Y.encodeStateAsUpdate(this.ydoc)
        return fromUint8Array(documentState)
    }

    async Import(value: string): Promise<void> {
        const documentState = toUint8Array(value)
        Y.applyUpdate(this.ydoc, documentState)
        return
    }

    async Clear(): Promise<void> {
        await this.indexeddbProvider.clearData()
        this.ydoc.destroy()
        return
    }

    async Close(): Promise<void> {
        this.ydoc.destroy()
        return
    }
}

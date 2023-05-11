export interface StorageProvider {
    Set(key:string, value:any):Promise<void>
    Get(key:string):Promise<any>
}

interface Id {
    id: string
    [name:string]:any
}

export interface IStorage {
    IsReady():Promise<boolean>
    Get(contentId:string):Promise<any>
    Put(content:Id):Promise<void>
    Remove(contentId:string):Promise<any>
    Query(opts:any):Promise<any>
    Clear():Promise<void>
    Close():Promise<void>
    Contents():Promise<any[]>
    Import(blob:string):Promise<void>
    Export():Promise<string>
}

export interface Exportable {
    Import(blob: any[]): Promise<void>
    Export(): Promise<any[]>
}

export type RequestType = "Add" | "Query" | "Remove"

export interface Message {
    id: string // uuid
    type: string // https://pixie.io/doppler-clone
    sender?: string
    reciver?: string
    payload: string
    reqType?: RequestType
}

export interface CollectionManager {
    Add(req: Message): void
    Query(req: Message): Message
    Remove(req: Message): Message
}
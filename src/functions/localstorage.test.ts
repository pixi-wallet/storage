import 'localstorage-polyfill'
import { NewLocalStorageProvider } from './localstorage'
import { Exportable } from '../types';

interface Didable {
    id: string;
    [name: string]: any;
}

describe("test localstorage",  ()=>{
    const features:Didable[] = [
        {
            id:"test:1",
            value:"test1"
        },
        {
            id:"test:2",
            value:"test2"
        },
        {
            id:"test:3",
            value:"test3"
        }
    ]
    test("new storage", async()=>{
       let lsp =  NewLocalStorageProvider("test1")
       features.forEach(async (value)=>{
            await lsp.Set(value.id, value)
       })

       let value:Didable = await lsp.Get(features[1].id)
       expect(value.id).toBe(features[1].id)
       expect(localStorage.length).toBe(features.length)
       localStorage.setItem("wrong", "wrong")
       expect(localStorage.length).not.toBe(features.length)
    
    })
})
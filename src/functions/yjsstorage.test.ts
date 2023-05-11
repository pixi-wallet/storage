import { WalletContent2020 } from "@pixi-wallet/components";
import { YJSStorageProvider } from "./yjsstorage";

import "fake-indexeddb/auto";


describe("yjs storage provider", () => {
    const features: WalletContent2020[] = [
        {
            id: "test:1",
            type: "test",
            name: "test",
            value: "test1"
        },
        {
            id: "test:2",
            type: "test",
            name: "test",
            value: "test2"
        },
        {
            id: "test:3",
            type: "test",
            name: "test",
            value: "test3"
        }
    ]
    test("yjs storage export and import", async () => {
        let yjss = new YJSStorageProvider("test")
        let ready = await yjss.IsReady()
        expect(ready).toBe(true)
        let rv = features[1]
        let promises:Promise<void>[] = []
        features.forEach((value)=>{
            let prom = yjss.Put(value)
            promises.push(prom)
        })
        await Promise.all(promises)
        let value2: WalletContent2020 = await yjss.Get(rv.id)

        expect(value2).not.toBeUndefined()
        // console.log("value2", value2)

        expect(rv.id).toBe(value2.id)
        const blob = await yjss.Export()

        // console.log("blob", blob)
        let yjss2 = new YJSStorageProvider("test2")
        await yjss2.Import(blob)

        let value3: WalletContent2020 = await yjss2.Get(rv.id)

        expect(value3).not.toBeUndefined()
        // console.log("value3", value3)

        expect(rv.id).toBe(value3.id)

    })

    test("init yjs clear database", async () => {
        let yjss = new YJSStorageProvider("test")
        let ready = await yjss.IsReady()
        expect(ready).toBe(true)
        let rv = features[1]
        let promises:Promise<void>[] = []
        features.forEach((value)=>{
            let prom = yjss.Put(value)
            promises.push(prom)
        })
        await Promise.all(promises)
        let value2: WalletContent2020 = await yjss.Get(rv.id)

        expect(value2).not.toBeUndefined()
       
        expect(rv.id).toBe(value2.id)
        const blob = await yjss.Export()

        // console.log("blob", blob)
        let yjss2 = new YJSStorageProvider("test")
        await yjss2.IsReady()
        // await yjss2.Import(blob)

        let value3: WalletContent2020 = await yjss2.Get(rv.id)

        expect(value3).not.toBeUndefined()
        // console.log("value3", value3)

        expect(rv.id).toBe(value3.id)

        await yjss.Close()
        await yjss2.Clear()

        let yjss3 = new YJSStorageProvider("test")
        await yjss3.IsReady()
        let value4: WalletContent2020 = await yjss3.Get(rv.id)

        expect(value4).toBeUndefined()
    })

    test("query storage", async ()=>{
        let yjss = new YJSStorageProvider("test4")
        let ready = await yjss.IsReady()
        expect(ready).toBe(true)
        let rv = features[1]
        let promises:Promise<void>[] = []
        features.forEach((value)=>{
            let prom = yjss.Put(value)
            promises.push(prom)
        })
        await Promise.all(promises)
        let QueryRequestByType = {
            type: "Predicate",
            credentialQuery: (value) => {
                return value.type == "test"
            },
        }
        let contentsByType: WalletContent2020[] = await yjss.Query(QueryRequestByType)

        expect(contentsByType).not.toBeUndefined()

        expect(contentsByType.length).toBe(features.length)

        let QueryRequestById = {
            type: "Predicate",
            credentialQuery: (value) => {
                return value.id == "test:1"
            },
        }
        let contentsById: WalletContent2020[] = await yjss.Query(QueryRequestById)

        expect(contentsById).not.toBeUndefined()

        expect(contentsById.length).toBe(1)
    })

})
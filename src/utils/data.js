import * as firebase from "firebase";
import store from "store";

export const fetchFirebase = async () => {
    console.log('fetching firebase')
    let data = await firebase.firestore().doc(`data/${store.get('email')}`).get()
    data = JSON.parse(data.data().data)
    if(data){
        store.clearAll()
        Object.keys(data).forEach(key=>{
            store.set(key, data[key])
        })
    }
    return {}
}

export const saveFirebase = async () => {
    console.log('saving firebase')
    let storeData = {}
    store.each((value, key)=>{
        storeData[key] = value
    })
    firebase.firestore().doc(`data/${store.get("email","temp")}`).set({"data":JSON.stringify(storeData)})
}
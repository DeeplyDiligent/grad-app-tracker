import * as React from 'react';
import {useState} from 'react';
import * as firebase from "firebase/app";
import 'firebase/firestore'
import store from 'store';

export const FetchFromFirebase = ({}) => {
    const [text, setText] = useState("Fetch")

    const fetch = async () => {
        let data = await firebase.firestore().doc(`data/${store.get('email')}`).get()
        data = JSON.parse(data.data().data)
        if(data){
            store.clearAll()
            Object.keys(data).forEach(key=>{
                store.set(key, data[key])
            })
            console.log(data)
            setText("✔")
            window.setTimeout(() => setText("Fetch"), 1000)
        }
    }
    return (
        <div className="underline cursor-pointer" onClick={fetch}>
            {text}
        </div>
    );
};
import * as React from 'react';
import store from "store";
import * as firebase from "firebase/app";
import 'firebase/firestore'
import {useState} from "react";

export const SaveAll = ({}) => {
    const [text, setText] = useState("Save")
    const saveAll = () => {
        let storeData = {}
        store.each((value, key)=>{
            storeData[key] = value
        })
        firebase.firestore().doc(`data/${store.get("email","temp")}`).set({"data":JSON.stringify(storeData)}).then(x=>{
            setText("✔")
            window.setTimeout(() => setText("Save"), 1000)
        })

    }
    return (
        <div className="underline cursor-pointer mx-5" onClick={saveAll}>
            {text}
        </div>
    );
};
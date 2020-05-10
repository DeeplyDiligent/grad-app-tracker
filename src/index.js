import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyC58zVjlERKBjX0MBQu9Z2rVTeqBPGnLrA",
    authDomain: "grad-app-f3513.firebaseapp.com",
    databaseURL: "https://grad-app-f3513.firebaseio.com",
    projectId: "grad-app-f3513",
    storageBucket: "grad-app-f3513.appspot.com",
    messagingSenderId: "707553692025",
    appId: "1:707553692025:web:bf49fb14da3defd7efc7a8",
    measurementId: "G-YV8PE3K9D1"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

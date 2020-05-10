import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import store from "store";
import {fetchFirebase} from "../utils/data";

const Home = () => {
    const [userEmail, setUserEmail] = useState("")
    const [textbox, setTextbox] = useState("")
    useEffect(() => {
        setUserEmail(store.get("email"))
    }, [])
    const setEmail = () => {
        store.set("email", textbox)
        setUserEmail(textbox)
        fetchFirebase()
    }
    if (!userEmail) return <div className="text-center">
        <input
            className="bg-white shadow-md focus:outline-0 border border-transparent text-lg placeholder-gray-600 rounded-lg p-2 mr-4"
            placeholder="Email" onChange={e => setTextbox(e.target.value)}/>
        <button className="rounded-lg p-3 bg-teal-500 hover:bg-teal-600
                    md:text-lg xl:text-base text-white font-semibold leading-tight shadow-md"
                onClick={setEmail}>
            Get Started
        </button>
    </div>
    return (
        <div className="text-center justify-center">
            <b>Select the website:</b>
            <Link to="/gradconnection">Gradconnection</Link>
            <Link to="/gradaustralia">GradAustralia</Link>
            <Link to="/gethighered">GetHighered</Link>
            <a href="https://trello.com/c/ibM3NXhz/152-to-be-constantly-checked">To be constantly checked</a>
        </div>
    );
};

export default Home;

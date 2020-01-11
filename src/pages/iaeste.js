import React, {Component, useState, useEffect, useRef} from "react";
import store from "store";
import Moment from "react-moment";
import {getHigheredKey} from "../utils/keys";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH, faEllipsisV} from "@fortawesome/free-solid-svg-icons";
import {SketchPicker, GithubPicker} from "react-color";
import Program from "../components/program";

const Iaeste = () => {
    const [listPrograms, setListPrograms] = useState([]);
    const [currentPage, setPage] = useState(1);
    const [noPrograms, setNoPrograms] = useState("");
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState("start");
    const [token, setToken] = useState("");

    const inputEl = useRef(null);

    const pages = [1];
    const sortTypes = ["start", "end"];
    useEffect(() => {
        setListPrograms([]);
        setNoPrograms("");
        getProgramsPages(5);
    }, [currentPage, token]);

    useEffect(() => {
        setListPrograms(sortListPrograms(listPrograms, sortType));
    }, [sortType]);

    const sortListPrograms = (listPrograms, sortType) => {
        if (sortType === "start") {
            return listPrograms.sort(
                (jobA, jobB) =>
                    new Date(jobB.interval[sortType]) - new Date(jobA.interval[sortType])
            );
        } else if (sortType === "end") {
            return listPrograms
                .sort(
                    (jobA, jobB) =>
                        new Date(jobB.interval[sortType]) -
                        new Date(jobA.interval[sortType])
                )
                .reverse();
        }
    };

    const getProgramsPages = async numberOfPages => {
        let tempListPrograms = [];
        setLoading(true);
        let table = await fetch("https://cors-anywhere.herokuapp.com/https://iaeste.smartsimple.ie/userreport/ur_openreport.jsp", {
            "headers": {"content-type": "application/x-www-form-urlencoded"},
            "body": `sorttype=continue&sortdirection=desc&orderby=16_cf_1842863&curpagesize=0&page=1&ss_formtoken=${token}&reportid=25872&curpagesize=0&curpagesize=0&curpagesize=0&curpagesize=0&curpagesize=0&nextlevel=1&issection=1`,
            "method": "POST",
            "mode": "cors"
        })
        table = await table.text()
        console.log(table)
        // setNoPrograms(
        //     tempListPrograms.length == 0 ? "There are no programs on this page" : ""
        // );
        // setLoading(false);
        // setListPrograms(tempListPrograms);
    };

    const toProgram = (
        id,
        applyUrl,
        companyName,
        title,
        start,
        end,
        locations = []
    ) => ({
        id,
        applyUrl,
        companyName,
        title,
        interval: {start, end},
        locations
    });

    if (!token) return <div className="text-center">
        <div>Hello, iaeste this is a great website for overseas internships:</div>
        <div>
            <a
                href={"https://iaeste.smartsimple.ie/userreport/ur_openreport.jsp?sorttype=continue&sortdirection=desc&orderby=16_cf_1842863&curpagesize=0&page=1&reportid=25872&curpagesize=0&curpagesize=0&curpagesize=0&curpagesize=0&curpagesize=0&nextlevel=1&issection=1"}>
                By order of first opened
            </a>
        </div>
        <div>
            <a href={"https://iaeste.smartsimple.ie/userreport/ur_openreport.jsp?sorttype=continue&sortdirection=aesc&orderby=17_cf_1804592&curpagesize=0&page=1&reportid=25872&curpagesize=0&curpagesize=0&curpagesize=0&curpagesize=0&curpagesize=0&nextlevel=1&issection=1"}>
                By order of closing
            </a>
        </div>

    </div>
        ;

    return (
        <div className="text-center">
            <div className="capitalize">IAESTE - Overseas Internship Programs</div>
            <div className="flex flex-row justify-center text-sm mt-4">
                {pages
                    .filter(pageNumber => currentPage != pageNumber)
                    .map((pageNumber, index) => (
                        <span
                            key={pageNumber}
                            onClick={() => {
                                setPage(pageNumber);
                            }}>
              <span className="cursor-pointer">{pageNumber}</span>
                            {index !== pages.length - 2 ? (
                                <span className="mx-2">&bull;</span>
                            ) : (
                                false
                            )}
            </span>
                    ))}
            </div>
            <div className="flex flex-row justify-center text-sm mt-4">
                Other Sort Types:&nbsp;
                {sortTypes
                    .filter(sortTypesItem => sortType != sortTypesItem)
                    .map((sortTypesItem, index) => (
                        <span
                            key={sortTypesItem}
                            onClick={() => {
                                setSortType(sortTypesItem);
                            }}>
              <span className="cursor-pointer">{sortTypesItem}</span>
                            {index !== sortTypes.length - 2 ? (
                                <span className="mx-2">&bull;</span>
                            ) : (
                                false
                            )}
            </span>
                    ))}
            </div>
            <div className="border rounded-lg mt-4 text-sm text-left m-auto main-container">
                {noPrograms}
                {loading ? (
                    <img className="m-auto block w-32" src="load.svg"></img>
                ) : (
                    false
                )}
                {listPrograms.map(program => (
                    <Program key={program.id} dbKey={getHigheredKey} program={program}/>
                ))}
            </div>
            <div
                className="mt-4 underline cursor-pointer"
                onClick={() => {
                    if (window.confirm("Are you sure?")) {
                        store.clearAll();
                        window.location.reload();
                    }
                }}>
                Clear
            </div>
        </div>
    );
};

export default Iaeste;

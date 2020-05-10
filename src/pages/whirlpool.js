import React, {useEffect, useState} from "react";
import store from "store";
import {gradAustraliaKey} from "../utils/keys";
import Program from "../components/program";
import $ from 'jquery';

const Whirlpool = () => {
    const [listPrograms, setListPrograms] = useState([]);
    const [currentPage, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [noPrograms, setNoPrograms] = useState("");
    const [sortType, setSortType] = useState("created");
    const pages = [1, 2, 3, 4, 5];
    const sortTypes = ["created", "applications_close_date"];
    useEffect(() => {
        let whirlpoolThreads = fetch("https://whirlpool.net.au/api/?key=803895-061627-366&get=threads&forumids=136&output=json&threadcount=100");
        setListPrograms([]);
        setNoPrograms("");
        setLoading(true);
        whirlpoolThreads
            .then(x => x.json())
            .then(data => {
                let posts = data["THREADS"]
                let newListPrograms = posts.map(post => {
                    let url = `https://forums.whirlpool.net.au/thread/${post["ID"]}?p=-1#bottom`
                    return toProgram(
                        post["ID"],
                        url,
                        post["TITLE"],
                        post["LAST"]["NAME"],
                        null, post["LAST_DATE"],
                        [`Pages: ${Math.round(post["REPLIES"]/20)}`]
                    );
                });
                setListPrograms(newListPrograms);
                setLoading(false);
                setNoPrograms(
                    newListPrograms.length == 0
                        ? "There are no programs on this page"
                        : ""
                );
            });
    }, [currentPage, sortType]);

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

    return (
        <div className="text-center">
            <div className="capitalize">
                GradAustralia - Page {currentPage} Grad Programs
            </div>
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
                    <Program
                        key={program.id}
                        dbKey={gradAustraliaKey}
                        program={program}
                    />
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

export default Whirlpool;

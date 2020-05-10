import React, {useEffect, useState} from "react";
import store from "store";
import {getHigheredKey} from "../utils/keys";
import Program from "../components/program";
import {SaveAll} from "../components/saveAll";
import {FetchFromFirebase} from "../components/fetchFromFirebase";

const GetHighered = () => {
  const [listPrograms, setListPrograms] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [noPrograms, setNoPrograms] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("start");
  const pages = [1];
  const sortTypes = ["start", "end"];
  useEffect(() => {
    setListPrograms([]);
    setNoPrograms("");
    getProgramsPages(5);
  }, [currentPage]);

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
    let getHigheredPrograms;
    let nextPageToken;
    let tempListPrograms = [];
    setLoading(true)
    for (let i = 0; i < numberOfPages; i++) {
      getHigheredPrograms = await fetch(
        `https://api.gethighered.global/api/v1/posting?page_token=${
          i == 0 ? "0" : nextPageToken
        }&education_level=BACHELORS_OR_EQUIVALENT&job_set=all&session_id=1578080028548.5787.46196789226&sub_domain=monash&user_id=5cbbc5a4-d90a-4cb8-9894-9c199288f1e5`
      );
      getHigheredPrograms = await getHigheredPrograms.json();
      nextPageToken = getHigheredPrograms.nextPageToken;
      let jobs = getHigheredPrograms.matchingJobs;
      jobs = jobs.map(({ job, commuteInfo, jobSummary }) =>
        toProgram(
          job.name.split("/").reverse()[0],
          `https://monash.gethighered.global/job/${
            job.name.split("/").reverse()[0]
          }`,
          `${job.companyDisplayName} | ${job.customAttributes?.company_name?.stringValues[0]}`,
          job.title,
          job.postingPublishTime,
          job.postingExpireTime,
          job.addresses
        )
      );
      tempListPrograms = [...jobs, ...tempListPrograms];
      tempListPrograms = sortListPrograms(tempListPrograms, sortType);
    }
    setNoPrograms(
      tempListPrograms.length == 0 ? "There are no programs on this page" : ""
    );
    setLoading(false)
    setListPrograms(tempListPrograms);
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
    interval: { start, end },
    locations
  });

  return (
    <div className="text-center">
      <div className="capitalize">GetHighered - Grad Programs</div>
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
            dbKey={getHigheredKey}
            program={program}
          />
        ))}
      </div>
      <div
          className="mt-4 flex justify-around max-w-xl m-auto">
        <div className="underline cursor-pointer" onClick={() => {
          if (window.confirm("Are you sure?")) {
            store.clearAll();
            window.location.reload();
          }
        }}>Clear</div>
        <SaveAll/>
        <FetchFromFirebase/>
      </div>
    </div>
  );
};

export default GetHighered;

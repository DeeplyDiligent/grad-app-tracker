import React, { Component, useState, useEffect } from "react";
import store from "store";
import Moment from "react-moment";
import { gradAustraliaKey } from "../utils/keys";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { SketchPicker, GithubPicker } from "react-color";
import Program from "../components/program";
const GradAustralia = () => {
  const [listPrograms, setListPrograms] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [noPrograms, setNoPrograms] = useState("");
  const [sortType, setSortType] = useState("created");
  const pages = [1,2,3,4,5];
  const sortTypes = ["created", "applications_close_date"]
  useEffect(() => {
    let gradConnectPrograms = fetch(
      `https://prosple-content-api.global.ssl.fastly.net/graphql?queryId=2fba58b473b187c80084d5c0da1aa35a5e572fe0:22&operationName=SearchCareerOpportunity&variables={"gid":["6"],"index_id":"anabranch_connect_index","condition_group":{"groups":[{"conditions":[{"name":"gid","operator":"=","value":"6"},{"name":"node_type","operator":"=","value":"career_opportunity"},{"name":"published","operator":"=","value":"1"},{"name":"expired","operator":"<>","value":"1"},{"name":"inactive_organisation","operator":"<>","value":"1"}]},{"conditions":[{"name":"study_field_tids","operator":"=","value":"478"},{"name":"study_field_tids","operator":"=","value":"502"}],"conjunction":"OR","tags":["facet:study_field_tids"]},{"conditions":[{"name":"opportunity_types","operator":"=","value":"Graduate Job"}],"conjunction":"OR","tags":["facet:opportunity_types"]},{"conditions":[{"name":"locations","operator":"=","value":"796"},{"name":"locations","operator":"=","value":"9692"},{"name":"locations","operator":"=","value":"9705"},{"name":"locations","operator":"=","value":"9707"},{"name":"locations","operator":"=","value":"9708"},{"name":"locations","operator":"=","value":"9935"}],"conjunction":"OR","tags":["facet:locations"]},{"conditions":[],"conjunction":"OR","tags":["facet:industry_sectors"]}],"conjunction":"AND"},"range":{"start":${50*(currentPage-1)},"end":50},"sort":[{"field":"${sortType}","value":"asc"}],"facets":[{"field":"study_field_tids","limit":0,"operator":"OR","missing":false,"min_count":1},{"field":"opportunity_types","limit":0,"operator":"OR","missing":false,"min_count":1},{"field":"locations","limit":0,"operator":"OR","missing":false,"min_count":1},{"field":"industry_sectors","limit":0,"operator":"OR","missing":false,"min_count":1}],"filter":{"conjunction":"OR","conditions":[{"field":"vid","value":"study_field"},{"field":"vid","value":"locations"}]}}`);
    const program = setListPrograms([]);
    setNoPrograms("");
    gradConnectPrograms
      .then(x => x.json())
      .then(data => {
        let nodes = data.data.searchAPISearch.groupNodes;
        let newListPrograms = nodes.map(entity => {
          let entityInfo = entity.entityIdOfGroupContent.entity;
          let url = `https://gradaustralia.com.au/${entity.entityUrl.path
            .split("/")
            .splice(3)
            .join("/")}`;
          return toProgram(
            entityInfo.entityId,
            url,
            entityInfo.fieldParentEmployer.entity.fieldAdvertiserName,
            entityInfo.title,
            entityInfo.fieldApplicationsOpenDate
              ? entityInfo.fieldApplicationsOpenDate.date.split(" ")[0]
              : null,
            entityInfo.fieldApplicationsCloseDate
              ? entityInfo.fieldApplicationsCloseDate.date.split(" ")[0]
              : null,
            entityInfo.fieldLocationDescription?.split(", ") || []
          );
        });
        setListPrograms(newListPrograms);
        setNoPrograms(newListPrograms.length==0?"There are no programs on this page":"")
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
    interval: { start, end },
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
        Other Sort Types:&nbsp;{sortTypes
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
      <div
        className="border rounded-lg mt-4 text-sm text-left m-auto main-container">
          {noPrograms}
        {listPrograms.map(program => (
          <Program key={program.id} dbKey={gradAustraliaKey} program={program} />
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

export default GradAustralia;

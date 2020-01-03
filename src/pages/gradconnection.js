import React, { Component, useState, useEffect } from "react";
import store from "store";
import Moment from "react-moment";
import { gradConnectionKey } from "../utils/keys";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { SketchPicker, GithubPicker } from "react-color";
import Program from "../components/program";
const GradConnection = () => {
  const [listPrograms, setListPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [degreeName, setDegreeName] = useState("computer-science");
  const allDegrees = [
    "computer-science",
    "information-systems",
    "cyber-security",
    "banking-and-finance",
    "information-technology"
  ];
  useEffect(() => {
    let gradConnectPrograms = fetch(
      `https://cors-anywhere.herokuapp.com/https://au.gradconnection.com/api/campaigngroups/?job_type=graduate-jobs&disciplines=${degreeName}&offset=0&limit=100&ordering=-recent_job_created`
    );
    setListPrograms([]);
    setLoading(true)
    let newListPrograms = [];
    gradConnectPrograms
      .then(x => x.json())
      .then(data => {
        data.map((employer, index) => {
          employer.campaigns.forEach((campaign, index) => {
            campaign["employerslug"] = employer.customer_organization.slug;
            campaign["companyName"] = employer.customer_organization.name;
          });
          newListPrograms.push(...employer.campaigns);
        });
        setListPrograms(newListPrograms);
        setLoading(false);
      });
  }, [degreeName]);

  return (
    <div className="text-center">
      <div className="capitalize">
        Grad Connection - {degreeName.replace("-", " ")} Grad Programs
      </div>
      <div className="flex flex-row justify-center text-sm mt-4">
        {allDegrees
          .filter(degree => degreeName != degree)
          .map((degree, index) => (
            <span
              key={degree}
              onClick={() => {
                setDegreeName(degree);
              }}>
              <span className="cursor-pointer">{degree}</span>
              {index !== allDegrees.length - 2 ? (
                <span className="mx-2">&bull;</span>
              ) : (
                false
              )}
            </span>
          ))}
      </div>
      <div
        className="border rounded-lg mt-4 text-sm text-left m-auto main-container">
        {loading ? (
          <img className="m-auto block w-32" src="load.svg"></img>
        ) : (
          false
        )}
        {listPrograms.map(program => (
          <Program dbKey={gradConnectionKey} key={program.id} program={program} />
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

export default GradConnection;

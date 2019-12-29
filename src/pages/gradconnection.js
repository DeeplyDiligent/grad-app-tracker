import React, { Component, useState, useEffect } from "react";
import Store from "store";
import Moment from "react-moment";
import { gradConnectionKey } from "../utils/keys";
const GradConnection = () => {
  const [listPrograms, setListPrograms] = useState([]);
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
      `https://cors-anywhere.herokuapp.com/https://au.gradconnection.com/api/campaigngroups/?job_type=graduate-jobs&disciplines=${degreeName}&location=melbourne%2CAU&offset=0&limit=100&ordering=-recent_job_created`
    );
    setListPrograms([]);
    let newListPrograms = [];
    gradConnectPrograms
      .then(x => x.json())
      .then(data => {
        data.map((employer, index) => {
          employer.campaigns.forEach((campaign, index) => {
            campaign["employerslug"] = employer.customer_organization.slug;
            campaign["done"] = Store.get(
              `${gradConnectionKey}.${campaign["id"]}`,
              false
            );
          });
          newListPrograms.push(...employer.campaigns);
        });
        setListPrograms(newListPrograms);
      });
  }, [degreeName]);

  const saveChecked = (id, newState) => {
    Store.set(`${gradConnectionKey}.${id}`, newState);
  };

  return (
    <div className="text-center">
      <div className="capitalize">Grad Connection - {degreeName.replace("-", " ")} Grad Programs</div>
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
        className="border rounded-lg mt-4 text-sm text-left p-4	"
        style={{ width: 700, height: 500, overflow: "auto" }}>
        {listPrograms.map(program => (
          <div key={program.id} className="flex flex-row">
            <div>
              <input
                className="mr-2 w-6 h-6 mt-2"
                type="checkbox"
                defaultChecked={program.done}
                onChange={e => {
                  saveChecked(program.id, e.target.value);
                }}
              />
            </div>
            <div>
              <a
                href={`https://au.gradconnection.com/employers/${program.employerslug}/jobs/${program.slug}/`}>
                {program.title}
              </a>
              <br />
              <Moment fromNow>{new Date(program.interval.start)}</Moment>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradConnection;

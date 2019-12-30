import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { GithubPicker } from "react-color";
import store from "store";
import Moment from "react-moment";

const Program = ({ program, dbKey }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(true);
  const [color, setColor] = useState("#ffffff00");
  let observer = null;

  useEffect(() => {
    observer = store.observe(
      `${dbKey}.${program.id}.color`,
      color => {
        setColor(color ? color.hex : "#ffffff00");
      }
    );
    return () => {
      store.unobserve(observer);
    };
  }, []);

  const storeColor = color => {
    store.set(`${dbKey}.${program.id}.color`, color);
  };

  const saveChecked = newState => {
    store.set(`${dbKey}.${program.id}.ticked`, newState);
  };
  const getChecked = () =>
    store.get(`${dbKey}.${program.id}.ticked`, false);

  const popover = {
    position: "relative",
    zIndex: "2"
    // transform: "translate(-16px)"
  };
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px"
  };
  return (
    <div className="flex flex-row p-4" style={{ background: color }}>
      <div>
        <input
          className="mr-2 w-6 h-6 mt-1"
          type="checkbox"
          defaultChecked={getChecked()}
          onChange={e => {
            saveChecked(e.target.checked);
          }}
        />
      </div>
      <a
        href={
          program.applyUrl ||
          `https://au.gradconnection.com/employers/${program.employerslug}/jobs/${program.slug}/`
        }
        className="flex-grow">
        <div>{program.companyName}</div>
        <div>{program.title}</div>

        {program.interval.start ? (
          <div>
            Start: <Moment fromNow>{new Date(program.interval.start)}</Moment>
          </div>
        ) : (
          false
        )}
        {program.interval.end ? (
          <span>
            Finishes: <Moment fromNow>{new Date(program.interval.end)}</Moment>
          </span>
        ) : (
          false
        )}
        <div className="flex flex-wrap">
          {program.locations.map(location => (
            <span className="mr-2" key={location}>
              {location}
            </span>
          ))}
        </div>
      </a>
      <div className="flex-shrink-0">
        <div
          onClick={() => {
            setDisplayColorPicker(true);
            // setDisplayColorPicker(!displayColorPicker);
          }}
          className="px-2 cursor-pointer">
          {/* <FontAwesomeIcon icon={faEllipsisV} /> */}
          {displayColorPicker ? (
            <div>
              {/* <div style={cover} onClick={() => setDisplayColorPicker(true)} /> */}
              <div style={popover}>
                <GithubPicker
                  triangle={"hide"}
                  color={color}
                  onChangeComplete={storeColor}
                  colors={["#ffffff00", "#fed7d7", "#fefcbf", "#c6f6d5"]}
                  width="auto"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Program;

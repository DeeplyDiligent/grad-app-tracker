import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { GithubPicker } from "react-color";
import store from "store";
import Moment from "react-moment";
import { gradConnectionKey } from "../utils/keys";

const Program = ({ program }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState("#ffffff00");
  let observer = null;

  useEffect(() => {
    observer = store.observe(
      `${gradConnectionKey}.${program.id}.color`,
      color => {
        setColor(color ? color.hex : "#ffffff00");
      }
    );
    return () => {
      store.unobserve(observer);
    };
  }, []);

  const storeColor = color => {
    store.set(`${gradConnectionKey}.${program.id}.color`, color);
  };

  const saveChecked = newState => {
    store.set(`${gradConnectionKey}.${program.id}.ticked`, newState);
  };
  const getChecked = () =>
    store.get(`${gradConnectionKey}.${program.id}.ticked`, false);

  const popover = {
    position: "absolute",
    zIndex: "2",
    transform: "translate(-16px)"
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
      <div className="flex-grow">
        <a
          href={`https://au.gradconnection.com/employers/${program.employerslug}/jobs/${program.slug}/`}>
          {program.title}
        </a>
        <br />
        <div>
          <Moment fromNow>{new Date(program.interval.start)}</Moment>
        </div>
        <span>
          Finishes: <Moment fromNow>{new Date(program.interval.end)}</Moment>
        </span>
      </div>
      <div>
        <div
          onClick={() => {
            setDisplayColorPicker(!displayColorPicker);
          }}
          className="px-2 cursor-pointer">
          <FontAwesomeIcon icon={faEllipsisV} />
          {displayColorPicker ? (
            <div>
              <div style={cover} onClick={() => setDisplayColorPicker(false)} />
              <div style={popover}>
                <GithubPicker
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

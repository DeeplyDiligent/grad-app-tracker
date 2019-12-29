import React from "react";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="text-center">
      <div>Select the website:</div>
      <Link to="/gradconnection">Gradconnection</Link>
    </div>
  );
};

export default Home;

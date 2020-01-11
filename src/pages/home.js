import React from "react";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="text-center">
      <div>Select the website:</div>
      <Link to="/gradconnection">Gradconnection</Link><br/>
      <Link to="/gradaustralia">GradAustralia</Link><br/>
      <Link to="/gethighered">GetHighered</Link><br/>
      <Link to="/iaeste">Iaeste</Link>
    </div>
  );
};

export default Home;

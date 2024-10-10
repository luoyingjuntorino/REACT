import React, { useState } from "react";

const Home = ({ handleLogout }) => {

  return (
    <div>
      <h1>Hello World</h1>
      <p>Welcome to the home page</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;

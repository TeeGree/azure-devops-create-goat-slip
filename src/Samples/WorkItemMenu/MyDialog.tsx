import React, { useState, useEffect } from "react";
import "./App.css";
import * as SDK from "azure-devops-extension-sdk";

function App() {
  const menuContributionHandler = (function () {
    return {
      // This is a callback that gets invoked when a user selects the newly contributed menu item
      // The actionContext parameter contains context data surrounding the circumstances of this
      // action getting invoked.
      execute: function () {
        alert("howdy, world");
      },
    };
  })();

  const initializeSdk = async () => {
    await SDK.init();
    SDK.register(SDK.getContributionId(), menuContributionHandler);
    await SDK.notifyLoadSucceeded();
  };

  useEffect(() => {
    initializeSdk();
  }, []);

  return <div className="App">hey hows it hanging</div>;
}

export default App;

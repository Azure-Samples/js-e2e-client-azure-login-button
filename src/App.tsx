import React, { useState } from "react";
import AzureAuthenticationButton from "./azure/azure-authentication-component";
import { AccountInfo } from "@azure/msal-browser";

function App() {
  // current authenticated user
  const [currentUser, setCurrentUser] = useState<AccountInfo>();

  // authentication callback
  const onAuthenticated = async (userAccountInfo: AccountInfo) => {
    setCurrentUser(userAccountInfo);
  };

  // Render JSON data in readable format
  const PrettyPrintJson = ({ data }: any) => {
    return (
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  // Quick link - user revokes app's permission
  const ShowPermissionRevokeLinks = () => {
    return (
      <div>
        <a href="https://myapps.microsoft.com" target="_blank" rel="noopener">Revoke AAD permission</a>&nbsp;|&nbsp;
        <a href="https://account.live.com/consent/manage" target="_blank" rel="noopener">Revoke Consumer permission</a>
      </div>
    );
  };

  return (
    <div id="App">
      <h2>Microsoft Login Button application</h2>
      <AzureAuthenticationButton onAuthenticated={onAuthenticated} />
      {currentUser && (
        <div>
          <PrettyPrintJson data={currentUser} />
          <ShowPermissionRevokeLinks />
        </div>
      )}
    </div>
  );
}

export default App;

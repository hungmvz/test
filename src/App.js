import { useState } from "react";

const App = () => {
  const [state, setState] = useState("");

  const handleFileChange = async e => {
    window.alert('test');
    // window.cordova.InAppBrowser.open('https://www.google.com', '_system');
    const dataString = JSON.stringify({
      type: 'external',
      data: 'https://www.google.com'
    });
    if (window?.webkit?.messageHandlers) {
      window.webkit.messageHandlers.cordova_iab.postMessage(dataString);
  } else {
      window.postMessage(dataString, '*');
  }
  };

  return (
    <div>
      <button onClick={handleFileChange}>Test v5</button>
    </div>
  );
};

export default App;

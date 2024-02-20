import { useState } from "react";

const bufferToBase64 = buffer =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)));
const base64ToBuffer = base64 =>
  Uint8Array.from(atob(base64), c => c.charCodeAt(0));

const App = () => {
  const [registerResult, setRegisterResult] = useState();
  const [loginResult, setLoginResult] = useState();

  const registerBiometrics = async () => {
    try {
      // call API create/get user data and .v.v.
      const options = {
        challenge: Uint8Array.from(
          window.atob("4VGqUM/WOZaCXxFmEk8PIdEF79FseZF6ohxUotwWk2Y="),
          c => c.charCodeAt(0)
        ),
        // Relying Party
        rp: {
          name: "ACME Corporation"
        },
        // User:
        user: {
          id: Uint8Array.from(window.atob("chl0000000000000001"), c =>
            c.charCodeAt(0)
          ),
          name: "hungmvz@nec.vn",
          displayName: "HungMVZ"
        },
        // prefers an ES256 credential.
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7 // "ES256" as registered in the IANA COSE Algorithms registry
          },
          {
            type: "public-key",
            alg: -257 // Value registered by this specification for "RS256"
          }
        ],
        timeout: 50000,
        attestation: "none",
        authenticatorSelectionCriteria: {
          attachment: "platform",
          requireResidentKey: false,
          userVerification: "required"
        },
        authenticatorSelection: {
          authenticatorAttachment: "platform"
        }
      };

      const credential = await navigator.credentials.create({
        publicKey: options
      });
      const credentialId = bufferToBase64(credential.rawId);
      localStorage.setItem("credential", JSON.stringify({ credentialId }));

      const data = {
        userID: "hungmvz@nec.vn",
        rawId: credentialId,
        response: {
          attestationObject: bufferToBase64(
            credential.response.attestationObject
          ),
          clientDataJSON: bufferToBase64(credential.response.clientDataJSON),
          id: credential.id,
          type: credential.type
        }
      };

      setRegisterResult(data);

      // Call api store data into DB
    } catch (e) {
      console.error("registration failed", e);
    }
  };

  const loginByBiometrics = async () => {
    try {
      const { credentialId } = JSON.parse(localStorage.getItem("credential"));
      // Call API get credentialId based on userID

      const credentialRequestOptions = {
        challenge: Uint8Array.from(
          window.atob("4VGqUM/WOZaCXxFmEk8PIdEF79FseZF6ohxUotwWk2Y="),
          c => c.charCodeAt(0)
        ),
        allowCredentials: [
          {
            id: base64ToBuffer(credentialId),
            type: "public-key",
            transports: ["internal"]
          }
        ]
      };

      const credential = await navigator.credentials.get({
        publicKey: credentialRequestOptions
      });

      const data = {
        rawId: bufferToBase64(credential.rawId),
        response: {
          authenticatorData: bufferToBase64(
            credential.response.authenticatorData
          ),
          signature: bufferToBase64(credential.response.signature),
          userHandle: bufferToBase64(credential.response.userHandle),
          clientDataJSON: bufferToBase64(credential.response.clientDataJSON),
          id: credential.id,
          type: credential.type
        }
      };

      setLoginResult(data);

      // Call API verify data
    } catch (e) {
      console.error("authentication failed", e);
    }
  };

  const [value, setValue] = useState("");

  const handleDateInputValueChange = value => {
    setValue(value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh"
      }}
    >
      <div
        style={{
          flexDirection: "row"
        }}
      >
        <button onClick={registerBiometrics}>Register</button>
        <button onClick={loginByBiometrics}>Login</button>
      </div>
      <div
        style={{
          flexDirection: "column"
        }}
      >
        <div>
          Register: {JSON.stringify(registerResult)}
        </div>
        <div>
          Login: {JSON.stringify(loginResult)}
        </div>
      </div>
      <span>Version: 9</span>
    </div>
  );
};

export default App;

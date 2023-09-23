import { useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const callAPI = () => {
    let data = JSON.stringify({
      "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFhMDhlN2M3ODNkYjhjOGFjNGNhNzJhZjdmOWRkN2JiMzk4ZjE2ZGMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbmV3am9iczI0NyIsImF1ZCI6Im5ld2pvYnMyNDciLCJhdXRoX3RpbWUiOjE2OTU0NjU2ODMsInVzZXJfaWQiOiJaaXJUaVFZWUM1VFNxTUkxYVJSajZyVmRyZFMyIiwic3ViIjoiWmlyVGlRWVlDNVRTcU1JMWFSUmo2clZkcmRTMiIsImlhdCI6MTY5NTQ2NTY4MywiZXhwIjoxNjk1NDY5MjgzLCJwaG9uZV9udW1iZXIiOiIrMTk4NzY1NDMyMTgiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIisxOTg3NjU0MzIxOCJdfSwic2lnbl9pbl9wcm92aWRlciI6InBob25lIn19.Vk4ZfBxFBbGhVJpmMticKj5qz2fE3v07Bmsqa4_MEjAexf9AiW_Y58e9XU1NXxTlv2BfqiwJF1ufTeSYydh5IbaZfl7yuDPb4FGp_muEbC-Y6D6vA1bzgcgLKy_A__OFdAAPW70rADO3x26OZrz--v2uf4b8CUN5nUOcZAqoXUKWGZSyngMEmJc26TJQucruOuUPmakxwWPmtKdirI4yMaOv74AAcus-7j23PLxfBVzRBZ3gp2Zi31IQe-NxXKgUclWVCzsL8v2rWZuVT54g3SvUpP53V2UEfqsT75EFNY7B19EBcwTttStzcjt1g9i9mvAzlYSMv_7ncqflaIGj4g",
      "firebase_uid": "ZirTiQYYC5TSqMI1aRRj6rVdrdS2",
      "phone": "+19876543218",
      "lang": "en"
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://dev.eship50.com/api/v1/login-by-phone',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    callAPI();
  }, []);
  return <div>test</div>
};

export default App;

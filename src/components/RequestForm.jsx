import React from "react";
import axios from "axios";

axios.interceptors.request.use((request) => {
  request.customData = request.customData || {};
  request.customData.startTime = new Date();
  return request;
});

axios.interceptors.response.use(updateEndTime, (e) => {
  return Promise.reject(updateEndTime(e.response));
});

function updateEndTime(response) {
  response.customData = response.customData || {};
  response.customData.time =
    new Date().getTime() - response.config.customData.startTime;
  return response;
}

const RequestForm = ({ setLoading, body, headers, setResponse }) => {
  const [verb, setVerb] = React.useState("GET");
  const [url, setUrl] = React.useState(
    "https://json-placeholder.mock.beeceptor.com/todos/1"
  );
  const sendRequest = async (e) => {
    e.preventDefault();
    
    // Exit if URL is not provided
    if (url === "") return;
    
    let reqHeaders = {};
    for (let h of headers) {
      if (h.key === "") continue;
      reqHeaders[h.key] = h.value;
    }
  
    // Process the body for methods that need it
    if (["POST", "PUT", "PATCH"].includes(verb.toUpperCase()) && body) {
      try {
        // Validate and format the JSON body
        JSON.parse(body);
        reqHeaders['Content-Type'] = 'application/json';
        body = JSON.stringify(JSON.parse(body));
      } catch (error) {
        alert("Malformed JSON data");
        return;
      }
    } else {
      body = null; // No body for other request types
    }
  
    setLoading(true);
  
    let res;
    try {
      // Send the request using axios
      res = await axios({
        method: verb.toLowerCase(),
        url,
        headers: reqHeaders,
        data: body,
      });
    } catch (error) {
      // Catch any errors and assign to the response
      res = error.response ? error.response : error;
    }
  
    // Update the response and stop loading
    setResponse(res);
    setLoading(false);
  };
  

  return (
    <div>
    <form onSubmit={sendRequest} className="form-control">
      <label className="input-group">
        <select
          name="verb"
          value={verb}
          onChange={(e) => setVerb(e.target.value)}
          className="select select-bordered"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="DELETE">DELETE</option>
          <option value="PUT">PUT</option>
        </select>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.example.com"
          className="input input-bordered placeholder:text-gray-600 w-full"
        />
        <button className="btn">Send</button>
      </label>
    </form>
    </div>
  );
};

export default RequestForm;

import React from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { dracula } from "@uiw/codemirror-theme-dracula";

const JSONTab = ({ activeOptionTab, body, setBody }) => {
  return (
    <div
      className={`bg-base-300 mt-6 space-y-4 rounded-md p-2 ${
        activeOptionTab === "JSON" ? "block" : "hidden"
      }`}
    >
      <ReactCodeMirror
        onChange={(value, viewUpdate) => {
          setBody(value);
        }}
        maxHeight="500px"
        value={body}
        extensions={[json()]}
        theme={dracula}
      />
    </div>
  );
};

export default JSONTab;

import * as esbuild from "esbuild-wasm";

import { useEffect, useRef, useState } from "react";
import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    const result = await ref.current.transform(input, {
      loader: "jsx",
      target: "es2015",
    });
    setCode(result.code);
  };

  return (
    <div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)}>
        {input}
      </textarea>
      <div>
        <button onClick={onClick} type="submit">
          transpile
        </button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};
const el = document.getElementById("root");
if (el === null) throw new Error("Root container missing in index.html");

const root = ReactDOM.createRoot(el)!;
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

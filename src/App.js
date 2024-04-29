import './App.css';
import PythonEditor from './lib';
import { loadPyodide } from 'pyodide';
import { useEffect, useState } from 'react';

function App() {
  const [consoleOutputs, setConsoleOutputs] = useState([]);
  console.log("Output from my IDE react component is", consoleOutputs);
  const [myPyodideInstance, setMyPyodideInstance] = useState(null);

  useEffect(() => {
    console.log("Output from my IDE react component is", consoleOutputs);
  }, [consoleOutputs, setConsoleOutputs])

  useEffect(() => {
    async function createPyodideInstance() {
      let pyodide = await loadPyodide({
        indexURL: window.location.href + "/pyodide"
      });
      
      setMyPyodideInstance(pyodide);
    }

    createPyodideInstance();
  }, []);

  return (
    <div>
      <div className="w-screen h-screen grid place-content-center">
        <PythonEditor width="90vw" height="80vh" consoleValue={consoleOutputs} 
        pyodideInstance={myPyodideInstance}/>
      </div>
    </div>
  );
}

export default App;

import './App.css';
import PythonEditor from './lib';
import { loadPyodide } from 'pyodide';
import { useEffect, useState } from 'react';

function App() {
  const [consoleOutputs, setConsoleOutputs] = useState([]);
  console.log("Output from my IDE react component is", consoleOutputs);
  const [myPyodideInstance, setMyPyodideInstance] = useState(null);

  useEffect(() => {
    async function createPyodideInstance() {
      let pyodide = await loadPyodide({
        indexURL: window.location.href + "/pyodide"
      });
      
      setMyPyodideInstance(pyodide);
    }

    createPyodideInstance();
  }, []);

  useEffect(() => {
    console.log("Printing from App...Console output received");
    console.log(consoleOutputs);
  }, [consoleOutputs])

  return (
    <div>
      <div className="w-screen h-screen grid place-content-center">
        <PythonEditor width="90vw" height="80vh" consoleOutputSetter={setConsoleOutputs} 
        pyodideInstance={myPyodideInstance}/>
      </div>
    </div>
  );
}

export default App;

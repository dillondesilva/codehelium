import { useEffect, useState } from 'react';
import './App.css';
import PythonEditor from './PythonEditor';

function App() {
  const [consoleOutputs, setConsoleOutputs] = useState([]);
  console.log("Output from my IDE react component is", consoleOutputs);

  useEffect(() => {
    console.log("Output from my IDE react component is", consoleOutputs);
  }, [consoleOutputs, setConsoleOutputs])

  return (
    <div>
      <div className="w-screen h-screen grid place-content-center">
        <PythonEditor width="90vw" height="80vh" consoleValue={consoleOutputs} />
      </div>
    </div>
  );
}

export default App;

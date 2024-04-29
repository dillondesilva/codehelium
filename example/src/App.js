import './App.css';
import PythonEditor from 'codehelium';
import { useEffect, useState } from 'react';

function App() {
  const [consoleOutputs, setConsoleOutputs] = useState([]);

  useEffect(() => {
    console.log("Output from my IDE react component is", consoleOutputs);
  }, [consoleOutputs, setConsoleOutputs])

  return (
    <div>
      <PythonEditor width="90vw" height="80vh" consoleOutputSetter={setConsoleOutputs}/>
    </div>
  );
}

export default App;

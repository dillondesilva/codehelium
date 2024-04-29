import './App.css';
import PythonEditor from 'codehelium';
import { useEffect, useState } from 'react';

function App() {
  const [consoleOutputs, setConsoleOutputs] = useState([]);
  console.log("Output from my IDE react component is", consoleOutputs);

  useEffect(() => {
    console.log("Output from my IDE react component is", consoleOutputs);
  }, [consoleOutputs, setConsoleOutputs])

  return (
    <div>
      <PythonEditor width="90vw" height="80vh" consoleValue={consoleOutputs} />
    </div>
  );
}

export default App;

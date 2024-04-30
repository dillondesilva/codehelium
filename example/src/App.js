import PythonEditor from 'codehelium'

function App() {
  return (
    <div style={{top: "50%", left: "50%", position: "absolute", 
    transform: "translate(-50%, -50%)"}}>
      <PythonEditor height="80vh" width="90vw" enableDownload={true} />
    </div>
  );
}

export default App;

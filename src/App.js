import './App.css';
import PythonEditor from './PythonEditor';

function App() {
  return (
    <div>
      <div className="w-screen h-screen flex justify-center place-content-center content-center">
        <PythonEditor width="50vw" height="60vh" />
      </div>
    </div>
  );
}

export default App;

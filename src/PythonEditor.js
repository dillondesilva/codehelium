import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import { loadPyodide } from "pyodide";
import { useRef, useState } from "react";

async function runPyodideExecution(codeString) {
    let pyodide = await loadPyodide({
        indexURL: "./pyodide/"
    });

    let execData = {
        logs: [],
    }

    pyodide.setStdout({ 
        batched: (msg) => {
            let outputLine = "> " + msg + "\n";
            execData.logs.push(outputLine);
        } 
    });

    pyodide.setStderr({ 
        batched: (msg) => {
            let outputLine = "> " + msg + "\n";
            execData.logs.push(outputLine);
        } 
    });

    try {
        await pyodide.runPythonAsync(codeString);
    } catch (e) {
        let outputLine = "> " + e.message + "\n";
        execData.logs.push(outputLine);
    }

    return execData;
}  

export default function PythonEditor(props) {
    const [isCodeRunning, setIsCodeRunning] = useState(false);
    const [isConsoleActive, setIsConsoleActive] = useState(false);
    const [consoleValue, setConsoleValue] = useState([]);
    const [editorValue, setEditorValue] = useState("");
    const editorRef = useRef('editorRef');
    // hello_python().then((result) => {
    //     console.log("Python says that 1+1 =", result);
    // });

    const runCode = async () => {
        // console.log("Running code now");
        setIsCodeRunning(true);
        setIsConsoleActive(true);   
        await runPyodideExecution(editorValue).then((result) => {
            setConsoleValue(result.logs);
        });
        // console.log("VALUE IS")
        // console.log(consoleValue);
        setIsCodeRunning(false);
    }

    const handleEditorChange = (value) => {
        setEditorValue(value);
    }

    const renderMainToolComponent = () => {
        if (isConsoleActive) {
            return (
                <div 
                    className={`p-4 bg-[#272822]
                    rounded-b-[12px] overflow-y-scroll`}
                    style={{
                        height: props.height,
                        width: props.width
                    }}
                >
                    {
                        consoleValue.map((line) => {
                            return (
                                <p className="text-white font-mono">{line}</p>
                            )
                        })
                    }
                </div>
            )
        } else {
            return (
                <AceEditor
                height={props.height}
                width={props.width}
                mode="python"
                theme="monokai"
                fontSize="16px"
                highlightActiveLine={true}
                value={editorValue}
                ref={editorRef}
                onChange={(value) => handleEditorChange(value)}
                setOptions={{
                    showLineNumbers: true,
                    tabSize: 2
                }}
                style={{
                    borderBottomLeftRadius: "12px",
                    borderBottomRightRadius: "12px"
                }}
                />
            ) 
        }
    }

    const renderRunCodeBtn = () => {
        if (isCodeRunning) {
            return (
                <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 \
                border-solid border-current border-e-transparent align-center border-cyan-400 \
                text-surface motion-reduce:animate-[spin_1s_linear_infinite] dark:text-white"
                />
            )
        } else {
            return (
                <button 
                className="rounded-md bg-white flex flex-row px-2 py-[0.5] justify-center place-content-center"
                onClick={runCode}
                >
                    <div>
                        <p>Run</p>
                    </div>
                </button> 
            )
        }
    }
      
    return (
        <div>
            <div className="h-full">
                <div 
                className={`h-[6.25vh] bg-zinc-700 rounded-t-[12px] flex justify-end items-center`}
                style={{
                    width: props.width
                }}
                >
                    <div className="pr-2">
                        <button 
                            className="rounded-md bg-white px-2 py-[0.5] justify-center place-content-center"
                        >
                            <p>Console</p>
                        </button>
                    </div>
                    <div className="pr-2">
                        {
                            renderRunCodeBtn()
                        }
                    </div>
                </div>
                {
                    renderMainToolComponent()
                }
            </div>
        </div>
    )
}
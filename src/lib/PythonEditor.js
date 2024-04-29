import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import { loadPyodide } from "pyodide";
import React, { useEffect, useRef, useState } from "react";

import TerminalIcon from '@mui/icons-material/Terminal';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CodeIcon from '@mui/icons-material/Code';
import './build.css';

async function runPyodideExecution(codeString, pyodideInstance) {
    let execData = {
        logs: [],
    }

    pyodideInstance.setStdout({ 
        batched: (msg) => {
            let outputLine = msg;
            execData.logs.push(outputLine);
        } 
    });

    pyodideInstance.setStderr({ 
        batched: (msg) => {
            let outputLine = msg;
            execData.logs.push(outputLine);
        } 
    });

    try {
        await pyodideInstance.runPythonAsync(codeString);
    } catch (e) {
        let outputLine = e.message;
        execData.logs.push(outputLine);
    }

    return execData;
}  

function PythonEditor(props) {
    const [isCodeRunning, setIsCodeRunning] = useState(false);
    const [isConsoleActive, setIsConsoleActive] = useState(false);
    const [consoleValue, setConsoleValue] = useState([]);
    const [editorValue, setEditorValue] = useState("");
    const [pyodideInstance, setPyodideInstance] = useState(null);
    const editorRef = useRef('editorRef');

    // Setting the pyodideInstance to execute code with
    useEffect(() => {
        async function createPyodideInstance() {
            if (props.pyodideInstance != null) {
                setPyodideInstance(props.pyodideInstance);
            } else {
                let pyodide = await loadPyodide({
                    indexURL: "https://cdn.jsdelivr.net/npm/pyodide@0.23.4/"
                });
                
                setPyodideInstance(pyodide);
            }
        }

        createPyodideInstance();    
    }, [props.pyodideInstance]);

    const runCode = async () => {
        setIsCodeRunning(true);
        setIsConsoleActive(true); 
        await runPyodideExecution(editorValue, pyodideInstance).then((result) => {
            setConsoleValue(result.logs);
            if (props.consoleOutputSetter != null) {
                props.consoleOutputSetter(result.logs);
            }
        });

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
                                <p className="text-white font-mono text-left">&gt; {line}</p>
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
                showPrintMargin={false}
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
                className="inline-block h-6 w-6 animate-spin rounded-full border-4 \
                border-solid border-current border-e-transparent align-center border-cyan-400 \
                text-surface motion-reduce:animate-[spin_1s_linear_infinite] dark:text-white"
                />
            )
        } else {
            return (
                <button
                className="rounded-md bg-zinc-700 flex flex-row px-2 py-[0.5] \
                justify-center border-2 place-content-center"
                onClick={runCode}
                >
                    <PlayArrowIcon className="pr-1 text-white" />
                    <p className="text-white">Run</p>
                </button> 
            )
        }
    }
      
    return (
        <div>
            <div className="h-full">
                <div 
                className={`h-[6.5vh] bg-zinc-700 rounded-t-[12px] flex justify-end space-evenly items-center`}
                style={{
                    width: props.width
                }}  
                >
                     <div className="pr-3">
                        <button 
                            className="rounded-md bg-zinc-700 px-2 \
                            border-2 justify-center place-content-center flex flex-row"
                            onClick={() => setIsConsoleActive(false)}
                        >
                            <CodeIcon className="pr-1 text-white" />
                            <p className="text-white">Code</p>
                        </button>
                    </div>
                    <div className="pr-3">
                        <button 
                            className="rounded-md bg-zinc-700 px-2 \
                            border-2 justify-center place-content-center flex flex-row"
                            onClick={() => setIsConsoleActive(true)}
                        >
                            <TerminalIcon className="pr-1 text-white" />
                            <p className="text-white">Console</p>
                        </button>
                    </div>
                    <div className="pr-3">
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

PythonEditor.defaultProps = {
    pyodideInstance: null,
    consoleOutputSetter: null
};

export default PythonEditor;
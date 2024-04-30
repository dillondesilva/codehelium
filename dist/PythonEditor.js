"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.promise.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.url.js");
require("core-js/modules/web.url.to-json.js");
require("core-js/modules/web.url-search-params.js");
var _reactAce = _interopRequireDefault(require("react-ace"));
require("ace-builds/src-noconflict/mode-python");
require("ace-builds/src-noconflict/theme-monokai");
require("ace-builds/src-noconflict/ext-language_tools");
var _pyodide = require("pyodide");
var _react = _interopRequireWildcard(require("react"));
var _Terminal = _interopRequireDefault(require("@mui/icons-material/Terminal"));
var _PlayArrow = _interopRequireDefault(require("@mui/icons-material/PlayArrow"));
var _Code = _interopRequireDefault(require("@mui/icons-material/Code"));
var _Download = _interopRequireDefault(require("@mui/icons-material/Download"));
require("./build.css");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function runPyodideExecution(codeString, pyodideInstance) {
  let execData = {
    logs: []
  };
  pyodideInstance.setStdout({
    batched: msg => {
      let outputLine = msg;
      execData.logs.push(outputLine);
    }
  });
  pyodideInstance.setStderr({
    batched: msg => {
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
  const [isCodeRunning, setIsCodeRunning] = (0, _react.useState)(false);
  const [isConsoleActive, setIsConsoleActive] = (0, _react.useState)(false);
  const [consoleValue, setConsoleValue] = (0, _react.useState)([]);
  const [editorValue, setEditorValue] = (0, _react.useState)("");
  const [pyodideInstance, setPyodideInstance] = (0, _react.useState)(null);
  const editorRef = (0, _react.useRef)('editorRef');

  // Setting the pyodideInstance to execute code with
  (0, _react.useEffect)(() => {
    async function createPyodideInstance() {
      if (props.pyodideInstance != null) {
        setPyodideInstance(props.pyodideInstance);
      } else {
        let pyodide = await (0, _pyodide.loadPyodide)({
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
    await runPyodideExecution(editorValue, pyodideInstance).then(result => {
      setConsoleValue(result.logs);
      if (props.consoleOutputSetter != null) {
        props.consoleOutputSetter(result.logs);
      }
    });
    setIsCodeRunning(false);
  };
  const downloadCode = () => {
    const blob = new Blob([editorValue], {
      type: 'text/plain'
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = "codehelium.py";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };
  const handleEditorChange = value => {
    setEditorValue(value);
  };
  const renderMainToolComponent = () => {
    if (isConsoleActive) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "p-4 bg-[#272822]\n                    rounded-b-[12px] overflow-y-scroll",
        style: {
          height: props.height,
          width: props.width
        }
      }, consoleValue.map(line => {
        return /*#__PURE__*/_react.default.createElement("p", {
          className: "text-white font-mono text-left"
        }, "> ", line);
      }));
    } else {
      return /*#__PURE__*/_react.default.createElement(_reactAce.default, {
        height: props.height,
        width: props.width,
        mode: "python",
        theme: "monokai",
        fontSize: "16px",
        highlightActiveLine: true,
        value: editorValue,
        ref: editorRef,
        onChange: value => handleEditorChange(value),
        setOptions: {
          showLineNumbers: true,
          tabSize: 2
        },
        showPrintMargin: false,
        style: {
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px"
        }
      });
    }
  };
  const renderRunCodeBtn = () => {
    if (isCodeRunning) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "inline-block h-6 w-6 animate-spin rounded-full border-4 \\ border-solid border-current border-e-transparent align-center border-cyan-400 \\ text-surface motion-reduce:animate-[spin_1s_linear_infinite] dark:text-white"
      });
    } else {
      return /*#__PURE__*/_react.default.createElement("button", {
        className: "rounded-md bg-zinc-700 flex flex-row px-2 py-[0.5] \\ justify-center border-2 place-content-center",
        onClick: runCode
      }, /*#__PURE__*/_react.default.createElement(_PlayArrow.default, {
        className: "pr-1 text-white"
      }), /*#__PURE__*/_react.default.createElement("p", {
        className: "text-white"
      }, "Run"));
    }
  };
  const renderDownloadCodeBtn = () => {
    if (props.enableDownload === true) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "pr-3"
      }, /*#__PURE__*/_react.default.createElement("button", {
        className: "rounded-md bg-zinc-700 px-2 \\ border-2 justify-center place-content-center flex flex-row",
        onClick: () => downloadCode()
      }, /*#__PURE__*/_react.default.createElement(_Download.default, {
        className: "pr-1 text-white"
      }), /*#__PURE__*/_react.default.createElement("p", {
        className: "text-white"
      }, "Download")));
    } else {
      return;
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "h-full"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "h-[6.5vh] bg-zinc-700 rounded-t-[12px] flex justify-end space-evenly items-center",
    style: {
      width: props.width
    }
  }, renderDownloadCodeBtn(), /*#__PURE__*/_react.default.createElement("div", {
    className: "pr-3"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "rounded-md bg-zinc-700 px-2 \\ border-2 justify-center place-content-center flex flex-row",
    onClick: () => setIsConsoleActive(false)
  }, /*#__PURE__*/_react.default.createElement(_Code.default, {
    className: "pr-1 text-white"
  }), /*#__PURE__*/_react.default.createElement("p", {
    className: "text-white"
  }, "Code"))), /*#__PURE__*/_react.default.createElement("div", {
    className: "pr-3"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "rounded-md bg-zinc-700 px-2 \\ border-2 justify-center place-content-center flex flex-row",
    onClick: () => setIsConsoleActive(true)
  }, /*#__PURE__*/_react.default.createElement(_Terminal.default, {
    className: "pr-1 text-white"
  }), /*#__PURE__*/_react.default.createElement("p", {
    className: "text-white"
  }, "Console"))), /*#__PURE__*/_react.default.createElement("div", {
    className: "pr-3"
  }, renderRunCodeBtn())), renderMainToolComponent()));
}
PythonEditor.defaultProps = {
  pyodideInstance: null,
  consoleOutputSetter: null
};
var _default = exports.default = PythonEditor;
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { indentUnit } from "@codemirror/language";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { validateJson } from "../../util/validateJson";
import { InteractiveBalanceData } from "../../types/InteractiveBalanceData";
import { useDebounce } from "../../hooks/useDebounce";

const JsonEditor = () => {
    const { interactiveBalanceData, setInteractiveBalanceData } = useInteractiveBalanceData();
    const [hasMounted, setHasMounted] = useState(false);
    const [editorValue, setEditorValue] = useState("");
    const [editorKey, setEditorKey] = useState(0);
    const debouncedEditorValue = useDebounce(editorValue, 500);
    const [validationState, setValidationState] = useState<'valid' | 'invalid-json' | 'invalid-schema'>('valid');

    // reload editor value on external change of interactiveBalanceData
    useEffect(() => {
        if (!interactiveBalanceData) return;

        const currentParsed = (() => {
            try { return JSON.parse(editorValue); } catch { return null; }
        })();

        if (JSON.stringify(currentParsed) === JSON.stringify(interactiveBalanceData)) {
            return;
        }

        const jsonString = JSON.stringify(interactiveBalanceData, null, 4);
        setHasMounted(true);
        setEditorValue(jsonString);
    }, [interactiveBalanceData]);

    // apply debounced (500ms) changes in real time and set success/error messages
    useEffect(() => {
        if (!hasMounted) return;

        try {
            const parsedEditorValue = JSON.parse(debouncedEditorValue);
            const isValid = validateJson(parsedEditorValue);

            if (isValid) {
                setInteractiveBalanceData(parsedEditorValue as unknown as InteractiveBalanceData);
                setValidationState('valid');
            } else {
                setValidationState('invalid-schema');
                console.group('Schema Validation Errors:');
                validateJson.errors?.forEach((error, index) => {
                    console.log(`Error ${index + 1}:`);
                    console.log(`  Path: ${error.instancePath || '(root)'}`);
                    console.log(`  Message: ${error.message}`);
                    console.log(`  Details:`, error);
                });
                console.groupEnd();
            }
        } catch (err) {
            setValidationState('invalid-json');
            console.log(`Invalid JSON, not applying\n${err}`);
        }
    }, [debouncedEditorValue, hasMounted]);

    //onclick for format button
    const formatJson = () => {
        try {
            const parsedEditorValue = JSON.parse(editorValue);
            console.log("parsed successfully");

            const formattedEditorValue = JSON.stringify(parsedEditorValue, null, 4);
            console.log("formatted successfully");
            // console.log(formattedEditorValue);

            setEditorValue(formattedEditorValue);
            setEditorKey(k => k + 1);
            toast.success("Erfolgreich formatiert");
        } catch (err) {
            toast.error("Ungültiges JSON-Format");
        }
    };


    if (!hasMounted) return null;

    return (
        <div className="">
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    {validationState === 'valid' && (
                        <span className="text-green-600 text-sm">✓ Gültig - Änderungen werden angewendet...</span>
                    )}
                    {validationState === 'invalid-json' && (
                        <span className="text-red-600 text-sm">✗ Ungültiges JSON-Format. Details in Entwicklerkonsole (F12)</span>
                    )}
                    {validationState === 'invalid-schema' && (
                        <span className="text-orange-600 text-sm">⚠ JSON entspricht nicht dem erwarteten Schema. Details in Entwicklerkonsole (F12)</span>
                    )}
                </div>
                <div className="flex justify-end">
                    <button onClick={formatJson} className="bg-green-500 px-3 py-1 rounded mb-2 ml-2">
                        Formatieren
                    </button>
                    {/* <button onClick={applyChanges} className="bg-green-500 px-3 py-1 rounded mb-2 ml-2">
                        Anwenden
                    </button>
                    <button className="bg-green-500 px-3 py-1 rounded mb-2 ml-2">
                        Verwerfen
                    </button> */}
                </div>
            </div>

            <CodeMirror
                key={editorKey}
                value={editorValue}
                extensions={[
                    json(),
                    indentUnit.of("    ")
                ]}
                height="80vh"
                theme="light"
                onChange={(value) => {
                    setEditorValue(value);
                    console.log("value Changed");
                }}
            />
        </div>
    );
};

export default JsonEditor;
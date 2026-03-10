import React, { useState } from "react";
import { useInteractiveBalanceData } from "../../context/InteractiveBalanceDataContext";
import { validateJson } from "../../util/validateJson";
import WindowManager from "../../util/WindowManager";
import { useWindowManager, WindowManagerContext } from "../../context/WindowManagerContext";
import { toast } from 'react-toastify';
import defaultProjectFile from "../../api/empyt_project.json"
import { InteractiveBalanceData } from "../../types/InteractiveBalanceData";
import { useDragContext } from "../../context/DragContext";
import { ensurePositionIds } from "../../util/addIdsToPositions";

export function FileHandlerComponent() {
    const { interactiveBalanceData, loadProject, cancelDraft } = useInteractiveBalanceData();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { closeAllWindowsExcept } = useWindowManager();
    const { setDropIndicator, clearOpenPositionIds } = useDragContext();

    const defaultProject = defaultProjectFile as unknown as InteractiveBalanceData;

    const donwloadBeforeResetToast = () => {
        toast.warning(({ closeToast }) => (
            <div>
                <div>Aktuelles Projekt vorher runterladen?</div>
                <div className="flex justify-between">
                    <button
                        className="text-black border px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                        onClick={() => {
                            handleDownload();
                            setDropIndicator(null);
                            clearOpenPositionIds();
                            cancelDraft();
                            loadProject(defaultProject);
                            closeToast();
                        }}
                    >
                        Ja
                    </button>
                    <button
                        className="text-black border px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                        onClick={() => {
                            setDropIndicator(null);
                            clearOpenPositionIds();
                            cancelDraft();
                            loadProject(defaultProject);
                            closeToast();
                        }}
                    >
                        Nein
                    </button>
                    <button
                        className="text-black border px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                        onClick={() => {
                            closeToast();
                        }}>
                        Abbrechen
                    </button>
                </div>
            </div >
        ), {
            position: "top-center",
            autoClose: false,
        });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMessage(null);
        if (!e.target.files?.[0]) {
            setErrorMessage("Keine Datei gefunden");
            toast.error(
                <>
                    Upload fehlgeschlagen <br />
                    Keine Datei gefunden
                </>
            );
            return;
        };
        setUploadedFile(e.target.files[0]);
        console.log("uploaded: ", e.target.files[0]); // log from event
    };

    const handleUpload = () => {
        setErrorMessage(null);
        if (!uploadedFile) return;

        const fileReader = new FileReader();
        fileReader.readAsText(uploadedFile, "UTF-8");
        fileReader.onload = (e: ProgressEvent<FileReader>) => {
            const fileContent = e.target?.result?.toString();
            if (!fileContent) {
                setErrorMessage("Keine Datei gefunden");
                toast.error(
                    <>
                        Upload fehlgeschlagen <br />
                        Keine Datei gefunden
                    </>
                );
                return;
            };

            let projectObject;
            try {
                projectObject = JSON.parse(fileContent);
            } catch (err) {
                console.error("Invalid JSON:", err);
                setErrorMessage("Fehler beim Parsing des JSON-String");
                toast.error(
                    <>
                        Upload fehlgeschlagen <br />
                        Fehler beim Parsing des JSON-String
                    </>
                );
                return;
            }

            const objectValid = validateJson(projectObject);
            if (!objectValid) {
                console.error("Validation errors:", validateJson.errors);
                setErrorMessage("JSON-Format ist nicht zulässig");
                toast.error(
                    <div>
                        Upload fehlgeschlagen <br />
                        Format nicht zulässig <br />
                        {/* <ul>
                            {validateJson.errors?.map((err, i) => (
                                <li key={i}>{err.message}</li>
                            ))}
                        </ul> */}
                    </div>
                );
                return;
            }

            setDropIndicator(null);
            clearOpenPositionIds();

            loadProject(projectObject);

            closeAllWindowsExcept({
                type: "FileHandeling",
                payload: {}
            });

            console.log("Successfully loaded project:", projectObject);
            toast.success("Upload erfolgreich!");
        };
    };

    const handleDownload = () => {
        if (!interactiveBalanceData) return;

        const interactiveBalanceDataBlob = new Blob(
            [JSON.stringify(interactiveBalanceData)],
            { type: 'application/json' }
        );

        const url = URL.createObjectURL(interactiveBalanceDataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'interactive_balance_data_project.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Downsload erfolgreich!");
    }

    return (
        <>
            <div className="flex justify-center">
                <div className="flex flex-col items-center space-y-2 p-4 bg-white border rounded shadow-md w-80">
                    <label className="flex flex-col w-full">
                        <span className="text-sm font-medium text-gray-700 mb-1">Upload JSON</span>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className="block w-full text-xs text-gray-600 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                        />
                    </label>

                    <button
                        disabled={!uploadedFile}
                        onClick={handleUpload}
                        className={`w-full px-3 py-1 rounded text-white text-sm font-medium transition-colors ${uploadedFile ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        Upload
                    </button>

                    <button
                        disabled={!interactiveBalanceData}
                        onClick={handleDownload}
                        className={`w-full px-3 py-1 rounded text-white text-sm font-medium transition-colors ${interactiveBalanceData ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        Download
                    </button>

                    {errorMessage && (
                        <div className="bg-red-100 text-red-700 border border-red-300 rounded p-2 text-sm w-full text-center">
                            {errorMessage}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <button
                    className="w-80 px-3 py-1 rounded text-white text-sm font-medium transition-colors bg-blue-500 hover:bg-blue-600"
                    onClick={donwloadBeforeResetToast}
                >
                    Mit leerem Projekt starten
                </button>
            </div>

        </>
    );

}
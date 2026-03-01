import { useState } from "react";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useAppMode, AppMode } from "../../context/AppModeContex";

const MODE_TITLES: Record<AppMode, string> = {
    standard: "Standard",
    edit: "Edit",
    teacher: "Teacher"
};


export function Sidebar() {
    const { openWindow } = useWindowManager();
    const { appMode, isTeacherFromUrl, setAppMode, cycleMode } = useAppMode();

    const [collapsed, setCollapsed] = useState(true);

    const toggleCollapsed = () => {
        const newValue = !collapsed;
        setCollapsed(newValue);
    }

    return (
        <div className="fixed top-0 left-0 h-full z-50">
            <button
                title={`Menü ${collapsed ? "ausklappen" : "einklappen"}`}
                className="fixed top-8 left-4 z-[1001] bg-gray-300 rounded-xl size-14 text-3xl flex items-center justify-center"
                onClick={toggleCollapsed}>
                {collapsed ? <span>&#x276f;</span> : <span>&#x276e;</span>}
            </button>
            <div className={`fixed top-20 left-0 h-2/3 w-20 z-[1000] transition-transform duration-200 ${collapsed ? '-translate-x-full' : 'translate-x-0'}`}>
                <button
                    title="Up-/Download"
                    className="relative ml-4 mt-4 mb-1 bg-gray-300 rounded-xl size-14 flex items-center justify-center text-2xl"
                    onClick={() => openWindow({ type: "FileHandeling", payload: {} })}>
                    <span className="absolute top-1 left-0 leading-none">📥</span>
                    <span className="absolute bottom-3 right-0 leading-none">📤</span>
                </button>
                <button
                    title="Neue Buchung"
                    className="relative ml-4 my-1 bg-gray-300 rounded-xl size-14 flex items-center justify-center text-[22px]"
                    onClick={() => openWindow({ type: "JournalEntry", payload: { isDraft: true } })}>
                    <span>&#x2795;</span>
                    <span>&#x1F9FE;</span>
                </button>
                <button
                    title="Journal"
                    className="relative ml-4 my-1 bg-gray-300 rounded-xl size-14 flex items-center justify-center text-4xl">
                    <span>&#x1F4D2;</span>
                </button>
                <button
                    title="Kontenplan"
                    className="relative ml-4 my-1 bg-gray-300 rounded-xl size-14 flex items-center justify-center text-4xl"
                    onClick={() => openWindow({type: "ChartOfAccounts", payload:{}})}>
                    <span>&#x1F5C2;</span>
                </button>
                <button
                    title={`Mode: ${MODE_TITLES[appMode]} — klicken zum Ändern`}
                    className="relative ml-4 my-1 bg-gray-300 rounded-xl size-14 flex items-center justify-center text-4xl"
                    onClick={() => cycleMode()}>
                    {appMode === 'standard' ? '👁️' : appMode === 'edit' ? '✏️' : '🎓'}
                </button>
            </div>
        </div >
    )
}
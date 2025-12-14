import React from "react";
import { BookingsListProps, EntryLinesProps } from "./tAccountInterfaces";
import { useWindowManager } from "../../context/WindowManagerContext";

export const BookingsListComponent: React.FC<EntryLinesProps> = ({
    lines
}) => {

    const { openWindow } = useWindowManager()

    console.log("lines changes: ", lines);

    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="text-left border-b border-solid">
                    <th className="border-r w-1/5 border-solid">ID</th>
                    {/* <th>Kommentar</th> */}
                    <th className="border-l w-4/5 border-solid">Betrag</th>
                </tr>
            </thead>
            <tbody>
                {lines.map((l, index) => (
                    <tr
                        className="cursor-pointer align-top border-t boder-solid transition-all duration-100 hover:scale-95"
                        key={index}
                        onClick={() => openWindow({ type: "JournalEntry", payload: { id: l.entryId } })}
                    >
                        <td className="whitespace-nowrap border-r border-solid">{l.entryId}</td>
                        {/* <td>{b.description && b.description}</td> */}
                        <td className="whitespace-nowrap text-right border-l border-solid">{l.line.amount.toFixed(2)} €</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
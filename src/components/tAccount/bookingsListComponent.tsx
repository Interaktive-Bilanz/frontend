import React from "react";
import { BookingsListProps, EntryLinesProps } from "./tAccountInterfaces";

export const BookingsListComponent: React.FC<EntryLinesProps> = ({
    lines
}) => {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="text-left border-b border-solid">
                    <th className="border-r border-solid">ID</th>
                    {/* <th>Kommentar</th> */}
                    <th className="border-l border-solid">Betrag</th>
                </tr>
            </thead>
            <tbody>
                {lines.map((l) => (
                    <tr className="align-top border-t boder-solid" key={l.entryId}>
                        <td className="whitespace-nowrap border-r border-solid">{l.entryId}</td>
                        {/* <td>{b.description && b.description}</td> */}
                        <td className="whitespace-nowrap text-right border-l border-solid">{l.line.amount.toFixed(2)} €</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
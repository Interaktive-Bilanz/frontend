import React from "react";
import { BookingsListProps } from "./tAccountInterfaces";

export const BookingsListComponent: React.FC<BookingsListProps> = ({
    bookings,
}) => {
    return (
        <table className="w-full border-collapse">
            <tr className="text-left border-b border-solid">
                <th className="border-r border-solid">ID</th>
                <th>Kommentar</th>
                <th className="border-l border-solid">Betrag</th>
            </tr>
            {bookings.map((b) => (
                <tr className="align-top border-t boder-solid" key={b.id}>
                    <td className="whitespace-nowrap border-r border-solid">{b.id}</td>
                    <td>{b.description && b.description}</td>
                    <td className="whitespace-nowrap text-right border-l border-solid">{b.value.toFixed(2)} €</td>
                </tr>
            ))}
        </table>
    )
}
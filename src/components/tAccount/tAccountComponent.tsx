import { Booking, TAccountProps } from "./tAccountInterfaces";
import { BookingsListComponent } from "./bookingsListComponent";
import React from "react";

const sumBookings = (bookings: Booking[]) =>
    bookings.reduce((sum, b) => sum + b.value, 0);

export const TAccountComponent: React.FC<TAccountProps> = ({
    account,
}) => {
    const sollSum = sumBookings(account.soll);
    const habenSum = sumBookings(account.haben)
    const sumDif = sollSum - habenSum;
    return (
        <div>
            <div className="flex justify-between">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Soll</h3>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Haben</h3>
            </div>
            <div className="grid grid-cols-2 border-t-4 border-solid border-black">
                <div className="pr-1 border-r-2 border-solid border-black w-full pb-1">
                    <BookingsListComponent bookings={account.soll} />
                </div>
                <div className="pl-1 border-l-2 border-solid border-black w-full pb-1">
                    <BookingsListComponent bookings={account.haben} />
                </div>
            </div>
            <div className="grid grid-cols-2 border-t-2 border-solid border-gray-300 -mt-1">
                <div className=" p-1 border-r-2 border-solid border-black">
                    <div className="flex justify-between items-center">
                        <div className="inline-flex items-center gap-1">
                            <span className="text-lg">Summe</span>
                            <span className="text-lg font-normal font-mono">∑</span>
                        </div>
                        <div className="text-lg">{sollSum.toFixed(2)} €</div>
                    </div>
                    {sumDif <= 0 && (
                        <div className="flex justify-between">
                            <div className="text-lg">Saldo</div>
                            <div className="text-lg">{(-1 * sumDif).toFixed(2)} €</div>
                        </div>
                    )}
                </div>
                <div className=" p-1 border-l-2 boder-solid border-black">
                    <div className="flex justify-between items-center">
                        <div className="inline-flex items-center gap-1">
                            <span className="text-lg">Summe</span>
                            <span className="text-lg font-normal font-mono">∑</span>
                        </div>
                        <div className="text-lg">{habenSum.toFixed(2)} €</div>
                    </div>
                    {sumDif > 0 && (
                        <div className="flex justify-between">
                            <div className="text-lg">Saldo</div>
                            <div className="text-lg">{sumDif.toFixed(2)} €</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
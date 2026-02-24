import React, { useState } from "react";

interface KontoField {
  konto: string;
  name: string;
}

interface Entry {
  sollKonten: KontoField[];
  habenKonten: KontoField[];
  betrag: string;
}

const kontoOptions = [
  { value: "0300 BGA", label: "0300 BGA" },
  { value: "1200 Ford.LuL", label: "1200 Ford.LuL" },
  { value: "1400 Vstl.", label: "1400 Vstl." },
];

export default function Buchungsformular() {
  const [entry, setEntry] = useState<Entry>({
    sollKonten: [{ konto: kontoOptions[0].value, name: "" }],
    habenKonten: [{ konto: kontoOptions[1].value, name: "" }],
    betrag: "",
  });

  function handleChange(
    collection: "sollKonten" | "habenKonten",
    idx: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setEntry(prev => {
      const section = [...prev[collection]];
      section[idx] = { ...section[idx], [name]: value };
      return { ...prev, [collection]: section };
    });
  }

  function addRow(collection: "sollKonten" | "habenKonten") {
    setEntry(prev => {
      if (prev[collection].length >= 3) {
        return prev;
      }
      return {
        ...prev,
        [collection]: [
          ...prev[collection],
          { konto: kontoOptions[0].value, name: "" }
        ],
      };
    });
  }


  function removeRow(collection: "sollKonten" | "habenKonten", idx: number) {
    setEntry(prev => ({
      ...prev,
      [collection]:
        prev[collection].length > 1
          ? prev[collection].filter((_, i) => i !== idx)
          : prev[collection]
    }));
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 border rounded bg-white shadow">
      <div className="flex flex-col md:flex-row gap-8 mb-6">
        {/* Soll-Konten Table */}
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="font-semibold bg-yellow-100 rounded px-2 py-1 mr-2">Soll-Konten</span>
            <button
              type="button"
              onClick={() => addRow("sollKonten")}
              className="ml-2 px-2 py-1 rounded border bg-gray-100"
            >
              + Soll
            </button>
          </div>
          <table className="w-full border divide-y">
            <thead className="bg-yellow-50">
              <tr>
                <th className="text-left px-2 py-1">Konto</th>
                <th className="text-left px-2 py-1">Name</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {entry.sollKonten.map((soll, i) => (
                <tr key={i}>
                  <td className="px-2 py-1">
                    <select
                      name="konto"
                      className="border rounded px-2 py-1 w-full"
                      value={soll.konto}
                      onChange={e => handleChange("sollKonten", i, e)}
                    >
                      {kontoOptions.map(option =>
                        <option key={option.value} value={option.value}>{option.label}</option>
                      )}
                    </select>
                  </td>
                  <td className="px-2 py-1">
                    <input
                      name="name"
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Name"
                      value={soll.name}
                      onChange={e => handleChange("sollKonten", i, e)}
                    />
                  </td>
                  <td className="px-2 py-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow("sollKonten", i)}
                      className={`px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-xs ${entry.sollKonten.length === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={entry.sollKonten.length === 1}
                      title={entry.sollKonten.length === 1 ? "Mindestens ein Soll-Konto erforderlich" : "Entfernen"}
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Haben-Konten Table */}
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="font-semibold bg-yellow-100 rounded px-2 py-1 mr-2">Haben-Konten</span>
            <button
              type="button"
              onClick={() => addRow("habenKonten")}
              className="ml-2 px-2 py-1 rounded border bg-gray-100"
            >
              + Haben
            </button>
          </div>
          <table className="w-full border divide-y">
            <thead className="bg-yellow-50">
              <tr>
                <th className="text-left px-2 py-1">Konto</th>
                <th className="text-left px-2 py-1">Name</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {entry.habenKonten.map((haben, i) => (
                <tr key={i}>
                  <td className="px-2 py-1">
                    <select
                      name="konto"
                      className="border rounded px-2 py-1 w-full"
                      value={haben.konto}
                      onChange={e => handleChange("habenKonten", i, e)}
                    >
                      {kontoOptions.map(option =>
                        <option key={option.value} value={option.value}>{option.label}</option>
                      )}
                    </select>
                  </td>
                  <td className="px-2 py-1">
                    <input
                      name="name"
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Name"
                      value={haben.name}
                      onChange={e => handleChange("habenKonten", i, e)}
                    />
                  </td>
                  <td className="px-2 py-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow("habenKonten", i)}
                      className={`px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-xs ${entry.habenKonten.length === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={entry.habenKonten.length === 1}
                      title={entry.habenKonten.length === 1 ? "Mindestens ein Haben-Konto erforderlich" : "Entfernen"}
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Betrag & Actions */}
      <div className="flex items-center gap-4 mb-4">
        <div className="ml-auto font-bold">Betrag</div>
        <input
          name="betrag"
          className="border rounded px-2 py-1"
          placeholder="Betrag"
          value={entry.betrag}
          onChange={e => setEntry(prev => ({ ...prev, betrag: e.target.value }))}
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200">Abbrechen</button>
        <button className="px-4 py-2 border rounded bg-yellow-200 hover:bg-yellow-300 font-semibold">Buchen!</button>
      </div>
    </div>
  );
}

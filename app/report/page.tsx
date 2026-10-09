
"use client";

import { useState } from "react";

const categories = [
  "Pothole or road damage",
  "Drainage",
  "Streetlight",
  "Water pipeline",
  "Other",
];

export default function ReportPage() {
  const [road, setRoad] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!road.trim() || !description.trim()) {
      setMessage("Please complete all required fields.");
      return;
    }

    setMessage(
      "Demo report submitted successfully. It is not yet saved to a shared database."
    );

    setRoad("");
    setCategory(categories[0]);
    setDescription("");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
        CivicPulse / Citizen Services
      </p>

      <h1 className="mt-3 text-3xl font-bold">
        Report a Civic Issue
      </h1>

      <p className="mt-3 text-gray-600">
        Help identify infrastructure problems in your area.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-2xl border p-6 shadow-sm"
      >
        <div>
          <label htmlFor="road" className="mb-2 block font-medium">
            Road or location *
          </label>
          <input
            id="road"
            value={road}
            onChange={(e) => setRoad(e.target.value)}
            placeholder="e.g. Anna Nagar Main Road"
            required
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-2 block font-medium">
            Issue category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border px-4 py-3"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="mb-2 block font-medium">
            Describe the issue *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem..."
            required
            rows={5}
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Submit Demo Report
        </button>

        {message && (
          <p role="status" className="rounded-lg bg-blue-50 p-4 text-blue-900">
            {message}
          </p>
        )}
      </form>

      <p className="mt-5 text-sm text-gray-500">
        Demo mode: reports are not permanently stored or shared with authorities yet.
      </p>
    </main>
  );
}
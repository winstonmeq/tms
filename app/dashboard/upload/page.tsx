'use client'
import { useState } from "react";
import * as XLSX from "xlsx";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState("");
  const [message, setMessage] = useState("");

  const excelToJson = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;

        if (arrayBuffer) {
          const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(workSheet);

          setJsonData(JSON.stringify(json, null, 2));
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };


  const saveToDatabase = async () => {
    try {
      const parsedData = JSON.parse(jsonData); // Parse JSON string to an array of objects
  
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData), // Send the parsed JSON data
      });
  
      if (response.ok) {
        setMessage("Data successfully saved!");
      } else {
        const errorData = await response.json();
        setMessage("Failed to save data: " + errorData.message || "Unknown error.");
      }
    } catch (error: unknown) {
      // Ensure `error` is an object and has a `message` property
      if (error instanceof Error) {
        setMessage("Error: " + error.message);
      } else {
        setMessage("An unknown error occurred.");
      }
    }
  };


  const save_bulk_voter = async () => {
    try {
      const parsedData = JSON.parse(jsonData); // Parse JSON string to an array of objects
  
      const response = await fetch("/api/upload_voter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData), // Send the parsed JSON data
      });
  
      if (response.ok) {
        setMessage("Data successfully saved!");
      } else {
        const errorData = await response.json();
        setMessage("Failed to save data: " + errorData.message || "Unknown error.");
      }
    } catch (error: unknown) {
      // Ensure `error` is an object and has a `message` property
      if (error instanceof Error) {
        setMessage("Error: " + error.message);
      } else {
        setMessage("An unknown error occurred.");
      }
    }
  };
  
  return (
    <div>
      <h1>Upload Data</h1>
      <form onSubmit={excelToJson}>
        <input
          type="file"
          accept=".xlsx, .csv"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <button type="submit">Show Data</button>
      </form>
      {jsonData && (
        <div>
          <h2>Extracted Data:</h2>
          <pre>{jsonData}</pre>
          <button onClick={save_bulk_voter}>Save Bulk Voter</button>

        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

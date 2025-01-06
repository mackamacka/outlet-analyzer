import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

const OutletAnalyzer = () => {
  const [outletData, setOutletData] = useState(null);
  const [error, setError] = useState('');
  const [eventDetails, setEventDetails] = useState(null);

  const processExcelFile = async (file) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, {
        cellStyles: true,
        cellFormulas: true,
        cellDates: true,
        cellNF: true,
        sheetStubs: true
      });

      const eventInfo = {};
      const outletsBySection = {};

      // Process each sheet (excluding Lookup Table)
      workbook.SheetNames.forEach(sheetName => {
        if (sheetName === 'Lookup Table') return;

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

        const outlets = [];
        // Start processing from row 5 (where outlet data begins)
        for (let i = 5; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row[0] && row[0] !== 'OUTLET NAME') {
            outlets.push({
              name: row[0],
              location: row[1],
              openTime: row[3],
              closeTime: row[4],
              staffCount: row[7],
              isOpen: row[3] && row[3].toString().toLowerCase() !== 'closed'
            });
          }
        }

        if (outlets.length > 0) {
          outletsBySection[sheetName] = outlets;
        }
      });

      setOutletData(outletsBySection);
      setError('');
    } catch (err) {
      setError('Error processing file: ' + err.message);
      setOutletData(null);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processExcelFile(file);
    }
  };

  return (
    <div>
      <h1>F&B Outlet Status Analyzer</h1>
      
      <input
        type="file"
        onChange={handleFileUpload}
        accept=".xlsx,.xls"
      />

      {error && (
        <div style={{color: 'red'}}>{error}</div>
      )}

      {outletData && Object.keys(outletData).map(section => (
        <div key={section}>
          <h2>{section}</h2>
          {outletData[section].map((outlet, index) => (
            <div key={index}>
              <p>{outlet.name} - {outlet.location}</p>
              <p>Open: {outlet.openTime} - {outlet.closeTime}</p>
              <p>Staff: {outlet.staffCount}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default OutletAnalyzer;
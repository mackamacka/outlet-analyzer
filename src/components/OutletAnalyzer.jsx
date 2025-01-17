import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

const OutletAnalyzer = () => {
  const [outletData, setOutletData] = useState(null);
  const [error, setError] = useState('');

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

      // List of outlets to exclude
      const excludedOutlets = [
        'Coffee Cart',
        'Concourse Food Van',
        'Cricket Viewing Rooms'
      ];

      const outletsBySection = {};

      workbook.SheetNames.forEach(sheetName => {
        if (sheetName === 'Lookup Table') return;

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

        const outlets = [];
        for (let i = 5; i < jsonData.length; i++) {
          const row = jsonData[i];
          // Check if outlet exists and BMS ON time is not 0:00:00
          if (row && row[0] && 
              row[0] !== 'OUTLET NAME' && 
              row[2] && // BMS ON time
              row[2] !== '0:00:00' &&
              !excludedOutlets.some(excluded => row[0].includes(excluded))) {
            outlets.push({
              name: row[0]
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
    <div style={{ 
      padding: '20px', 
      height: '100vh', 
      maxWidth: '1920px', 
      margin: '0 auto'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>F&B Outlet Status Analyzer</h1>
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".xlsx,.xls"
        />
        {error && (
          <div style={{color: 'red'}}>{error}</div>
        )}
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '20px'
      }}>
        {outletData && Object.keys(outletData).slice(0, 5).map((section, index) => (
          <div key={section} style={{
            gridColumn: index === 4 ? '2 / 3' : 'auto',
            gridRow: index >= 3 ? '2 / 3' : '1 / 2'
          }}>
            <h2>{section}</h2>
            {outletData[section].map((outlet, idx) => (
              <div key={idx}>
                <p>{outlet.name}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutletAnalyzer;
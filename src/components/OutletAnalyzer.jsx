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

      const outletsBySection = {};

      workbook.SheetNames.forEach(sheetName => {
        if (sheetName === 'Lookup Table') return;

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

        const outlets = [];
        for (let i = 5; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row[0] && row[0] !== 'OUTLET NAME' && row[3] && row[3].toString().toLowerCase() !== 'closed') {
            outlets.push({
              name: row[0],
              location: row[1]
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
    <div style={{ padding: '20px', maxWidth: '1920px', margin: '0 auto' }}>
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
        <div key={section} style={{ marginBottom: '20px' }}>
          <h2 style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '10px',
            marginBottom: '10px' 
          }}>{section}</h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px',
            alignItems: 'start'
          }}>
            {outletData[section].map((outlet, index) => (
              <div key={index} style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}>
                <p style={{ margin: 0 }}>{outlet.name} - {outlet.location}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OutletAnalyzer;
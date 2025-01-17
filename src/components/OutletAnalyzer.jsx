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

      const excludedOutlets = [
        'Coffee Cart',
        'Concourse Food Van',
        'Cricket Viewing Rooms'
      ];

      // Changed to collect all outlets in two main categories
      const combinedOutlets = {
        fbOutlets: [],
        corporate: []
      };

      workbook.SheetNames.forEach(sheetName => {
        if (sheetName === 'Lookup Table') return;

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

        for (let i = 5; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row[0] && 
              row[0] !== 'OUTLET NAME' && 
              row[2] && 
              row[2] !== '0:00:00' &&
              !excludedOutlets.some(excluded => row[0].includes(excluded))) {
            
            const outletInfo = {
              name: row[0],
              section: sheetName  // Keep track of original section if needed
            };

            // Sort into F&B or Corporate
            if (row[0].toLowerCase().startsWith('outlet') || 
                row[0].toLowerCase().startsWith('bar')) {
              combinedOutlets.fbOutlets.push(outletInfo);
            } else {
              combinedOutlets.corporate.push(outletInfo);
            }
          }
        }
      });

      setOutletData(combinedOutlets);
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

      {outletData && (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '40px'
        }}>
          {/* F&B Outlets Section */}
          <div>
            <h2 style={{ 
              marginBottom: '15px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>F&B OUTLETS</h2>
            {outletData.fbOutlets.map((outlet, idx) => (
              <div key={`fb-${idx}`}>
                <p>{outlet.name}</p>
              </div>
            ))}
          </div>

          {/* Corporate Section */}
          <div>
            <h2 style={{ 
              marginBottom: '15px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>CORPORATE</h2>
            {outletData.corporate.map((outlet, idx) => (
              <div key={`corp-${idx}`}>
                <p>{outlet.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutletAnalyzer;
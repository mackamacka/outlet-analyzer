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
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">F&B Outlet Status Analyzer</h1>

      {/* Upload Section */}
      <div className="mb-8 border-2 border-dashed border-blue-300 rounded-lg p-6 bg-white hover:border-blue-500 transition-colors">
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".xlsx,.xls"
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="h-12 w-12 text-blue-500" />
          <span className="text-lg font-medium">Click to upload F&B outlet spreadsheet</span>
          <span className="text-sm text-gray-500">Supports Excel files (.xlsx, .xls)</span>
        </label>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {/* Event Details */}
      {eventDetails && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{eventDetails.title}</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded shadow-sm">
              <div className="text-gray-500">Corporate Dining</div>
              <div className="font-bold">{eventDetails.corporateDining}</div>
            </div>
            <div className="p-3 bg-white rounded shadow-sm">
              <div className="text-gray-500">Corporate Suites</div>
              <div className="font-bold">{eventDetails.corporateSuites}</div>
            </div>
            <div className="p-3 bg-white rounded shadow-sm">
              <div className="text-gray-500">Total Attendance</div>
              <div className="font-bold">{eventDetails.totalAttendance}</div>
            </div>
          </div>
        </div>
      )}

      {/* Results Display - Only showing open outlets */}
      {outletData && Object.keys(outletData).map(section => {
        const openOutlets = outletData[section].filter(outlet => outlet.isOpen);
        
        return openOutlets.length > 0 ? (
          <div key={section} className="mb-8">
            <h2 className="text-2xl font-bold bg-blue-600 text-white p-4 rounded-t-lg">
              {section}
            </h2>
            <div className="bg-white border border-gray-200 rounded-b-lg divide-y">
              {openOutlets.map((outlet, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-lg">{outlet.name}</div>
                      <div className="text-gray-600">{outlet.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 font-medium">
                        {outlet.openTime} - {outlet.closeTime}
                      </div>
                      {outlet.staffCount && (
                        <div className="text-sm text-gray-500">
                          Staff: {outlet.staffCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
};

export default OutletAnalyzer;
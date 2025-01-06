import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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

        // Get event details from first row if not already captured
        if (!eventInfo.title && jsonData[0] && jsonData[0][0]) {
          eventInfo.title = jsonData[0][0];
          eventInfo.corporateDining = jsonData[1]?.[0];
          eventInfo.corporateSuites = jsonData[2]?.[0];
          eventInfo.totalAttendance = jsonData[3]?.[8];
        }

        const outlets = [];
        // Start processing from row 5 (where outlet data begins)
        for (let i = 5; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row[0] && row[0] !== 'OUTLET NAME') {
            outlets.push({
              name: row[0],
              location: row[1],
              bmsOn: row[2],
              openTime: row[3],
              closeTime: row[4],
              bmsOff: row[5],
              extendedTrading: row[6],
              staffCount: row[7],
              client: row[8],
              comments: row[9],
              guestCount: row[10],
              isOpen: row[3] && row[3].toString().toLowerCase() !== 'closed'
            });
          }
        }

        if (outlets.length > 0) {
          outletsBySection[sheetName] = outlets.filter(outlet => outlet.isOpen);
        }
      });

      setEventDetails(eventInfo);
      setOutletData(outletsBySection);
      setError('');
    } catch (err) {
      setError('Error processing file: ' + err.message);
      setOutletData(null);
      setEventDetails(null);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processExcelFile(file);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>F&B Outlet Status Analyzer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
              <Upload className="h-12 w-12 text-gray-400" />
              <span className="text-sm text-gray-600">
                Click to upload F&B outlet spreadsheet
              </span>
              <span className="text-xs text-gray-400">
                Supports Excel files (.xlsx, .xls)
              </span>
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          {/* Event Details */}
          {eventDetails && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{eventDetails.title}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>{eventDetails.corporateDining}</div>
                <div>{eventDetails.corporateSuites}</div>
                <div className="col-span-2">{eventDetails.totalAttendance}</div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {outletData && Object.keys(outletData).map(section => (
            outletData[section].length > 0 ? (
              <div key={section} className="space-y-4">
                <h3 className="text-xl font-bold text-center py-4 bg-gray-100 rounded-lg mb-4 text-gray-800">
                  {section}
                </h3>
                <div className="grid gap-2">
                  {outletData[section].map((outlet, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between bg-green-50"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{outlet.name}</div>
                        <div className="text-sm text-gray-600">{outlet.location}</div>
                      </div>
                      <div className="flex flex-col sm:items-end space-y-1">
                        <span className="text-sm font-medium text-green-600">
                          {outlet.openTime} - {outlet.closeTime}
                        </span>
                        {outlet.staffCount && (
                          <span className="text-xs text-gray-500">
                            Staff: {outlet.staffCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OutletAnalyzer;
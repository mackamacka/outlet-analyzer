import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

const OutletAnalyzer = () => {
  // ... keep existing state and functions ...

  return (
    <div className="w-screen h-screen bg-gray-100 overflow-auto p-4">
      <div className="max-w-[1800px] mx-auto bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-blue-600 p-4 rounded-t-lg sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-white">F&B Outlet Status Analyzer</h1>
        </div>

        {/* Content Area */}
        <div className="p-4">
          {/* Upload Section - Fixed at top */}
          <div className="mb-4 border-2 border-dashed border-blue-300 rounded-lg p-4 bg-white">
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".xlsx,.xls"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center space-x-4 cursor-pointer"
            >
              <Upload className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-lg font-medium text-gray-700">Click to upload F&B outlet spreadsheet</div>
                <div className="text-sm text-gray-500">Supports Excel files (.xlsx, .xls)</div>
              </div>
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          {/* Event Details */}
          {eventDetails && (
            <div className="mb-4 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-3">{eventDetails.title}</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Corporate Dining</div>
                  <div className="font-semibold">{eventDetails.corporateDining}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Corporate Suites</div>
                  <div className="font-semibold">{eventDetails.corporateSuites}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Total Attendance</div>
                  <div className="font-semibold">{eventDetails.totalAttendance}</div>
                </div>
              </div>
            </div>
          )}

          {/* Results in scrollable container */}
          <div className="overflow-auto max-h-[calc(100vh-300px)]">
            {outletData && Object.keys(outletData).map(section => (
              outletData[section].length > 0 ? (
                <div key={section} className="mb-4">
                  <h2 className="text-xl font-bold bg-gray-800 text-white py-2 px-4 rounded-t-lg sticky top-0">
                    {section}
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-b-lg">
                    {outletData[section].map((outlet, index) => (
                      <div 
                        key={index}
                        className={`p-3 flex justify-between items-center border-b border-gray-100 hover:bg-blue-50 ${
                          index === outletData[section].length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-gray-800">{outlet.name}</div>
                          <div className="text-sm text-gray-600">{outlet.location}</div>
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
                    ))}
                  </div>
                </div>
              ) : null
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutletAnalyzer;
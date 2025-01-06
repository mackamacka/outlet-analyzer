import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

const OutletAnalyzer = () => {
  // ... keep existing state and processExcelFile function ...

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-[1200px] mx-auto bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-blue-600 p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold text-white text-center">F&B Outlet Status Analyzer</h1>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Upload Section */}
          <div className="mb-8 border-2 border-dashed border-blue-300 rounded-lg p-6 bg-white hover:border-blue-500 transition-colors cursor-pointer">
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".xlsx,.xls"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center space-y-2 cursor-pointer"
            >
              <Upload className="w-12 h-12 text-blue-500" />
              <span className="text-lg font-medium text-gray-700">Click to upload F&B outlet spreadsheet</span>
              <span className="text-sm text-gray-500">Supports Excel files (.xlsx, .xls)</span>
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          {/* Event Details */}
          {eventDetails && (
            <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{eventDetails.title}</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Corporate Dining</div>
                  <div className="font-semibold">{eventDetails.corporateDining}</div>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Corporate Suites</div>
                  <div className="font-semibold">{eventDetails.corporateSuites}</div>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <div className="text-sm text-gray-500">Total Attendance</div>
                  <div className="font-semibold">{eventDetails.totalAttendance}</div>
                </div>
              </div>
            </div>
          )}

          {/* Outlets Display */}
          {outletData && Object.keys(outletData).map(section => (
            outletData[section].length > 0 ? (
              <div key={section} className="mb-8">
                <h2 className="text-2xl font-bold bg-gray-800 text-white py-3 px-6 rounded-t-lg">
                  {section}
                </h2>
                <div className="bg-white border border-gray-200 rounded-b-lg">
                  {outletData[section].map((outlet, index) => (
                    <div 
                      key={index}
                      className={`p-4 flex justify-between items-center border-b border-gray-100 hover:bg-blue-50 ${
                        index === outletData[section].length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-lg text-gray-800">{outlet.name}</div>
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
                  ))}
                </div>
              </div>
            ) : null
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutletAnalyzer;
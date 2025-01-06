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
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column'
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
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '20px',
          flex: 1
        }}>
          {Object.keys(outletData).slice(0, 5).map((section, index) => (
            <div key={section} style={{
              gridColumn: index === 4 ? '2 / 3' : 'auto',
              gridRow: index >= 3 ? '2 / 3' : '1 / 2'
            }}>
              <h2>{section}</h2>
              {outletData[section].map((outlet, idx) => (
                <div key={idx}>
                  <p>{outlet.name} - {outlet.location}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OutletAnalyzer;
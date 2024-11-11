import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Papa from 'papaparse';
import ProfilePreview from './ProfilePreview.jsx';
import DetailedProfile from './DetailedProfile.jsx';
import './Search.css'
const App = () => {
  const [data, setData] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Load and parse the CSV file on mount
  useEffect(() => {
    fetch("r20.csv")
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => setData(result.data),
        });
      });
  }, []);

  // Filter names for autocomplete suggestions based on input
  const handleSearch = useCallback((searchText) => {
    const filtered = data.filter(item => 
      item.NAME && item.NAME.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredNames(filtered);
  }, [data]);

  // Select a profile to view more details
  const handleSelectProfile = useCallback((profile) => {
    setSelectedProfile(profile);
    setFilteredNames([])
  }, []);

  return (
    <div className="app-previewProfile">
      <h1>Student Directory</h1>
      <input
        type="text"
        placeholder="Search by name..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="suggestions">
        {!selectedProfile && filteredNames.map((item, index) => (
          <ProfilePreview
            key={index}
            profile={item}
            onSelect={() => handleSelectProfile(item)}
          />
        ))}
      </div>
      
      {selectedProfile && (
        <DetailedProfile profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}
    </div>
  );
};

export default App;

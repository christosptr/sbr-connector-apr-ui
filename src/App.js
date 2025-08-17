import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [businessName, setBusinessName] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSearchTerm, setLastSearchTerm] = useState('');

  const handleSearch = async () => {
    if (!businessName.trim()) {
      setError('Please enter a business name');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResults(null);
    setLastSearchTerm(businessName);

    try {
      // Check if input looks like an ABN (11 digits)
      const cleanInput = businessName.replace(/\s+/g, '');
      const isABN = /^\d{11}$/.test(cleanInput);

      if (isABN) {
        // Call ABN lookup microservice via proxy
        const response = await axios.get(`/microsvc/BUSINESS/ABN_LOOKUP_SERVICE/lookup/${cleanInput}`);
        setSearchResults({
          type: 'abn',
          data: response.data
        });
      } else {
        // Call business name search microservice via proxy
        const encodedName = encodeURIComponent(businessName);
        const response = await axios.get(`/microsvc/BUSINESS/ABN_NAME_SEARCH/search?name=${encodedName}`);
        setSearchResults({
          type: 'name',
          data: response.data
        });
      }
    } catch (err) {
      console.error('Search error:', err);
      if (err.response && err.response.data) {
        setError(`Error: ${err.response.data.message || err.response.data.error || 'Search failed'}`);
      } else {
        setError('Network error. Please check if the microservice is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTryAnother = () => {
    setBusinessName('');
    setSearchResults(null);
    setError('');
    // Focus the input field
    document.querySelector('.search-input')?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderResults = () => {
    if (!searchResults) return null;

    if (searchResults.type === 'abn') {
      const data = searchResults.data;
      if (data.error) {
        return (
          <div className="results error">
            <h3>ABN Lookup Result</h3>
            <p><strong>Error:</strong> {data.message}</p>
            <p><strong>ABN:</strong> {data.abn}</p>
            <p><strong>Mode:</strong> {data.mode}</p>
          </div>
        );
      }

      return (
        <div className="results success">
          <h3>Business Found</h3>
          <div className="business-details">
            <p><strong>ABN:</strong> {data.abn}</p>
            <p><strong>Entity Name:</strong> {data.entityName}</p>
            <p><strong>Entity Type:</strong> {data.entityType}</p>
            <p><strong>GST Status:</strong> {data.gstStatus}</p>
            <p><strong>ABR Status:</strong> {data.abrStatus}</p>
            <p><strong>Mode:</strong> {data.mode}</p>
            <p><strong>Retrieved:</strong> {new Date(data.timestamp).toLocaleString()}</p>
          </div>
        </div>
      );
    }

    if (searchResults.type === 'name') {
      const data = searchResults.data;
      if (data.error) {
        return (
          <div className="results error">
            <h3>Business Name Search Result</h3>
            <p><strong>Error:</strong> {data.message}</p>
            <p><strong>Search Term:</strong> {data.searchTerm || businessName}</p>
          </div>
        );
      }

      // Handle successful business name search results
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        // Business name is taken - show the specific design
        return (
          <div className="results error">
            <div className="business-taken">
              <div className="business-taken-header">
                <div className="business-taken-icon">✕</div>
                <span>That's a shame! This business name is already taken.</span>
              </div>
              <div className="business-taken-name">{lastSearchTerm}</div>
              <button className="try-another-button" onClick={handleTryAnother}>
                Try another name
              </button>
              <div className="business-taken-tip">
                TIP: If the business name you want isn't available<br />
                try adding another word or two.
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="results success">
            <h3>Great News!</h3>
            <p>The business name "{lastSearchTerm}" appears to be available!</p>
            <p>You can proceed with your business registration.</p>
          </div>
        );
      }
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Business Name Registration Australia</h1>
        <p>Here you can register your business name, ABN and tax obligations with one easy application.</p>
      </header>

      <main className="main-content">
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your business name to get started"
              className="search-input"
              disabled={loading}
            />
            <button 
              onClick={handleSearch}
              className="search-button"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Check name'}
            </button>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {renderResults()}
        </div>
      </main>

      <footer className="footer">
        <p>Tip: You can search by business name or enter an 11-digit ABN for direct lookup</p>
      </footer>
    </div>
  );
};

export default App;
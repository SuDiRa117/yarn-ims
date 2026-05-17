import React, { useEffect, useState } from 'react';
import { inventoryAPI } from '../services/api';
import useInventoryStore from '../store/inventoryStore';
import './StockView.css';

const StockView = () => {
  const { inventory, setInventory, isLoading, setIsLoading } = useInventoryStore();
  const [filters, setFilters] = useState({
    search: '',
    style: '',
    colour: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const response = await inventoryAPI.getInventoryStatus();
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [setInventory, setIsLoading]);

  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleExport = async (format) => {
    try {
      const response = format === 'excel'
        ? await inventoryAPI.exportToExcel()
        : await inventoryAPI.exportToPDF();

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory-report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.lot_number.toLowerCase().includes(filters.search.toLowerCase()) ||
                         item.yarn_name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStyle = !filters.style || item.style === filters.style;
    const matchesColour = !filters.colour || item.colour === filters.colour;
    
    return matchesSearch && matchesStyle && matchesColour;
  });

  const paginatedData = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  const summary = {
    totalCones: inventory.reduce((sum, item) => sum + (item.received_cones || 0), 0),
    totalWeight: inventory.reduce((sum, item) => sum + (item.received_weight || 0), 0),
    totalIssued: inventory.reduce((sum, item) => sum + (item.issued_cones || 0), 0),
    itemsPendingQC: inventory.filter(item => item.qc_pending > 0).length
  };

  return (
    <div className="stock-view">
      <div className="stock-container">
        <h1>Stock Inventory View</h1>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-label">Total Cones</div>
            <div className="card-value">{summary.totalCones}</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Total Weight</div>
            <div className="card-value">{summary.totalWeight.toFixed(2)} kg</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Total Issued</div>
            <div className="card-value">{summary.totalIssued}</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Pending QC</div>
            <div className="card-value">{summary.itemsPendingQC}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Search by lot number or yarn name..."
              value={filters.search}
              onChange={handleSearch}
            />
          </div>

          <div className="filters-section">
            <select
              name="style"
              value={filters.style}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Styles</option>
              <option value="Cobalt">Cobalt</option>
              <option value="Decand">Decand</option>
              <option value="OCL Collar">OCL Collar</option>
            </select>

            <select
              name="colour"
              value={filters.colour}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Colours</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Yellow">Yellow</option>
            </select>
          </div>

          <div className="export-section">
            <button onClick={() => handleExport('excel')} className="btn btn-export">
              📊 Export Excel
            </button>
            <button onClick={() => handleExport('pdf')} className="btn btn-export">
              📄 Export PDF
            </button>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="loading">Loading inventory...</div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Lot Number</th>
                    <th>Yarn Name</th>
                    <th>Style</th>
                    <th>Colour</th>
                    <th>Received</th>
                    <th>Issued</th>
                    <th>Rejected</th>
                    <th>Available</th>
                    <th>Date Received</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, idx) => (
                      <tr key={idx}>
                        <td className="lot-number">{item.lot_number}</td>
                        <td>{item.yarn_name}</td>
                        <td>{item.style}</td>
                        <td>
                          <span className="colour-badge" style={{ backgroundColor: item.colour.toLowerCase() }}>
                            {item.colour}
                          </span>
                        </td>
                        <td>{item.received_cones}</td>
                        <td>{item.issued_cones}</td>
                        <td>{item.rejected_cones}</td>
                        <td className={`available-balance ${item.available_balance < 50 ? 'low-stock' : ''}`}>
                          {item.available_balance}
                        </td>
                        <td>{new Date(item.date_received).toLocaleDateString()}</td>
                        <td>{new Date(item.updated_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="no-data">No inventory records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn-pagination"
                >
                  ← Previous
                </button>
                <span className="page-info">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn-pagination"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StockView;

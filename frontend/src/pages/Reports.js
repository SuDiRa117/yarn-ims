import React, { useEffect, useState } from 'react';
import { reportsAPI, authAPI } from '../services/api';
import './Reports.css';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('export');
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    userId: '',
    dateFrom: '',
    dateTo: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'audit') {
      fetchAuditLogs();
      fetchUsers();
    }
  }, [activeTab]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await reportsAPI.getAuditLogs(filters);
      setAuditLogs(response.data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    fetchAuditLogs();
  };

  const handleExport = async (format) => {
    try {
      const response = format === 'excel'
        ? await reportsAPI.exportToExcel()
        : await reportsAPI.exportToPDF();

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

  return (
    <div className="reports">
      <div className="reports-container">
        <h1>Reports & Analytics</h1>

        <div className="report-tabs">
          {['export', 'audit'].map(tab => (
            <button
              key={tab}
              className={`report-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'export' ? '📊 Export Reports' : '📋 Audit Logs'}
            </button>
          ))}
        </div>

        {activeTab === 'export' && (
          <div className="export-section">
            <div className="export-card">
              <h2>Export to Excel</h2>
              <p>Download complete inventory data in Excel format</p>
              <button className="export-btn" onClick={() => handleExport('excel')}>
                📥 Download Excel
              </button>
            </div>

            <div className="export-card">
              <h2>Export to PDF</h2>
              <p>Generate a formatted PDF report of inventory</p>
              <button className="export-btn" onClick={() => handleExport('pdf')}>
                📄 Download PDF
              </button>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="audit-section">
            <div className="audit-filters">
              <div className="filter-group">
                <label>User</label>
                <select
                  name="userId"
                  value={filters.userId}
                  onChange={handleFilterChange}
                >
                  <option value="">All Users</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>From Date</label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group">
                <label>To Date</label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                />
              </div>

              <button className="apply-filters-btn" onClick={handleApplyFilters}>
                Apply Filters
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading audit logs...</div>
            ) : (
              <div className="audit-logs">
                {auditLogs.length > 0 ? (
                  <table className="audit-table">
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Module</th>
                        <th>User</th>
                        <th>Old Value</th>
                        <th>New Value</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log, idx) => (
                        <tr key={idx}>
                          <td>
                            <span className={`action-badge action-${log.action.toLowerCase()}`}>
                              {log.action}
                            </span>
                          </td>
                          <td>{log.module}</td>
                          <td>{log.username}</td>
                          <td className="log-value">
                            {log.old_value ? JSON.stringify(JSON.parse(log.old_value), null, 2).substring(0, 100) + '...' : '-'}
                          </td>
                          <td className="log-value">
                            {log.new_value ? JSON.stringify(JSON.parse(log.new_value), null, 2).substring(0, 100) + '...' : '-'}
                          </td>
                          <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-logs">No audit logs found</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

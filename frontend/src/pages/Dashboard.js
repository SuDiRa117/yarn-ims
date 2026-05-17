import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { inventoryAPI } from '../services/api';
import useInventoryStore from '../store/inventoryStore';
import './Dashboard.css';

const Dashboard = () => {
  const { analytics, setAnalytics, isLoading, setIsLoading } = useInventoryStore();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await inventoryAPI.getAnalytics();
        setAnalytics(response.data);
        generateAlerts(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [setAnalytics, setIsLoading]);

  const generateAlerts = (data) => {
    const newAlerts = [];
    
    if (data.summary.totalRejected / data.summary.totalCones > 0.1) {
      newAlerts.push({ type: 'critical', message: 'High rejection rate (>10%)' });
    }
    
    if (data.summary.totalQCPending > 50) {
      newAlerts.push({ type: 'warning', message: `${data.summary.totalQCPending} items pending QC` });
    }

    setAlerts(newAlerts);
  };

  if (isLoading) return <div className="loading">Loading analytics...</div>;

  const statusData = [
    { name: 'Received', value: analytics?.summary.totalCones || 0, fill: '#667eea' },
    { name: 'Issued', value: analytics?.summary.totalIssued || 0, fill: '#764ba2' },
    { name: 'Rejected', value: analytics?.summary.totalRejected || 0, fill: '#f093fb' },
    { name: 'QC', value: analytics?.summary.totalQCPending || 0, fill: '#fbbf24' }
  ];

  const styleData = Object.entries(analytics?.styleDistribution || {}).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="dashboard">
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          {alerts.map((alert, i) => (
            <div key={i} className={`alert alert-${alert.type}`}>
              ⚠️ {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="kpi-cards">
        <div className="kpi-card">
          <div className="kpi-label">Total Received</div>
          <div className="kpi-value">{analytics?.summary.totalCones || 0}</div>
          <div className="kpi-subtext">{(analytics?.summary.totalWeight || 0).toFixed(2)} kg</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Issued</div>
          <div className="kpi-value">{analytics?.summary.totalIssued || 0}</div>
          <div className="kpi-subtext">{(analytics?.summary.turnoverRate || 0).toFixed(1)}% turnover</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Rejected</div>
          <div className="kpi-value">{analytics?.summary.totalRejected || 0}</div>
          <div className="kpi-subtext">Rejection rate</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Under QC</div>
          <div className="kpi-value">{analytics?.summary.totalQCPending || 0}</div>
          <div className="kpi-subtext">Pending items</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Style Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={styleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

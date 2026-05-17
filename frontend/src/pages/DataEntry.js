import React, { useState } from 'react';
import { inventoryAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import './DataEntry.css';

const DataEntry = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    lot_number: '',
    style: 'Cobalt',
    yarn_name: '',
    weight_kg: '',
    number_of_cones: '',
    colour: '',
    date_received: new Date().toISOString().split('T')[0],
    notes: '',
    // Issue specific
    issued_to: '',
    quantity_issued: '',
    purpose: '',
    expected_return_date: '',
    // Reject specific
    rejection_reason: '',
    rejection_details: '',
    severity_level: 'Minor',
    can_be_reused: false,
    // QC specific
    test_type: '',
    test_status: 'Pending'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      const date_received = formData.date_received ? new Date(formData.date_received) : new Date();

      switch (activeTab) {
        case 'received':
          response = await inventoryAPI.createReceivedYarn({
            lot_number: formData.lot_number,
            style: formData.style,
            yarn_name: formData.yarn_name,
            weight_kg: parseFloat(formData.weight_kg),
            number_of_cones: parseInt(formData.number_of_cones),
            colour: formData.colour,
            date_received,
            notes: formData.notes
          });
          break;

        case 'issued':
          response = await inventoryAPI.createIssuedYarn({
            received_yarn_id: 1, // Should be fetched from search
            lot_number: formData.lot_number,
            issued_to: formData.issued_to,
            quantity_issued: parseInt(formData.quantity_issued),
            purpose: formData.purpose,
            issue_date: new Date(),
            expected_return_date: formData.expected_return_date
          });
          break;

        case 'rejected':
          response = await inventoryAPI.createRejectedYarn({
            received_yarn_id: 1,
            lot_number: formData.lot_number,
            rejection_reason: formData.rejection_reason,
            rejection_details: formData.rejection_details,
            severity_level: formData.severity_level,
            can_be_reused: formData.can_be_reused,
            rejection_date: new Date()
          });
          break;

        case 'qc':
          response = await inventoryAPI.createQCYarn({
            received_yarn_id: 1,
            lot_number: formData.lot_number,
            test_type: formData.test_type,
            test_status: formData.test_status,
            expected_completion_date: formData.expected_return_date
          });
          break;

        default:
          break;
      }

      setMessage(`✓ Record saved successfully!`);
      setFormData({
        lot_number: '',
        style: 'Cobalt',
        yarn_name: '',
        weight_kg: '',
        number_of_cones: '',
        colour: '',
        date_received: new Date().toISOString().split('T')[0],
        notes: '',
        issued_to: '',
        quantity_issued: '',
        purpose: '',
        expected_return_date: '',
        rejection_reason: '',
        rejection_details: '',
        severity_level: 'Minor',
        can_be_reused: false,
        test_type: '',
        test_status: 'Pending'
      });

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`✗ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-entry">
      <div className="entry-container">
        <h1>Data Entry Module</h1>

        {message && (
          <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="tabs">
          {['received', 'issued', 'rejected', 'qc'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Yarn
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="form">
          {/* Common Fields */}
          <div className="form-group">
            <label>Lot Number *</label>
            <input
              type="text"
              name="lot_number"
              value={formData.lot_number}
              onChange={handleInputChange}
              placeholder="LOT-2024-001"
              required
            />
          </div>

          {activeTab === 'received' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Style *</label>
                  <select name="style" value={formData.style} onChange={handleInputChange}>
                    <option>Cobalt</option>
                    <option>Decand</option>
                    <option>OCL Collar</option>
                    <option>Custom</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Yarn Name *</label>
                  <input
                    type="text"
                    name="yarn_name"
                    value={formData.yarn_name}
                    onChange={handleInputChange}
                    placeholder="Enter yarn name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Weight (kg) *</label>
                  <input
                    type="number"
                    name="weight_kg"
                    value={formData.weight_kg}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Number of Cones *</label>
                  <input
                    type="number"
                    name="number_of_cones"
                    value={formData.number_of_cones}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Colour *</label>
                  <input
                    type="text"
                    name="colour"
                    value={formData.colour}
                    onChange={handleInputChange}
                    placeholder="Enter colour"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date Received</label>
                  <input
                    type="date"
                    name="date_received"
                    value={formData.date_received}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes/Remarks</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Optional notes..."
                />
              </div>
            </>
          )}

          {activeTab === 'issued' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Issued To *</label>
                  <input
                    type="text"
                    name="issued_to"
                    value={formData.issued_to}
                    onChange={handleInputChange}
                    placeholder="Department or recipient name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quantity Issued *</label>
                  <input
                    type="number"
                    name="quantity_issued"
                    value={formData.quantity_issued}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Purpose</label>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    placeholder="Production, Testing, Sample, etc."
                  />
                </div>

                <div className="form-group">
                  <label>Expected Return Date</label>
                  <input
                    type="date"
                    name="expected_return_date"
                    value={formData.expected_return_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'rejected' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Rejection Reason *</label>
                  <select
                    name="rejection_reason"
                    value={formData.rejection_reason}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select reason...</option>
                    <option>Defect Type</option>
                    <option>Weight Variance</option>
                    <option>Color Mismatch</option>
                    <option>Contamination</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Severity Level *</label>
                  <select name="severity_level" value={formData.severity_level} onChange={handleInputChange}>
                    <option>Minor</option>
                    <option>Major</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Rejection Details</label>
                <textarea
                  name="rejection_details"
                  value={formData.rejection_details}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Detailed description of rejection..."
                />
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  name="can_be_reused"
                  checked={formData.can_be_reused}
                  onChange={handleInputChange}
                  id="can_reuse"
                />
                <label htmlFor="can_reuse">Can Be Reused?</label>
              </div>
            </>
          )}

          {activeTab === 'qc' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Test Type *</label>
                  <select name="test_type" value={formData.test_type} onChange={handleInputChange} required>
                    <option value="">Select test type...</option>
                    <option>Tensile Strength</option>
                    <option>Color Fastness</option>
                    <option>Shrinkage</option>
                    <option>Count Verification</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Test Status</label>
                  <select name="test_status" value={formData.test_status} onChange={handleInputChange}>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Failed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Expected Completion Date</label>
                <input
                  type="date"
                  name="expected_return_date"
                  value={formData.expected_return_date}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Record'}
            </button>
            <button type="reset" className="btn btn-secondary">
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataEntry;

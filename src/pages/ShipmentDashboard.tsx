import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShipmentDashboard, updateShipmentStatus } from '../api';
import type { ShipmentDashboardData, ShipmentModel } from '../models/ShipmentModel';
import toast from 'react-hot-toast';

export default function ShipmentDashboard() {
  const [dashboardData, setDashboardData] = useState<ShipmentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentModel | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  useEffect(() => {
    // Check if user has permission to access this page
    if (!isLoggedIn) {
      toast.error("Please log in to access this page");
      navigate('/login');
      return;
    }

    if (userRole !== 'admin' && userRole !== 'shipment_manager') {
      toast.error("You don't have permission to access this page");
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [isLoggedIn, userRole, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getShipmentDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-200 text-green-900';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedShipment || !newStatus) {
      toast.error('Please select a valid status');
      return;
    }

    try {
      setIsUpdating(true);
      const result = await updateShipmentStatus(String(selectedShipment.id), newStatus);
      
      // Update the shipment in the dashboard data
      if (dashboardData) {
        const updatedShipments = dashboardData.recent_shipments.map(shipment =>
          shipment.id === selectedShipment.id ? result.shipment : shipment
        );

        // Update status counts
        const newStatusCounts = { ...dashboardData.status_counts };
        if (selectedShipment.status in newStatusCounts) {
          newStatusCounts[selectedShipment.status]--;
        }
        if (newStatus in newStatusCounts) {
          newStatusCounts[newStatus] = (newStatusCounts[newStatus] || 0) + 1;
        }

        setDashboardData({
          ...dashboardData,
          recent_shipments: updatedShipments,
          status_counts: newStatusCounts
        });
      }

      toast.success(result.message);
      closeStatusModal();
    } catch (error: any) {
      console.error('Error updating shipment status:', error);
      toast.error(error.response?.data?.error || 'Failed to update shipment status');
    } finally {
      setIsUpdating(false);
    }
  };

  const openStatusModal = (shipment: ShipmentModel) => {
    setSelectedShipment(shipment);
    setNewStatus(shipment.status);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setSelectedShipment(null);
    setNewStatus('');
    setIsStatusModalOpen(false);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center text-red-600">
          Failed to load dashboard data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shipment Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of shipments and statistics for {userRole === 'admin' ? 'administrators' : 'shipment managers'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Shipments</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.total_shipments}</p>
            </div>
          </div>
        </div>

        {Object.entries(dashboardData.status_counts).map(([status, count]) => (
          <div key={status} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 capitalize">{status}</p>
                <p className="text-2xl font-semibold text-gray-900">{count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Shipments</h2>
          <p className="text-sm text-gray-600">Latest 10 shipments in the system</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shipment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.recent_shipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No shipments found
                  </td>
                </tr>
              ) : (
                dashboardData.recent_shipments.map((shipment: ShipmentModel) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{String(shipment.id).slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.order_id ? `#${String(shipment.order_id).slice(0, 8)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.tracking_number || 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(shipment.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => openStatusModal(shipment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isStatusModalOpen && selectedShipment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">
                Update Shipment Status
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Shipment ID: #{String(selectedShipment.id).slice(0, 8)}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Current Status: {selectedShipment.status}
                </p>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={isUpdating}
                >
                  <option value="">Select new status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="in_transit">In Transit</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={closeStatusModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating || !newStatus}
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 

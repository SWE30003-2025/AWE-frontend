import { Link, useLocation } from "react-router-dom";

import type { OrderModel } from "../models/OrderModel";

export default function OrderConfirmation() {
  const location = useLocation();
  const order: OrderModel | undefined = location.state?.order;
  
  const orderId = order?.id || location.state?.orderId;

  return (
    <div className="max-w-2xl mx-auto p-4 text-center mt-20">
      <div className="bg-green-50 border border-green-200 rounded-lg p-8">
        <div className="mb-6">
          <svg className="mx-auto h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          Thank you for your order!
        </h2>
        
        <p className="text-gray-700 mb-6">
          Your order has been placed successfully and payment has been processed from your wallet.
        </p>
        
        {orderId && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Order ID
            </p>

            <p className="text-lg font-mono font-semibold text-gray-900">
              {orderId}
            </p>
          </div>
        )}
        
        {order?.shipment && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Tracking Number
            </p>

            <p className="text-lg font-mono font-semibold text-blue-600">
              {order.shipment.tracking_number}
            </p>

            <div className="mt-3 text-sm text-gray-600">
              <p>
                <span className="font-medium">Carrier:</span> {order.shipment.carrier}
              </p>

              <p>
                <span className="font-medium">Status:</span> <span className="capitalize">{order.shipment.status}</span>
              </p>

              {order.shipment.estimated_delivery && (
                <p>
                  <span className="font-medium">Estimated Delivery:</span> {new Date(order.shipment.estimated_delivery).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            🚚 Your order is being prepared for shipment
          </p>

          <p className="text-sm text-gray-600">
            📧 You can track your order status in your order history
          </p>

          {order?.shipment?.tracking_number && (
            <p className="text-sm text-gray-600">
              📦 Track your package with tracking number: <span className="font-mono font-medium">{order.shipment.tracking_number}</span>
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            to="/my-orders" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            View My Orders
          </Link>

          <Link 
            to="/products" 
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

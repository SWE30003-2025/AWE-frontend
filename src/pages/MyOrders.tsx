import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getUserOrders, payInvoice, getCurrentUser, getOrderInvoice } from "../api";

import type { OrderModel } from "../models/OrderModel";
import type { UserModel } from "../models/UserModel";

interface ExtendedOrderModel extends OrderModel {
  payment_status?: string;
  invoice?: {
    id: string;
    invoice_number: string;
    amount_due: string;
    status: string;
    due_date: string;
    created_at?: string;
    receipts?: Array<{
      id: string;
      receipt_number: string;
      amount_paid: string;
      created_at: string;
    }>;
  };
  receipts?: Array<{
    id: string;
    receipt_number: string;
    amount_paid: string;
    created_at: string;
  }>;
};

export default function MyOrders() {
  const [orders, setOrders] = useState<ExtendedOrderModel[]>([]);
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [ordersData, userData] = await Promise.all([
        getUserOrders(),
        getCurrentUser()
      ]);
      
      // Fetch invoices for orders that have an invoice ID
      const ordersWithInvoices = await Promise.all(
        ordersData.map(async (order) => {
          if (order.invoice) {
            const invoice = await getOrderInvoice(order.id.toString());

            if (invoice) {
              return { ...order, invoice };
            }
          }

          return order;
        })
      );
      
      const sortedOrders = ordersWithInvoices.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setOrders(sortedOrders);

      setUser(userData);
    } catch (error) {
      console.error("Error fetching data:", error);

      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePayInvoice = async (invoiceId: string, amountDue: number) => {
    if (!user || user.wallet === undefined) {
      toast.error("Unable to process payment. User wallet information not available.");
      return;
    }

    const userWallet = Number(user.wallet);
    if (isNaN(userWallet)) {
        toast.error("Invalid wallet balance.");

        return;
    }

    if (userWallet < amountDue) {
      toast.error(`Insufficient wallet balance. Required: $${amountDue.toFixed(2)}, Available: $${userWallet.toFixed(2)}`);

      return;
    }

    setPayingInvoice(invoiceId);
    try {
      await payInvoice(invoiceId);

      toast.success("Payment successful! Your order is now being processed for shipment.");

      await fetchData();
    } catch (error: any) {
      console.error("Payment error:", error);

      const errorMessage = error.response?.data?.error || "Payment failed. Please try again.";

      toast.error(errorMessage);
    } finally {
      setPayingInvoice(null);
    }
  };

  const getOrderStatus = (order: ExtendedOrderModel) => {
    if (order.payment_status === "paid") {
      return { text: "Paid", color: "text-green-600 bg-green-100" };
    }

    if (order.invoice?.status === "paid") {
      return { text: "Paid", color: "text-green-600 bg-green-100" };
    }

    if (order.payment_status === "pending" || order.invoice?.status === "pending") {
      return { text: "Payment Pending", color: "text-yellow-600 bg-yellow-100" };
    }

    return { text: "Unknown", color: "text-gray-600 bg-gray-100" };
  };

  const isOverdue = (dueDateStr: string) => {
    return new Date(dueDateStr) < new Date();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-6">
          My Orders
        </h2>

        <p className="text-gray-500">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          My Orders
        </h2>
        
        {user && user.wallet !== undefined && !isNaN(Number(user.wallet)) && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">
              Wallet Balance: 
            </span>

            <span className="font-bold text-green-600">
              ${Number(user.wallet).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            No orders found.
          </p>

          <button 
            onClick={() => window.location.href = "/products"}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const status = getOrderStatus(order);

            const canPay = order.invoice && 
                          order.invoice.status === "pending" && 
                          user && 
                          user.wallet !== undefined &&
                          !isNaN(Number(user.wallet)) && 
                          Number(user.wallet) >= parseFloat(order.invoice.amount_due);
            
            return (
              <div key={order.id} className="border rounded-lg bg-white shadow-sm">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Order #{order.id}
                      </h3>

                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.text}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">
                      Items:
                    </h4>

                    <div className="space-y-1">
                      {order.items.map((item, idx) => {
                        const individualPrice = parseFloat(
                          item.price || item.price_at_purchase?.toString() || "0"
                        );

                        const totalPrice = individualPrice * item.quantity;

                        return (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>
                              {item.product_name} × {item.quantity}
                            </span>

                            <span>
                              ${totalPrice.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t pt-2 mb-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>

                      <span>
                        ${Number(order.total).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {order.shipping_full_name && (
                    <div className="mb-4 text-sm text-gray-600">
                      <p><strong>Shipping to:</strong></p>

                      <p>{order.shipping_full_name}</p>

                      <p>{order.shipping_address}</p>

                      <p>
                        {order.shipping_city}, {order.shipping_postal_code}
                      </p>
                    </div>
                  )}

                  {order.shipment && (
                    <div className="mb-4 bg-blue-50 rounded p-4">
                      <h5 className="font-medium text-blue-800 mb-2">
                        Shipment Details:
                      </h5>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-blue-700">
                            <span className="font-medium">Status: </span>

                            <span className="capitalize">
                              {order.shipment.status}
                            </span>
                          </p>

                          <p className="text-blue-700">
                            <span className="font-medium">Carrier: </span>
                            
                            {order.shipment.carrier}
                          </p>

                          <p className="text-blue-700">
                            <span className="font-medium">Tracking #: </span>

                            <span className="font-mono">
                              {order.shipment.tracking_number}
                            </span>
                          </p>
                        </div>
                        
                        <div>
                          {order.shipment.estimated_delivery && (
                            <p className="text-blue-700">
                              <span className="font-medium">Est. Delivery: </span>

                              {new Date(order.shipment.estimated_delivery).toLocaleDateString()}
                            </p>
                          )}

                          {order.shipment.actual_delivery && (
                            <p className="text-blue-700">
                              <span className="font-medium">Delivered On: </span>

                              {new Date(order.shipment.actual_delivery).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {order.invoice && (
                    <div className="bg-gray-50 rounded p-4 mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">
                            Invoice: {order.invoice.invoice_number}
                          </h5>

                          <p className="text-sm text-gray-600">
                            Amount Due: <span className="font-semibold">${parseFloat(order.invoice.amount_due).toFixed(2)}</span>
                          </p>

                          <p className="text-sm text-gray-600">
                            Due Date: {new Date(order.invoice.due_date).toLocaleDateString()}

                            {isOverdue(order.invoice.due_date) && order.invoice.status === "pending" && (
                              <span className="text-red-600 font-medium ml-1">(Overdue)</span>
                            )}
                          </p>

                          {order.invoice.receipts && order.invoice.receipts.length > 0 && (
                            <div className="mt-3 border-t border-gray-200 pt-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Payment History:
                              </p>

                              {order.invoice.receipts.map((receipt) => (
                                <div key={receipt.id} className="text-sm text-gray-600">
                                  <p className="flex justify-between items-center">
                                    <span>
                                      <span className="font-mono text-xs">
                                        {receipt.receipt_number}
                                      </span>

                                      <span className="mx-2">•</span>

                                      <span>{new Date(receipt.created_at).toLocaleDateString()}</span>
                                    </span>

                                    <span className="font-medium text-green-600">
                                      ${parseFloat(receipt.amount_paid).toFixed(2)}
                                    </span>
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {order.invoice.status === "pending" && (
                          <div className="text-right">
                            {canPay ? (
                              <button
                                onClick={() => handlePayInvoice(order.invoice!.id, parseFloat(order.invoice!.amount_due))}
                                disabled={payingInvoice === order.invoice.id}
                                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition disabled:opacity-50"
                              >
                                {payingInvoice === order.invoice.id ? "Processing..." : "Pay Now"}
                              </button>
                            ) : (
                              <div className="text-xs text-red-600">
                                Insufficient wallet balance
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

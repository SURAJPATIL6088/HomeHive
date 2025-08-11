import React, { useState, useEffect } from 'react';
import PaymentService from '../Services/PaymentService';

const PaymentModal = ({ isOpen, onClose, bill, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (!bill) return;

    try {
      setIsProcessing(true);
      setError('');

      const scriptLoaded = await PaymentService.loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
      }

      const orderData = {
        billId: bill.id,
        amount: bill.totalAmount,
        currency: 'INR',
        description: `Payment for Bill #${bill.billNumber}`
      };

      const paymentOrder = await PaymentService.createPaymentOrder(orderData);

      const options = {
        key: paymentOrder.key,
        amount: paymentOrder.amount * 100,
        currency: paymentOrder.currency,
        name: paymentOrder.name,
        description: paymentOrder.description,
        order_id: paymentOrder.orderId,
        image: paymentOrder.image,  
        theme: {
          color: paymentOrder.theme
        },
        prefill: {
          name: paymentOrder.prefillName,
          email: paymentOrder.prefillEmail,
          contact: paymentOrder.prefillContact
        },
        handler: async (response) => {
          try {
            const verificationData = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              billId: bill.id
            };

            const verificationResult = await PaymentService.verifyPayment(verificationData);

            if (verificationResult.success) {
              if (onPaymentSuccess) {
                onPaymentSuccess(verificationResult.payment);
              }
              onClose();
            } else {
              setError(verificationResult.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError(error.message || 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setError('Payment was cancelled by user');
          }
        },
        notes: {
          bill_number: bill.billNumber,
          resident_id: bill.resident?.id
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-credit-card me-2"></i>
              Payment Details
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={isProcessing}
            ></button>
          </div>
          
          <div className="modal-body">
            {bill && (
              <div>
                <div className="card border-0 bg-light mb-3">
                  <div className="card-body">
                    <h6 className="card-title">Bill Information</h6>
                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted">Bill Number</small>
                        <div className="fw-bold">{bill.billNumber}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Due Date</small>
                        <div className="fw-bold">{new Date(bill.dueDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>Maintenance Amount:</span>
                  <span>₹{bill.maintenanceAmount?.toLocaleString() || '0'}</span>
                </div>

                {bill.penaltyAmount > 0 && (
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-warning">Penalty Amount:</span>
                    <span className="text-warning">₹{bill.penaltyAmount?.toLocaleString() || '0'}</span>
                  </div>
                )}

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <strong>Total Amount:</strong>
                  <strong className="text-primary fs-5">₹{bill.totalAmount?.toLocaleString() || '0'}</strong>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <div className="text-center">
                  <div className="mb-3">
                    <i className="fab fa-cc-visa fa-2x me-2 text-primary"></i>
                    <i className="fab fa-cc-mastercard fa-2x me-2 text-warning"></i>
                    <i className="fas fa-university fa-2x me-2 text-success"></i>
                    <i className="fab fa-google-pay fa-2x me-2 text-info"></i>
                    <i className="fas fa-mobile-alt fa-2x text-secondary"></i>
                  </div>
                  <small className="text-muted">
                    Secure payment powered by Razorpay
                  </small>
                </div>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handlePayment}
              disabled={isProcessing || !bill}
            >
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-lock me-2"></i>
                  Pay ₹{bill?.totalAmount?.toLocaleString() || '0'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

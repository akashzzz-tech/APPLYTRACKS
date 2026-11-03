'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { CheckCircle2, Copy, X, Smartphone, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { DataService } from '@/lib/data-service';

interface YoupiCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planTier: 'pro' | 'plus';
  planName: string;
  amount: number;
  userId?: string;
  userEmail?: string;
  onSuccess: (tier: 'pro' | 'plus') => void;
}

export const UPI_CONFIG = {
  vpa: '81793377025@axl',
  payeeName: 'APPLYTRACK',
  merchantCode: '0000',
};

export default function YoupiCheckoutModal({
  isOpen,
  onClose,
  planTier,
  planName,
  amount,
  userId,
  userEmail,
  onSuccess,
}: YoupiCheckoutModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [optionalUtr, setOptionalUtr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate standard NPCI UPI Intent URI
  const transactionNote = `ApplyTrack_${planName.replace(/\s+/g, '_')}`;
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(UPI_CONFIG.vpa)}&pn=${encodeURIComponent(
    UPI_CONFIG.payeeName
  )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setPaymentSuccess(false);
      setOptionalUtr('');
      QRCode.toDataURL(upiIntentUri, {
        width: 260,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('Failed to generate QR:', err));
    }
  }, [isOpen, upiIntentUri]);

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_CONFIG.vpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleInstantConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (userId) {
        // Upgrade profile subscription tier in database / local storage
        await DataService.updateProfile(userId, {
          subscription_tier: planTier,
        });

        // Record activity log with optional UTR if provided
        await DataService.createActivityLog(
          userId,
          'UPGRADE_SUBSCRIPTION',
          'subscription',
          undefined,
          {
            tier: planTier,
            amount,
            utr_ref: optionalUtr.trim() || 'SELF_CONFIRMED',
            vpa: UPI_CONFIG.vpa,
            payee: UPI_CONFIG.payeeName,
            status: 'verified',
            user_email: userEmail,
          }
        );
      }

      setPaymentSuccess(true);
      setTimeout(() => {
        onSuccess(planTier);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Subscription activation encountered an issue. Please contact support.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 uppercase tracking-wider border border-blue-400/30">
              Instant UPI Checkout
            </span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 0% Fee Direct Bank Transfer
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Upgrade to {planName}</h2>
          <p className="text-xs text-slate-300 mt-1">
            Pay <span className="font-extrabold text-white text-base">₹{amount}</span> to{' '}
            <span className="font-medium text-blue-200">{UPI_CONFIG.payeeName}</span>
          </p>
        </div>

        {paymentSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Subscription Activated!</h3>
            <p className="text-sm text-slate-600">
              Welcome to <strong className="text-blue-600 uppercase">{planTier}</strong>! Your account is upgraded and all features are now unlocked.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Scan & Pay */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-xs font-semibold text-slate-700 mb-3">
                Step 1: Scan & Pay ₹{amount} using any UPI App
              </p>
              <div className="inline-block p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="UPI Payment QR Code" className="w-44 h-44 mx-auto" />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                )}
              </div>

              {/* UPI ID Copy Box */}
              <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                <span className="text-slate-500">Pay to UPI:</span>
                <code className="font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-900 font-bold">
                  {UPI_CONFIG.vpa}
                </code>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? (
                    <span className="text-[11px] text-emerald-600 font-semibold">Copied!</span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Mobile Direct Intent Link */}
              <div className="mt-3 block sm:hidden">
                <a
                  href={upiIntentUri}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                >
                  <Smartphone className="w-4 h-4" /> Tap to Pay ₹{amount} via UPI App
                </a>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {error}
              </div>
            )}

            {/* Step 2: Confirmation */}
            <form onSubmit={handleInstantConfirmation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  UPI Ref / UTR No. <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={optionalUtr}
                  onChange={(e) => setOptionalUtr(e.target.value)}
                  placeholder="Optional 12-digit Ref No. if available"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Activating Plan...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> I&apos;ve Completed Payment — Activate {planName}
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Direct Bank Settlement</span>
              <span className="font-semibold text-emerald-600">Instant Access Unlocked</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

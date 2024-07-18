import React, { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import {
  PaymentElement,
  LinkAuthenticationElement,
} from '@stripe/react-stripe-js';
import useAuthToken from '../hooks/useAuthToken';
import axios from 'axios';
import SimpleButton from './SimpleButton';
import styles from '../styles/CheckoutForm.module.scss';
import ErrorModal from './ErrorModal';
import ProcessingModal from './ProcessingModal';
import toast, { Toaster } from 'react-hot-toast';

const CheckoutForm = ({ selectedPackage, stripeTransactionId }) => {
  //hooks
  const stripe = useStripe();
  const elements = useElements();
  const { token, isTokenValid } = useAuthToken('api-goodtobenaked');

  //localstate
  const [isProcessing, setIsProcessing] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!isTokenValid || !selectedPackage || !stripeTransactionId) {
      setIsErrorModalOpen(true);
      return;
    }

    try {
      setIsProcessing(true);

      const response = await axios.post(
        '/api/payments/checkout',
        {
          creditAmount: selectedPackage.coinsAmount,
          stripeTransactionId: stripeTransactionId,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );

      if (response) {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment/checkout/succeed`,
          },
        });

        setIsProcessing(false);
        toast.error(error.message, {
          duration: 8000,
          position: 'bottom-center',
        });
      }
    } catch (error) {
      setIsProcessing(false);
      setIsErrorModalOpen(true);
      toast.error('An error occurred', {
        duration: 8000,
        position: 'bottom-center',
      });
    }
  };

  return (
    <>
      <form
        id="payment-form"
        onSubmit={handleSubmit}
        className={styles.container}
      >
        <LinkAuthenticationElement />
        <PaymentElement />

        <SimpleButton
          type="submit"
          customStyles={{ marginTop: '2rem', width: '100%' }}
          disabled={isProcessing}
        >
          Pay
        </SimpleButton>
      </form>
      <ErrorModal open={isErrorModalOpen} onClose={setIsErrorModalOpen} />
      <ProcessingModal open={isProcessing} onClose={setIsProcessing} />
      <Toaster />
    </>
  );
};

export default CheckoutForm;

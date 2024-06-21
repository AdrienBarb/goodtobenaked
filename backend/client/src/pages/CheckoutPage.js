import React, { useEffect, useState } from 'react';
import { packages } from '../constants/packages';
import styles from '../styles/checkoutPage.module.scss';
import PageContainer from '../components/PageContainer';
import 'swiper/css';
import 'swiper/css/pagination';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import useAuthToken from '../hooks/useAuthToken';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopHeader from '../components/TopHeader';
import ErrorModal from '../components/ErrorModal';

const CheckoutPage = () => {
  //hooks
  const { isTokenValid } = useAuthToken('api-goodtobenaked');
  const navigate = useNavigate();

  //localstate
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [stripePromise, setStripePromise] = useState(null);
  const clientSecret = searchParams.get('clientSecret');
  const stripeTransactionId = searchParams.get('stripeTransactionId');
  const selectedPackageId = searchParams.get('selectedPackageId');
  const selectedPackage = packages.find(
    (el) => el.id === parseInt(selectedPackageId),
  );

  useEffect(() => {
    fetch('/stripe-key').then(async (r) => {
      const { stripeKey } = await r.json();

      setStripePromise(loadStripe(stripeKey));
    });
  }, []);

  useEffect(() => {
    if (!isTokenValid) {
      setIsErrorModalOpen(true);
    }
  }, [isTokenValid]);

  useEffect(() => {
    if (
      !clientSecret ||
      !stripeTransactionId ||
      !selectedPackageId ||
      !selectedPackage
    ) {
      setIsErrorModalOpen(true);
    }
  }, [clientSecret, stripeTransactionId, selectedPackageId, selectedPackage]);

  const navigateToPackages = () => {
    navigate('/payment/packages');
  };

  return (
    <PageContainer>
      <div className={styles.container}>
        <TopHeader goBack={navigateToPackages} />

        <span className={styles.divider}></span>
        <div className={styles.middleText}>
          <div className={styles.label}>{`Achetez ${
            selectedPackage.coinsAmount
          } crédits pour ${selectedPackage.price / 100}€`}</div>
        </div>

        {clientSecret &&
          stripePromise &&
          stripeTransactionId &&
          selectedPackage && (
            <>
              <div className={styles.selectedCardWrapper}></div>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  selectedPackage={selectedPackage}
                  stripeTransactionId={stripeTransactionId}
                />
              </Elements>
            </>
          )}
      </div>
      <ErrorModal open={isErrorModalOpen} onClose={setIsErrorModalOpen} />
    </PageContainer>
  );
};

export default CheckoutPage;

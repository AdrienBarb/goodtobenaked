import React, { useEffect, useState } from 'react';
import { packages } from '../constants/packages';
import styles from '../styles/checkoutPage.module.scss';
import PageContainer from '../components/PageContainer';
import CreditCard from '../components/CreditCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import axios from 'axios';
import useAuthToken from '../hooks/useAuthToken';
import SimpleButton from '../components/SimpleButton';
import { createSearchParams, useNavigate } from 'react-router-dom';
import TopHeader from '../components/TopHeader';
import ErrorModal from '../components/ErrorModal';
import toast, { Toaster } from 'react-hot-toast';

const PackagesPage = () => {
  //hooks
  const { token, isTokenValid } = useAuthToken('api-kyynk');

  //localstate
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentSwipper, setCurrentSwipper] = useState(null);
  const navigate = useNavigate();
  const [clientUrl, setClientUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isTokenValid) {
      setIsErrorModalOpen(true);
    }
  }, [isTokenValid]);

  useEffect(() => {
    fetch('/config').then(async (r) => {
      const response = await r.json();

      setClientUrl(response.clientUrl);
    });
  }, []);

  const handleClickOnCard = (index) => {
    currentSwipper.slideTo(index);
  };

  const handleChoosePackage = async () => {
    setIsLoading(true);
    const localSelectedPackage = packages[activeIndex];

    if (!isTokenValid || !localSelectedPackage) {
      setIsErrorModalOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        '/api/payments/create-payment-intent',
        { price: localSelectedPackage.price },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );

      const { clientSecret, stripeTransactionId } = response.data;

      navigate({
        pathname: '/payment/checkout',
        search: `?${createSearchParams({
          clientSecret,
          stripeTransactionId,
          selectedPackageId: localSelectedPackage.id,
        })}`,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error('An error occurred', {
        duration: 8000,
        position: 'bottom-center',
      });
    }
  };

  const navigateToClient = () => {
    window.location.href = clientUrl;
  };

  return (
    <PageContainer>
      <div className={styles.container}>
        <TopHeader goBack={navigateToClient} />
        <span className={styles.divider}></span>
        <div className={styles.middleText}>
          <div className={styles.label}>Buy credits</div>
          <div className={styles.sublabel}>
            Buy as many nudes as you want with our credits.
          </div>
        </div>

        <Swiper
          slidesPerView={2}
          centeredSlides={true}
          spaceBetween={16}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
          onSlideChange={(e) => setActiveIndex(e.activeIndex)}
          onSwiper={setCurrentSwipper}
        >
          {packages.map((currentPackage, index) => {
            return (
              <SwiperSlide>
                <CreditCard
                  currentPackage={currentPackage}
                  key={index}
                  index={index}
                  isSelected={index === activeIndex}
                  onClick={handleClickOnCard}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>

        <SimpleButton
          onClick={handleChoosePackage}
          customStyles={{ marginTop: '2rem' }}
          disabled={isLoading}
        >
          Buy credits
        </SimpleButton>

        <div className={styles.notice}>
          *purchased credits are non-refundable.
        </div>
      </div>
      <ErrorModal open={isErrorModalOpen} onClose={setIsErrorModalOpen} />
      <Toaster />
    </PageContainer>
  );
};

export default PackagesPage;

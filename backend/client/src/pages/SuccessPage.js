import React, { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import styles from '../styles/SuccessPage.module.scss';
import SimpleButton from '../components/SimpleButton';

const SuccessPage = () => {
  const [clientUrl, setClientUrl] = useState('');

  useEffect(() => {
    fetch('/config').then(async (r) => {
      const response = await r.json();

      setClientUrl(response.clientUrl);
    });
  }, []);

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <span className={styles.label}>😄</span>
        <span className={styles.label}>Congratulations!</span>
        <div className={styles.text}>Your account has just been credited.</div>
        <SimpleButton
          onClick={() => {
            window.location.href = clientUrl;
          }}
        >
          Continue
        </SimpleButton>
      </div>
    </PageContainer>
  );
};

export default SuccessPage;

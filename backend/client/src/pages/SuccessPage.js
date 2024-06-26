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
        <span className={styles.label}>Félicitation !</span>
        <div className={styles.text}>Votre compte vient d'être crédité.</div>
        <SimpleButton
          onClick={() => {
            window.location.href = clientUrl;
          }}
        >
          Continuer
        </SimpleButton>
      </div>
    </PageContainer>
  );
};

export default SuccessPage;

import Modal from '@mui/material/Modal';
import styles from '../styles/Modal.module.scss';
import { useEffect, useState } from 'react';
import SimpleButton from './SimpleButton';

const ErrorModal = ({ open, onClose }) => {
  const [clientUrl, setClientUrl] = useState('');

  useEffect(() => {
    fetch('/config').then(async (r) => {
      const response = await r.json();

      setClientUrl(response.clientUrl);
    });
  }, []);

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <span className={styles.label}>😞</span>
          <span className={styles.label}>Oups !</span>
          <div className={styles.text}>
            Une erreur est survenue. Vous pouvez réessayer, et si le problème
            persiste, vous pouvez nous contacter{' '}
            <a href={`mailto:help@goodtobenaked.com`}>ici</a>.
          </div>
          <SimpleButton
            onClick={() => {
              window.location.href = clientUrl;
            }}
            customStyles={{
              backgroundColor: '#780000',
            }}
          >
            Réessayer
          </SimpleButton>
        </div>
      </div>
    </Modal>
  );
};

export default ErrorModal;

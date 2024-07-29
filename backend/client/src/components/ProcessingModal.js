import Modal from '@mui/material/Modal';
import styles from '../styles/Modal.module.scss';
import { Oval } from 'react-loader-spinner';

const ProcessingModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <span className={styles.successLabel}>
            Please do not close this window
          </span>
          <div className={styles.text}>
            <Oval
              visible={true}
              height="60"
              width="60"
              color="#cecaff"
              secondaryColor="#d9d7f6"
              ariaLabel="oval-loading"
              wrapperStyle={{ marginTop: '2rem' }}
              strokeWidth={4}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProcessingModal;

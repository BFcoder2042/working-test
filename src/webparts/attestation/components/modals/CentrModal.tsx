import React from 'react';
import styles from '../styles/centrModal.module.scss';
import EditSection from '../EditSection';
import CreateSubSection from '../CreateSubSection';
import CreateSection from '../CreateSection';
import Alert from '../Alert';

const CentrModal = (props) => {
    const modalHandler = (event) => {
      const classes = [...event.target.classList].map(item => item.split('_')[0]);
        if(classes.includes('modal')) {
          props.centrModalHandler(false);
        }
    }

    const components = {
      editSection: EditSection,
      createSubSection: CreateSubSection,
      createSection: CreateSection,
      alert: Alert
    }

    const Component = components[props.component];

    return (
      <div className={`${styles.modal} ${props.status ? styles.modalActive : styles.modalHide}`} onClick={(event) => modalHandler(event)}>
        <div className={`${styles.modalContentCentrModal} ${props.status ? styles.activeCentrModalContent : ''}`} style={{width: props.width, height: props.height}}>
          {props.title && <div className={styles.modalContentCentrModalTitle}>{props.title}</div>}
          <div className={styles.modalContentCentrModalContainer}>
            {props.status &&
              <Component centrModalHandler={props.centrModalHandler} data={props.data} alertText={props.alertText}>
                {props.children &&
                  props.children.map(child => {
                    return child;
                  })
                }
              </Component>
            }
          </div>
        </div>
      </div>
    );
};

export default CentrModal;

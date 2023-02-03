import * as React from 'react';
import { useRef, useEffect } from 'react';
import popupState from '../../../state/popupState';
import styles from './styles/popup.module.scss';
import { FiAlertCircle, FiBell } from 'react-icons/fi';
import { TiWarningOutline } from 'react-icons/ti';
import { BiCheckCircle } from 'react-icons/bi';



const Popup = (props) => {

  const popElement = useRef<Array<any>>([]);

  return(
    <div className={styles.popupContainer}>
      <div className={styles.popupContainerItems}>
        {props.popups.map((pop, index) => {
          return (
            <React.Fragment>
              {Object.values(popupState).some(item => item == pop.type ) &&
                <div ref={popElement[index] = pop} className={`${styles.popupContainerItem} ${styles[pop.type]} ${styles.showPopup}`} onClick={(event) => props.hidePopup(popElement[index])}>
                  {pop.type === popupState.warning && <TiWarningOutline />}
                  {pop.type === popupState.error && <FiAlertCircle />}
                  {pop.type === popupState.notification && <FiBell />}
                  {pop.type === popupState.success && <BiCheckCircle />}
                  {pop.value}
                </div>
              }
            </React.Fragment>
          )
          })}
        </div>
      </div>
    )
}

export default Popup;


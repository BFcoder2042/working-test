import * as React from 'react';
import { Timeout } from 'react-on-time';
import MyGoalsCardContent from './MyGoalsCardContent';
import styles from './styles/myGoals.module.scss';
import ProgressBar from './ProgressBar';
import { useState } from 'react';
import SideModal from './modals/SideModal';

const MyGoalsCard = ({data, index}) => {

  const [modal, setModal] = useState(false);

  const modalHandler = (status) => {
    setModal(status);
  }

  return(
    <React.Fragment>
    <Timeout timeout={50 * index + 1}>
      {(timedout) => (
        <div className={`${styles.myGoalsCard} ${timedout ? styles.animateMyGoals : ''}`} onClick={() => modalHandler(true)}>
          <MyGoalsCardContent data={data}/>
          <ProgressBar data={data} />
        </div>
      )}
    </Timeout>
      <SideModal title="Информация о цели" status={modal} data={data} sideModalHandler={modalHandler} width="50%" component='viewMyGoal'/>
    </React.Fragment>
  )
}
  
export default MyGoalsCard;
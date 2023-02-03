import * as React from 'react';
import './styles/usersGoals.scss';
import { Timeout } from 'react-on-time';
import SideModal from './modals/SideModal';
import { useState } from 'react';
import { goalState, goalDefaultState } from '../../../state/goalState';

const UsersGoalsRows = (props) => {

  const [sideModal, setSideModal] = useState(false);

  const goalColors = goalState.filter(el => el.text === props.data.Status)[0] || goalDefaultState;

  const sideModalHandler = (status) => {
    setSideModal(status);
  };

  return(
    <React.Fragment>
    <Timeout timeout={50 * props.index + 1}>
      {(timedout) => (
        <div className={`users-goals_rows_item ${timedout ? 'animateMyGoals' : ''}`} onClick={() => sideModalHandler(true)}>
          <div className='users-goals_rows_item_title'>{props.data.NameGoal.Title}</div>
          <div className='users-goals_rows_item_criterion'>{props.data.AchievementCriteria}</div>
          <div className='users-goals_rows_item_user'>{props.data.Assigned.Title}</div>
          <div className='users-goals_rows_item_status'>
            <div className='users-goals_rows_item_status_container' style={{background: goalColors.background, color: goalColors.color}}>
              {props.data.Status}
            </div>
          </div>
        </div>
      )}
    </Timeout>
      <SideModal title="Информация о цели" data={{...props.data}} selectedPeriod={props.selectedPeriod} status={sideModal} sideModalHandler={sideModalHandler} width="50%" component="editUserGoal"/>
    </React.Fragment>
  )
}

export default UsersGoalsRows;
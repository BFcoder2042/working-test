import * as React from 'react';
import styles from './styles/directoryGoals.module.scss';
import { Timeout } from 'react-on-time';
import SideModal from './modals/SideModal';
import CentrModal from './modals/CentrModal';
import { useState, useContext } from 'react';
import { CgAssign } from 'react-icons/cg';
import { MdModeEdit } from 'react-icons/md';
import { MdOutlineArchive } from 'react-icons/md';
import { arhiveGoal } from '../../../api/goals';
import Button from './Button';
import popupState from '../../../state/popupState';
import { fetchFilteringDirectoryGoals } from '../../../store/actions/goalsActions';
import { Context } from '../../../context';
import { connect } from 'react-redux';


const DirectoryGoalRows = (props) => {

  const context = useContext(Context);

  const [sideModal, setSideModal] = useState(false);
  const [arhiveCentrModal, setArchiveCentrModal] = useState(false);
  const [editGoalSideModal, setEditGoalSideModal] = useState(false);
  const [appointGoalSideModal, setAppointGoalSideModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { dispatch } = props;

  const sideModalHandler = (status) => {
    setSideModal(status);
  };

  const archiveGoal = (event, status) => {
    event.stopPropagation();
    setArchiveCentrModal(status);
  }

  const editGoal = (event, status) => {
    event.stopPropagation();
    setEditGoalSideModal(status)
  }

  const appointGoal = (event, status) => {
    event.stopPropagation();
    if (props.currentPeriod.Status === 'Закрыт') {
      context.addPopup(popupState.warning, 'Период закрыт', 5000);
      return;
    }
    setAppointGoalSideModal(status)
  }

  const sendArhiveGoal = async () => {
    setLoading(true)
    arhiveGoal(context.spContext, 'Архивная', props.data.Id).then((res) => {
      setArchiveCentrModal(false);
      context.addPopup(popupState.success, 'Цель перенесена в архив');
      dispatch(fetchFilteringDirectoryGoals(context.spContext));
    }).catch(() => {
      context.addPopup(popupState.error, 'Произошла ошибка');
    }).finally(() => {
      setLoading(false)
    })
  }

  return(
    <React.Fragment>
      <Timeout timeout={50 * props.index + 1}>
      {(timedout) => (
        <div>
          <div className={`${styles.directoryGoalsRowsItem} ${timedout ? styles.animateMyGoals : ''}`} onClick={() => sideModalHandler(true)}>
            <div className={styles.directoryGoalsRowsItemName}>{props.data.Title}</div>
            <div className={styles.directoryGoalsRowsItemCriterion}>{props.data.AchievementCriteria}</div>
            <div className={styles.directoryGoalsRowsItemIcons}>
              <CgAssign className={styles.directoryGoalsRowsItemIcon} onClick={(event) => appointGoal(event, true)}/>
              {props.currentUserIsAdmin && <MdModeEdit className={styles.directoryGoalsRowsItemIcon} onClick={(event) => editGoal(event, true)}/>}
              {props.currentUserIsAdmin && <MdOutlineArchive className={styles.directoryGoalsRowsItemIcon} onClick={(event) => archiveGoal(event, true)}/>}
            </div>
          </div>
          <SideModal title="Информация о цели" data={props.data} status={sideModal} sideModalHandler={sideModalHandler} width="50%" component="viewDirectoryGoal"/>
          <SideModal title="Редактирование цели" data={props.data} status={editGoalSideModal} sideModalHandler={setEditGoalSideModal} width="50%" component="editGoal"/>
          {props.currentUserIsAdmin && <SideModal title="Назначение цели" data={props.data} status={appointGoalSideModal} sideModalHandler={setAppointGoalSideModal} width="50%" component="appointGoal"/>}
          {!props.currentUserIsAdmin && <SideModal title="Предложение цели" data={props.data} status={appointGoalSideModal} sideModalHandler={setAppointGoalSideModal} width="50%" component="offerDirectoryGoal"/>}
          <CentrModal title="Отправить в архив ?" status={arhiveCentrModal} centrModalHandler={setArchiveCentrModal} alertText="Цель будет отправлена в архив" component="alert">
          <Button
            title='Отмена'
            border={true}
            fill={false}
            color="#888888"
            margin='0 15px 0 0'
            handler={() => setArchiveCentrModal(false)}
            key="btn"
            />
            <Button
            title={`Продолжить`}
            border={false}
            fill={true}
            color="#fff"
            handler={() => sendArhiveGoal()}
            loading={loading}
            key="btn"
            />
          </CentrModal>
        </div>
      )}
    </Timeout>

    </React.Fragment>
  )
}
const mapStateToProps = (state) => ({
  currentUserIsAdmin: state.users.currentUserIsAdmin,
  currentPeriod: state.goals.currentPeriod
});  

export default connect(mapStateToProps)(DirectoryGoalRows);
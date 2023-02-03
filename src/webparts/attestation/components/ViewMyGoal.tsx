import * as React from 'react';
import { useContext, useState } from 'react';
import Button from './Button';
import Input from './inputs/Input';
import moment from 'moment';
import { Context } from '../../../context';
import { changeMyGoalStatus } from '../../../api/goals';
import popupState from '../../../state/popupState';
import { connect } from 'react-redux';
import { fetchMyGoals } from '../../../store/actions/goalsActions';


const ViewMyGoal = (props) => {

  const context = useContext(Context);

  const [loading, setLoading] = useState(false);

  const { dispatch } = props;

  const getCountDays = () => {
    const endDate = moment(props.data.DateEnd);
    const today = moment(new Date);
    return endDate.diff(today, 'days') + 1;
  }

  const changeStatus = () => {
    setLoading(true);
    changeMyGoalStatus(context.spContext, 'На проверке', props.data.Id).then((res) => {
      context.addPopup(popupState.success, 'Цель отправлена на проверку');
      props.modalHandler(false);
      dispatch(fetchMyGoals(context.spContext, props.currentPeriod.Id, props.currentUser.Id));
    }).catch((err) => {
      context.addPopup(popupState.error, 'Произошла ошибка')
    }).finally(() => {
      setLoading(false);
    })
  }

  return(
    <div>
      <Input
      placeholder=""
      type="text"
      label="Название цели"
      class={'modalInput'}
      readOnly={true}
      value={props.data.NameGoal.Title}
      />
      <Input
      placeholder=""
      type="text"
      label="Критерий достижения"
      class={'modalInput'}
      readOnly={true}
      value={props.data.AchievementCriteria}
      />
      <Input
      placeholder=""
      type="textarea"
      label="Описание"
      class={'modalTextArea'}
      readOnly={true}
      value={props.data.Description}
      />
      <Input
      placeholder=""
      type="text"
      label="Период Аттестации"
      class={'modalInput'}
      readOnly={true}
      value={props.data.CertificationPeriod.Title}
      />
      <Input
      placeholder=""
      type="text"
      label="Дата с"
      class={'modalInput'}
      readOnly={true}
      value={moment(props.data.DateStart).format('DD.MM.YYYY')}
      />
      <Input
      placeholder=""
      type="text"
      label="Дата по"
      class={'modalInput'}
      readOnly={true}
      value={moment(props.data.DateEnd).format('DD.MM.YYYY')}
      />
      <Input
      placeholder=""
      type="text"
      label="Срок выполнения"
      class={'modalInput'}
      readOnly={true}
      value={context.getCountDays(props.data.DateEnd)}
      />
      <Input
      placeholder=""
      type="text"
      label="Назначено"
      class={'modalInput'}
      readOnly={true}
      value={props.data.Assigned.Title}
      />
      <Input
      placeholder=""
      type="text"
      label="Куратор"
      class={'modalInput'}
      readOnly={true}
      value={props.data.Tutor.Title}
      />
      <Input
      placeholder=""
      type="text"
      label="Статус"
      class={'modalInput'}
      readOnly={true}
      value={props.data.Status}
      />
      <div style={{margin: '30px 0', display: 'flex'}}>
      {props.data.Status === 'В работе' && 
        <Button
        title='Выполнено'
        border={false}
        fill={true}
        color="#fff"
        margin='0px 15px 0px 0px'
        handler={() => changeStatus()}
        loading={loading}
        />
      }
      <Button
      title='Назад'
      border={false}
      handler={() => props.modalHandler(false)}
      fill={false}
      color="#888888"
      />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  currentUser: state.users.currentUser,
  currentPeriod: state.goals.currentPeriod,
});

export default connect(mapStateToProps)(ViewMyGoal);

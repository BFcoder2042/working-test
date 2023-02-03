import * as React from 'react';
import Input from './inputs/Input';
import Button from './Button';
import popupState from '../../../state/popupState';
import { Context } from '../../../context';
import { createUserGoal, checkUserGoal } from '../../../api/goals';
import { IAppointGoal } from '../../../interfaces/IAppointGoal'; 
import moment from 'moment';
import { connect } from 'react-redux';
import * as goalsActions from '../../../store/actions/goalsActions';
import { Formik } from "formik";
import * as yup from "yup";
import styles from './styles/sendGoals.module.scss';
import { incline, inclineFirstname, inclineLastname, inclineMiddlename } from 'lvovich';

interface IState {
  goalSelect: any;
  periodSelect: any;
  curatorSelect: any;
  context: any;
  loading: boolean;
  appointedSelect: any;
}

class AppointGoal extends React.Component<IAppointGoal, IState, {}> {

  context!: React.ContextType<typeof Context>

  constructor(props) {
    super(props);
    this.state = {
      goalSelect: null,
      periodSelect: this.props.periods.filter(period => period.Status === 'В работе')[0],
      curatorSelect: null,
      context: this.context,
      loading: false,
      appointedSelect: null
    }
  }

  public render(): React.ReactElement<IAppointGoal> {

    const getCountDays = () => {
      const endDate = moment(this.state.periodSelect.DateEnd);
      const today = moment(new Date);
      return endDate.diff(today, 'days') + 1;
    }


    const closeModal = () => {
      this.props.modalHandler(false);
    }

    const getSelectedItemGoalName = async (item) => {
      await this.setState({goalSelect: item});
    }

    const getSelectedItemPeriodName = async (item) => {
      await this.setState( {periodSelect: item} );
    }

    const getSelectedItemCuratorName = async (item) => {
      await this.setState( {curatorSelect: item} );
    }

    const getSelectedItemAppointedName = async (item) => {
      await this.setState( {appointedSelect: item} );
    }

    const validationSchema = yup.object().shape({
      appointedField: yup.string().required('Это поле обязательно!'),
      curatorField: yup.string().required('Это поле обязательно!')
    });

    const createGoal = () => {
      const inclineUserString = incline({ first: this.state.appointedSelect.Title.split(" ")[0], last: this.state.appointedSelect.Title.split(" ")[1] }, 'dative');
      this.setState( {loading: true} );
      const data = {
        nameGoalId: this.state.goalSelect.Id,
        achievementCriteria: this.state.goalSelect.AchievementCriteria,
        description: this.state.goalSelect.Description,
        certificationPeriodId: this.state.periodSelect.Id,
        dateEnd: this.state.periodSelect.DateEnd,
        dateStart: this.state.periodSelect.DateStart,
        dateDeadline: getCountDays,
        assignedId: this.state.appointedSelect.Id,
        tutorId: this.state.curatorSelect.Id,
        role: 'Tutor',
      }
      checkUserGoal(this.context.spContext, this.state.goalSelect.Id, this.state.appointedSelect.Id).then((goals: any)=>{
        if (!goals.value.length){
          createUserGoal(this.context.spContext, data).then(() => {
            this.context.addPopup(popupState.success, `Цель назначена ${inclineUserString.first} ${inclineUserString.last}`, 5000);
            this.props.modalHandler(false);
          }).catch(err => {
            this.context.addPopup(popupState.error, 'Произошла ошибка');
          }).finally(() => {
            this.setState( {loading: false} );
          })
        }
        else{
          try {
            this.context.addPopup(popupState.warning,'Цель уже назначена в текущем периоде');
            this.props.modalHandler(false);
          }
          catch(err) {
            this.context.addPopup(popupState.error, 'Произошла ошибка');
          }
          finally {
            this.setState( {loading: false} );
          }
        }
      })
    }

    return (
      <Formik
        initialValues={{
          goalsField: "",
          periodField: "",
          appointedField: "",
          curatorField: ""
        }}
        validateOnBlur
        onSubmit={() => {
          createGoal()
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isValid,
          handleSubmit,
          dirty,
          setFieldValue,
        }) => (
        <div className={styles.sendGoals}>
          <Input
          placeholder="Выберите значение"
          type="select"
          label="Цель"
          class={'modalInput'}
          child={this.props.directoryGoals}
          readOnly={true}
          styleInput={ {cursor: 'pointer'} }
          name="goalsField"
          selected={getSelectedItemGoalName}
          value={this.props.data}
          disabledSelect={true}
          />
          <Input
          placeholder=""
          type="text"
          label="Критерий достижения"
          class={'modalInput'}
          readOnly={true}
          value={this.state.goalSelect ? this.state.goalSelect.AchievementCriteria : ''}
          />
          <Input
          placeholder=""
          type="textarea"
          label="Описание"
          class={'modalTextArea'}
          readOnly={true}
          value={this.state.goalSelect ? this.state.goalSelect.Description : ''}
          />
          <Input
          placeholder="Выберите значение"
          type="select"
          label="Период аттестации"
          class={'modalInput'}
          child={this.props.periods}
          selected={getSelectedItemPeriodName}
          readOnly={true}
          styleInput={ {cursor: 'pointer'} }
          name={'periodField'}
          value={this.state.periodSelect}
          disabledSelect={true}
          />
          <Input
          placeholder="Дата начала"
          type="text"
          label="Дата с"
          class={'modalInput'}
          readOnly={true}
          value={this.state.periodSelect ? moment(this.state.periodSelect.DateStart).format('DD.MM.YYYY') : ''}
          />
          <Input
          placeholder="Дата окончания"
          type="text"
          label="Дата по"
          class={'modalInput'}
          readOnly={true}
          value={this.state.periodSelect ? moment(this.state.periodSelect.DateEnd).format('DD.MM.YYYY') : ''}
          />
          <Input
          placeholder="Кол-во дней"
          type="text"
          label="Срок выполнения"
          class={'modalInput'}
          readOnly={true}
          value={this.state.periodSelect ? getCountDays() : ''}
          />
          <Input
          placeholder="Выберите значение"
          type="search"
          label="Назначено"
          class={'modalInput'}
          child={this.props.partisipiant}
          selected={getSelectedItemAppointedName} 
          styleInput={ {cursor: 'pointer'} }
          name={'appointedField'}
          setFieldValue={setFieldValue}
          error={errors.appointedField ? true : false}
          />
          <Input
          placeholder="Выберите значение"
          type="search"
          label="Куратор"
          class={'modalInput'}
          child={this.props.curators}
          selected={getSelectedItemCuratorName}
          styleInput={ {cursor: 'pointer'} }
          name="curatorField"
          setFieldValue={setFieldValue}
          error={errors.curatorField ? true : false}
          />
          <div className={styles.sendGoalsButtons}>
            <Button
            title='Назначить'
            handler={() => handleSubmit()}
            border={false}
            fill={true}
            color="#fff"
            margin='0 15px 0 0'
            loading={this.state.loading}
            />
            <Button
            handler={() => closeModal()}
            title='Отмена'
            border={false}
            fill={false}
            color="#888888"
            />
          </div>
        </div>
        )}
      </Formik>
    );
  };
};

const mapStateToProps = (state) => ({
  directoryGoals: state.goals.directoryGoals,
  periods: state.goals.periods,
  curators: state.users.curators,
  partisipiant: state.users.partisipiant
});

export default connect(mapStateToProps)(AppointGoal);

AppointGoal.contextType = Context;
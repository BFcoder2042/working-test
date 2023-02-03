import * as React from 'react';
import Input from './inputs/Input';
import Button from './Button';
import styles from './styles/sendGoals.module.scss';
import popupState from '../../../state/popupState';
import { Context } from '../../../context';
import { createUserGoal } from '../../../api/goals';
import { IOfferGoal } from '../../../interfaces/IOfferGoal';
import moment from 'moment';
import { connect } from 'react-redux';
import * as goalsActions from '../../../store/actions/goalsActions';
import { Formik } from "formik";
import * as yup from "yup";

interface IState {
  inputLoading: Boolean;
  goalSelect: any;
  periodSelect: any;
  curatorSelect: any;
  context: any;
  loading: boolean
}

class OfferGoal extends React.Component<IOfferGoal, IState, {}> {

  context!: React.ContextType<typeof Context>

  constructor(props) {
    super(props);
    this.state = {
      inputLoading: false,
      goalSelect: this.props.data,
      periodSelect: this.props.periods.filter(period => period.Status === 'В работе')[0],
      curatorSelect: null,
      context: this.context,
      loading: false
    }
  }

  public render(): React.ReactElement<IOfferGoal> {

    const closeModal = () => {
      this.props.modalHandler(false);
    }

    const getSelectedItemPeriodName = async (item) => {
      await this.setState( {periodSelect: item} );
    }

    const getSelectedItemCuratorName = async (item) => {
      await this.setState( {curatorSelect: item} );
    }

    const getCountDays = () => {
        return this.context.getCountDays(this.state.periodSelect.DateEnd);
    }

    const createGoal = () => {
      this.setState( {loading: true} );
      const body = {
        nameGoalId: this.state.goalSelect.Id,
        achievementCriteria: this.state.goalSelect.AchievementCriteria,
        description: this.state.goalSelect.Description,
        certificationPeriodId: this.state.periodSelect.Id,
        dateEnd: this.state.periodSelect.DateEnd,
        dateStart: this.state.periodSelect.DateStart,
        dateDeadline: getCountDays,
        assignedId: this.props.currentUser.Id,
        tutorId: this.state.curatorSelect.Id,
        role: !this.props.curators.filter(curator => curator.Id === this.props.currentUser.Id).length ? 'Usual' : 'Tutor'
      }
      createUserGoal(this.context.spContext, body).then(() => {
        this.props.dispatch(goalsActions.fetchMyGoals(this.context.spContext, this.props.currentUser.Id));
        this.context.addPopup(popupState.success, 'Цель отправлена на согласование');
        this.props.modalHandler(false);
      }).catch(err => {
        this.context.addPopup(popupState.error, 'Произошла ошибка');
        console.log(err)
      }).finally(() => {
        this.setState( {loading: false} );
      })
    }

    const validationSchema = yup.object().shape({
      curatorField: yup.string().required('Это поле обязательно!')
    });

    return (
      <Formik
        initialValues={{
          goalsField: "",
          periodField: "",
          curatorField: ""
        }}
        validateOnBlur
        onSubmit={() => {
          createGoal();
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
            placeholder=""
            type="text"
            label="Название цели"
            class={'modalInput'}
            readOnly={true}
            value={this.props.data.Title}
            />
            <Input
            placeholder=""
            type="text"
            label="Критерий достижения"
            class={'modalInput'}
            readOnly={true}
            value={this.props.data.AchievementCriteria}
            />
            <Input
            placeholder=""
            type="textarea"
            label="Описание"
            class={'modalTextArea'}
            readOnly={true}
            value={this.props.data.Description}
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
            disabledSelect={true}
            value={this.state.periodSelect}
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
            placeholder=""
            type="text"
            label="Назначено"
            class={'modalInput'}
            readOnly={true}
            value={this.props.currentUser ? this.props.currentUser.Title : ''}
            />
            <Input
            placeholder="Выберите значение"
            type="select"
            label="Куратор"
            class={'modalInput'}
            child={this.props.curators}
            selected={getSelectedItemCuratorName}
            styleInput={ {cursor: 'pointer'} }
            readOnly={true}
            name="curatorField"
            setFieldValue={setFieldValue}
            error={errors.curatorField ? true : false}
            />
            <div className={styles.sendGoalsButtons}>
              <Button
              title='Отправить на согласование'
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
  currentUser: state.users.currentUser,
  curators: state.users.curators,
  currentPeriod: state.goals.currentPeriod,
});

export default connect(mapStateToProps)(OfferGoal);

OfferGoal.contextType = Context;
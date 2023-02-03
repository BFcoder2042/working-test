import * as React from 'react';
import { connect } from 'react-redux';
import { Context } from '../../../context';
import { IEditUserGoalProps } from '../../../interfaces/IEditUserGoalProps';
import Input from './inputs/Input';
import Button from './Button';
import moment from 'moment';
import { changeUserGoal } from '../../../api/goals';
import popupState from '../../../state/popupState';
import * as goalsActions from '../../../store/actions/goalsActions';

interface IState {
  periodSelect: any;
  statusSelect: any;
  loading: boolean;
}

class EditUserGoal extends React.Component<IEditUserGoalProps, IState, {}> {

  context!: React.ContextType<typeof Context>

  constructor(props) {
    super(props);
    this.state = {
      periodSelect: this.props.periods.filter(period => period.Id === this.props.data.CertificationPeriodId)[0],
      statusSelect: this.props.statuses.filter(status => status === this.props.data.Status)[0],
      loading: false
    }
  }

  componentDidMount(): void {
    this.context.getCountDays(this.state.periodSelect.DateEnd)
  }


  public render(): React.ReactElement<IEditUserGoalProps> {

    
    const getSelectedItemPeriodName = async (item) => {
      await this.setState( {periodSelect: item} );
    }

    const getSelectedItemStatus = async (item) => {
      await this.setState( {statusSelect: item} );
    }

    const changeUserGoalHandler = () => {
      this.setState({loading: true});
      const data = {
        id: this.props.data.Id,
        certificationPeriodId: this.state.periodSelect.Id,
        status: this.state.statusSelect
      }
      changeUserGoal(this.context.spContext, data).then(() => {
        this.props.dispatch(goalsActions.fetchUsersGoals(this.context.spContext, this.props.selectedPeriod.Id));
        this.context.addPopup(popupState.success, 'Цель успешно изменена')
        this.props.modalHandler(false);
      }).catch(() => {
        this.context.addPopup(popupState.error, 'Произошла ошибка')
      }).finally(() => {
        this.setState({loading: false});
      })
    }

    return (
      <div className='users-goals'>
        <Input
        placeholder=""
        type="text"
        label="Название цели"
        class={'modalInput'}
        readOnly={true}
        value={this.props.data.NameGoal.Title}
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
        value={this.state.periodSelect ? this.context.getCountDays(this.state.periodSelect.DateEnd) : ''}
        />
        <Input
        placeholder=""
        type="text"
        label="Назначено"
        class={'modalInput'}
        readOnly={true}
        value={this.props.data.Assigned.Title}
        />
        <Input
        placeholder=""
        type="text"
        label="Куратор"
        class={'modalInput'}
        readOnly={true}
        value={this.props.data.Tutor.Title}
        />
        <Input
        placeholder=""
        type="select"
        label="Статус"
        class={'modalInput'}
        child={this.props.statuses}
        selected={getSelectedItemStatus}
        readOnly={true}
        styleInput={ {cursor: 'pointer'} }
        value={this.state.statusSelect}
        />
        <div className='edit-goal_btn'>
          <div style={{display: 'flex', margin: '30px 0'}}>
            <Button
            title='Изменить'
            border={false}
            fill={true}
            color="#fff"
            margin='0 15px 0 0'
            loading={this.state.loading}
            handler={() => changeUserGoalHandler()}
            />
            <Button
            title='Отмена'
            fill={false}
            color="#888888"
            handler={() => this.props.modalHandler(false)}
            />
          </div>
        </div>
    </div>
    );
  };
};

EditUserGoal.contextType = Context;

const mapStateToProps = (state) => ({
  periods: state.goals.periods,
  statuses: state.goals.statuses,
  currentPeriod: state.goals.currentPeriod
});

export default connect(mapStateToProps)(EditUserGoal);
import * as React from 'react';
import { connect } from 'react-redux';
import { Context } from '../../context';
import { IUsersGoalsProps } from '../../interfaces/IUsersGoalsProps';
import '../attestation/components/styles/usersGoals.scss';
import * as goalsActions from '../../store/actions/goalsActions';
import Input from '../attestation/components/inputs/Input';
import Periods from '../attestation/components/Periods';
import UsersGoalsRows from '../attestation/components/UsersGoalsRows';

interface IState {
  currentPeriod: any;
  selectedStatus: any;
  userName: any;
  goalName: any;
}

class UsersGoals extends React.Component<IUsersGoalsProps, IState, {}> {

  context!: React.ContextType<typeof Context>

  componentDidMount(): void {
    this.props.dispatch(goalsActions.fetchUsersGoals(this.context.spContext, this.props.currentPeriod.Id));
  }


  constructor(props) {
    super(props);
    this.state = {
      currentPeriod: this.props.currentPeriod,
      selectedStatus: null,
      userName: "",
      goalName: ""
    }
  }


  public render(): React.ReactElement<IUsersGoalsProps> {

    const getCurrentPeriod = async (period) => {
      await this.setState({currentPeriod: period});
      this.props.dispatch(goalsActions.fetchUsersGoals(this.context.spContext, this.state.currentPeriod.Id, null, this.state.goalName, this.state.userName, this.state.selectedStatus));
    }

    const getSelectedItemStatus = async (status) => {
      await this.setState( {selectedStatus: status} );
      this.props.dispatch(goalsActions.fetchUsersGoals(this.context.spContext, this.state.currentPeriod.Id, null, this.state.goalName, this.state.userName, this.state.selectedStatus));
    }

    const getUserName = async (event) => {
      await this.setState( {userName: event.target.value} );
      this.props.dispatch(goalsActions.fetchUsersGoals(this.context.spContext, this.state.currentPeriod.Id, null, this.state.goalName, this.state.userName, this.state.selectedStatus));
    }

    const getGoalName = async (event) => {
      await this.setState( {goalName: event.target.value} );
      this.props.dispatch(goalsActions.fetchUsersGoals(this.context.spContext, this.state.currentPeriod.Id, null, this.state.goalName, this.state.userName, this.state.selectedStatus));
    } 

    return (
      <div className='users-goals'>
        {this.props.periods && <Periods getCurrentPeriod={getCurrentPeriod}/>}
        <div className='users-goals_filters'>
          <div className='users-goals_filters_inputs'>
            <Input
            placeholder="Поиск по названию"
            type="text"
            class={'defaultInput'}
            styleContainer={ {margin: '0 15px 0 0', maxWidth: '400px'} }
            onInput={(event) => getGoalName(event)}
            />
            <Input
            placeholder="Поиск по ФИО пользователя"
            type="text"
            class={'defaultInput'}
            styleContainer={ {margin: '0 15px 0 0', maxWidth: '400px'} }
            onInput={(event) => getUserName(event)}
            />
            <Input
            placeholder="Статус"
            type="select"
            class={'defaultInput'}
            readOnly={true}
            styleInput={ {cursor: 'pointer'} }
            styleContainer={ {maxWidth: '200px'} }
            child={this.props.statuses}
            selected={getSelectedItemStatus}
            />
          </div>
          <div className='users-goals_exports'>
            <div>DOC</div>
            <div>PDF</div>
          </div>
        </div>
        <div className='users-goals_rows'>
          <div className='users-goals_rows-labels'>
            <span>Название</span>
            <span>Критерий достижения</span>
            <span>Пользователь</span>
            <span>Статус</span>
          </div>
          {this.props.usersGoals.length > 0 && 
            <div className='users-goals_rows_items'>
              {this.props.usersGoals.map((goal, index) => {
                return <UsersGoalsRows selectedPeriod={this.state.currentPeriod} data={goal} index={index} />
              })}
            </div>
          }
        </div>
    </div>
    );
  };
};

UsersGoals.contextType = Context;

const mapStateToProps = (state) => ({
  usersGoals: state.goals.usersGoals,
  statuses: state.goals.statuses,
  periods: state.goals.periods,
  currentPeriod: state.goals.currentPeriod,
});

export default connect(mapStateToProps)(UsersGoals);
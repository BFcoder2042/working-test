import * as React from 'react';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';
import styles from './styles/attestation.module.scss';
import NavBar from './NavBar';
import MyGoals from '../../pages/MyGoals';
import DirectoryGoals from '../../pages/DirectoryGoals';
import UsersGoals from '../../pages/UsersGoals';
import Stats from '../../pages/Stats';
import Popup from './Popup';
import { Context } from '../../../context';
import { IApp } from '../../../interfaces/IApp';
import * as userActions from '../../../store/actions/userActions';
import * as goalsActions from '../../../store/actions/goalsActions';
import { connect } from 'react-redux';
import moment from 'moment';
interface IState {
  popups: Array<any>;
}
class App extends React.Component< IApp, IState, {}> {
  constructor(props) {
    super(props);
    this.state = {
      popups: []
    }
  }
  
  componentDidMount(): void {
    this.props.dispatch(goalsActions.fetchPeriods(this.props.spContext));
    this.props.dispatch(userActions.fetchGroupsCurrentUser(this.props.spContext));
    this.props.dispatch(goalsActions.fetchDirectoryGoals(this.props.spContext));
    this.props.dispatch(userActions.fetchCurrentUser(this.props.spContext));
    this.props.dispatch(userActions.fetchCurators(this.props.spContext));
    this.props.dispatch(userActions.fetchPartisipiants(this.props.spContext));
    this.props.dispatch(goalsActions.fetchTags(this.props.spContext));
    this.props.dispatch(goalsActions.fetchUsersGoalsStatuses(this.props.spContext));
    this.props.dispatch(goalsActions.fetchSections(this.props.spContext));
  }

  public render(): React.ReactElement<{}> {

    const addPopup = (type, value, time = 2000) => {
      const id = this.state.popups.length + 1;
      const popups = [...this.state.popups, {type: type, value: value, id: id ,time: setTimeout(() => { deletePopups(id) }, time)}];
      this.setState({popups});
    };

    const hidePopup = (popElement) => {
      popElement.current.style.display = 'none';
    }

    const deletePopups = (id) => {
      const currentPop = this.state.popups.findIndex(item => item.id === id);
      let popups = this.state.popups.slice(currentPop, 0)
      this.setState({popups});
    }

    const getCountDays = (end) => {
      const endDate = moment(end);
      const today = moment(new Date);
      return endDate.diff(today, 'days') + 1;
    } 

    const contextValues = {
      spContext: this.props.spContext,
      addPopup,
      getCountDays
    }

    return (
      <Context.Provider value={contextValues}>
        <Router>
        <div className={styles.layoutContainer}>
          {this.props.currentUserIsAdmin != null && <NavBar/>}
          <Popup popups={this.state.popups} hidePopup={hidePopup}/>
          <div className={styles.layoutContent}>
            <Switch>
              <Route exact path={'/'}>
                {this.props.currentPeriod && this.props.currentUser && <MyGoals/>} 
              </Route>
              <Route exact path={'/directoryGoals'}>
                {this.props.sections && <DirectoryGoals/>}
              </Route>
              <Route exact path={'/usersGoals'}>
                {this.props.currentPeriod && <UsersGoals/>}
              </Route>
              <Route exact path={'/stats'}>
                {this.props.currentPeriod && <Stats/>}
              </Route>
            </Switch>
          </div> 
        </div>
        </Router>
      </Context.Provider>
    );
  }
}

const mapStateToProps = (state) => ({
  sections: state.goals.sections,
  currentPeriod: state.goals.currentPeriod,
  currentUser: state.users.currentUser,
  currentUserIsAdmin: state.users.currentUserIsAdmin
});

export default connect(mapStateToProps)(App);

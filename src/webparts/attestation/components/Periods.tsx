import * as React from 'react';
import { connect } from 'react-redux';
import { IPeriodsProps } from '../../../interfaces/IPeriodsProps';
import { Context } from '../../../context';
import './styles/periods.scss';
import moment from 'moment';
import { IoListSharp } from 'react-icons/io5';
import SideModal from './modals/SideModal';
interface IState {
  sideModal: boolean,
  currentPeriod: any;
}

class Periods extends React.Component<IPeriodsProps, IState, {}> {

  context!: React.ContextType<typeof Context>

  constructor(props) {
    super(props);
    this.state = {
      sideModal: false,
      currentPeriod: this.props.currentPeriod
    }
  }

  public render(): React.ReactElement<IPeriodsProps> {

    const getDate = (date) => {
      return moment(date).format('DD.MM.YYYY');
    }

    const sideModalHandler = (status) => {
      this.setState( {sideModal: status} );
    }

    const getPeriod = (period) => {
      this.setState({currentPeriod: period})
      this.props.getCurrentPeriod(period)
    }

    return (
      <div className='periods'>
          <div className='periods-container'>
            <span>{this.state.currentPeriod.Title}</span>
            <span className='period-container_date'>
              {getDate(this.state.currentPeriod.DateStart)} - {getDate(this.state.currentPeriod.DateEnd)}
            </span>
            <span className='period-container_status' style={{color: this.state.currentPeriod.Status === 'В работе' ? '#3462a5' : ''}}>
              ({this.state.currentPeriod.Status})
            </span>
          </div>
          <IoListSharp className='periods-list-icon' onClick={() => sideModalHandler(true)}/>
          <SideModal title="Периоды" status={this.state.sideModal} func={getPeriod} sideModalHandler={sideModalHandler} width="50%" component="periodsList"></SideModal>
      </div>
    );
  };
};

Periods.contextType = Context;

const mapStateToProps = (state) => ({
  currentPeriod: state.goals.currentPeriod,
});

export default connect(mapStateToProps)(Periods);
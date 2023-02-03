import * as React from 'react';
import { connect } from 'react-redux';
import { IPeriodsListProps } from '../../../interfaces/IPeriodsListProps';
import { Context } from '../../../context';
import './styles/periodsList.scss';
import './styles/datePicker.scss';
import moment from 'moment';
import CentrModal from './modals/CentrModal';
import Button from './Button';
import { closePeriod, createPeriod } from '../../../api/goals';
import popupState from '../../../state/popupState';
import * as goalsActions from '../../../store/actions/goalsActions';
import DatePicker from 'react-date-picker';
import { MdEventNote } from 'react-icons/md';
import 'moment/locale/ru';
import errors from '../../../state/errors';


interface IState {
  centrModalClosePeriod: any;
  loadingClosePeriod: boolean;
  loadingBeginPeriod: boolean;
  centrModalBeginPeriod: boolean;
  dateStart: Date;
  dateEnd: Date
}

class PeriodsList extends React.Component<IPeriodsListProps, IState, {}> {

  context!: React.ContextType<typeof Context>

  constructor(props) {
    super(props);
    this.state = {
      centrModalClosePeriod: false,
      centrModalBeginPeriod: false,
      loadingClosePeriod: false,
      loadingBeginPeriod: false,
      dateStart: new Date(),
      dateEnd: new Date()
    }
  }

  public render(): React.ReactElement<IPeriodsListProps> {

    const getDate = (date) => {
      return moment(date).format('DD.MM.YYYY');
    }

    const getStartDate = (value) => {
      this.setState({dateStart: value});
    }

    const getEndDate = (value) => {
      this.setState({dateEnd: value});
    }

    const getPeriod = (period) => {
      this.props.func(period);
      this.props.modalHandler(false);
    }

    const wordForm = (num, word) => {
      const cases = [2, 0, 1, 1, 1, 2];  
      return word[ (num%100>4 && num%100<20)? 2 : cases[(num%10<5)?num%10:5] ];  
    }

    const closeModalPeriod = (status) => {
      this.setState({centrModalClosePeriod: status})
    }

    const beginPeriodModal = (status) => {
      this.setState({centrModalBeginPeriod: status})
    }

    const getCountDays = () => {
      return this.context.getCountDays(this.props.currentPeriod.DateEnd);
    }

    const closePeriodHandler = () => {
      this.setState({loadingClosePeriod: true});
      closePeriod(this.context.spContext, this.props.currentPeriod.Id).then(() => {
        this.props.dispatch(goalsActions.fetchPeriods(this.context.spContext));
        this.context.addPopup(popupState.success, 'Период успешно закрыт');
        closeModalPeriod(false);
        this.props.modalHandler(false);
        const response = this.props.currentPeriod;
        response.Status = 'Закрыт'
        this.props.func(response);
      }).catch(() => {
        this.context.addPopup(popupState.error, 'Произошла ошибка');
      }).finally(() => {
        this.setState({loadingClosePeriod: false});
      })
    }

    const beginPeriodHandler = () => {
      this.setState({loadingBeginPeriod: true});
      const data = {
        title: moment(new Date).format('MMMM YYYY'),
        status: 'В работе',
        dateStart: this.state.dateStart,
        dateEnd: this.state.dateEnd
      }
      createPeriod(this.context.spContext, data).then((res : any) => {
        if (res.error) {
          if (errors.map(item => item.code === res.error.code)) {
            this.context.addPopup(popupState.error, 'Период с такими данными уже существует', 8000);
          }
          return;
        }
        this.context.addPopup(popupState.success, 'Новый период создан');
        this.props.dispatch(goalsActions.fetchPeriods(this.context.spContext));
        beginPeriodModal(false);
        this.props.modalHandler(false);
        this.props.func(res.d);
      }).catch((err) => {
        Promise.reject(err);
      }).finally(() => {
        this.setState({loadingBeginPeriod: false});
      })
    }

    return (
      <div className='periods-list'>
        {this.props.periods.every(period => period.Status == 'Закрыт') && <div className='periods-list_period_close btn' onClick={() => beginPeriodModal(true)}>Начать период</div>}
        {this.props.currentPeriod.Status === 'В работе' && 
        <div className='periods-list_current-period'>
          <div className='periods-list_label'>Текущий период</div>
          <div className='periods-list_period_close btn' onClick={() => closeModalPeriod(true)}>Закрыть период</div>
          <div className='periods-list_current-period_container container' onClick={() => getPeriod(this.props.currentPeriod)}>
            <div className='periods-list_current-period_title title'>{this.props.currentPeriod.Title}</div>
            <div className='periods-list_current-period_date date'>
              {getDate(this.props.currentPeriod.DateStart)} - {getDate(this.props.currentPeriod.DateEnd)}
            </div>
            <div className='periods-list_current-period_status status'>{this.props.currentPeriod.Status}</div>
          </div>
        </div>}
        <div className='periods-list_prev-period'>
          <div className='periods-list_label'>Прошлые периоды</div>
            <div className='periods-list_prev-period_container'>
              {this.props.periods.filter(period => period.Status != 'В работе').map(period => {
                return (
                <div className='periods-list_prev-period_item container' onClick={() => getPeriod(period)}>
                  <div className='periods-list_prev-period_item_title title'>{period.Title}</div>
                  <div className='periods-list_prev-period_item_date date'>
                  {getDate(period.DateStart)} - {getDate(period.DateEnd)}
                  </div>
                  <div className='periods-list_prev-period_item_status status'>{period.Status}</div>
                </div>
                )
              })}
            </div>
        </div>
        <CentrModal
        title="Закрытие периода"
        alertText={`${getCountDays() > 0 ? `До конца периода осталось ${getCountDays()} ${wordForm(getCountDays(), ['день', 'дня', 'дней'])}. Вы уверены что хотите закрыть период ?` : 'Вы уверены что хотите закрыть период ?'}`}
        status={this.state.centrModalClosePeriod}
        component="alert">
          <Button
          title='Отмена'
          border={true}
          fill={false}
          color="#888888"
          margin='0 15px 0 0'
          key="btn"
          handler={() => closeModalPeriod(false)}
          />
          <Button
          title={`Продолжить`}
          handler={() => closePeriodHandler()}
          border={false}
          fill={true}
          color="#fff"
          key="btn"
          loading={this.state.loadingClosePeriod}
          />
        </CentrModal>
        <CentrModal
        title="Новый период аттестации"
        status={this.state.centrModalBeginPeriod}
        component="alert">
          <div key={'div'} className='period-dates'>
            <div className='period-dates_container'>
              <div className='period-dates_date-pickers' style={{marginBottom: '35px'}}>
                <div className='period-dates_date-pickers_label'>Дата c:</div>
                <MdEventNote className='date-icon'/>
                <DatePicker
                  value={this.state.dateStart}
                  onChange={(value) => getStartDate(value)}
                  className={'date-picker'}
                  clearIcon={null}
                  calendarIcon={null}
                  required={true}
                  format='dd.MM.yyyy'
                />
              </div>
              <div className='period-dates_date-pickers'>
                <div className='period-dates_date-pickers_label'>Дата по:</div>
                <MdEventNote className='date-icon'/>
                <DatePicker
                  value={this.state.dateEnd}
                  onChange={(value) => getEndDate(value)}
                  className={'date-picker'}
                  clearIcon={null}
                  calendarIcon={null}
                  required={true}
                  format='dd.MM.yyyy'
                />
              </div>
            </div>
          </div>
          <Button
          title='Отмена'
          border={true}
          fill={false}
          color="#888888"
          margin='0 15px 0 0'
          key="btn"
          handler={() => beginPeriodModal(false)}
          />
          <Button
          title={`Создать период`}
          handler={() => beginPeriodHandler()}
          border={false}
          fill={true}
          color="#fff"
          key="btn"
          loading={this.state.loadingBeginPeriod}
          />
        </CentrModal>
      </div>
    );
  };
};

PeriodsList.contextType = Context;

const mapStateToProps = (state) => ({
  currentPeriod: state.goals.currentPeriod,
  periods: state.goals.periods.sort((a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime())
});

export default connect(mapStateToProps)(PeriodsList);
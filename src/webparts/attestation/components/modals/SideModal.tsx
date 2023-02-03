import * as React from 'react';
import { Suspense } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import  * as PropTypes from 'prop-types';
import Loader from '../loaders/Loader';
import style from '../styles/sideModal.module.scss';
import OfferGoal from '../OfferGoal';
import ViewMyGoal from '../ViewMyGoal';
import ViewDirectoryGoal from '../ViewDirectoryGoal';
import CreateGoal from '../CreateGoal';
import EditGoal from '../EditGoal';
import AppointGoal from '../AppointGoal';
import PeriodsList from '../PeriodsList';
import EditUserGoal from '../EditUserGoal';
import OfferDirectoryGoal from '../../components/OfferDirectoryGoal';

const SideModal = (props) => {

  const components = {
    offerGoal: OfferGoal,
    viewMyGoal: ViewMyGoal,
    viewDirectoryGoal: ViewDirectoryGoal,
    createGoal: CreateGoal,
    editGoal: EditGoal,
    appointGoal: AppointGoal,
    periodsList: PeriodsList,
    editUserGoal: EditUserGoal,
    offerDirectoryGoal: OfferDirectoryGoal
  }

  const Component = components[props.component];

    const modalHandler = (event) => {
      const classes = [...event.target.classList].map(item => item.split('_')[0]);
        if(classes.includes('modal') || classes.includes('modalContentSideModalBack')) {
          props.sideModalHandler(false);
        }
    }

    return(
        <div className={`${style.modal} ${props.status ? style.modalActive : style.modalHide}`} onClick={(event) => modalHandler(event)}>
        <div className={style.modalContentSideModal} style={{ width: props.status ? props.width : '0px', opacity: props.status ? '1' : '0' }}>
          <div className={style.modalContentSideModalBack}>
            <AiOutlineArrowLeft onClick={() =>props.sideModalHandler(false)}/>
            Назад
          </div>
          {props.title && <div className={style.modalContentSideModalTitle}>
            {props.title}
          </div>}
          <div className={style.modalContentSideModalContainer}>
            {props.status && props.component &&
              <Component selectedPeriod={props.selectedPeriod} func={props.func} context={props.context} modalHandler={props.sideModalHandler} data={props.data}/>
            }
          </div>
        </div>
      </div>
    )
}

export default SideModal;

import * as React from 'react';
import { useState, useContext } from 'react';
import styles from './styles/navBar.module.scss';
import { AiOutlinePlus } from 'react-icons/ai';
import SideModal from './modals/SideModal';
import { NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { MdDisabledVisible } from 'react-icons/md';
import popupState from '../../../state/popupState';
import { Context } from '../../../context';


const NavBar = (props) => {
  const context = useContext(Context);
  const [modal, setModal] = useState(false);
  const [links, setLinks] = useState([
    {
      title: 'Мои цели',
      path: '/',
      visible: true
    },
    {
      title: 'Справочник целей',
      path: '/directoryGoals',
      visible: true
    },
    {
      title: 'Цели пользователей',
      path: '/usersGoals',
      visible: props.currentUserIsAdmin
    },
    {
      title: 'Статистика',
      path: '/stats',
      visible: props.currentUserIsAdmin
    },
  ]);

  const modalHandler = (status) => {
    if (!props.currentUserIsAdmin && props.currentPeriod.Status === 'Закрыт') {
      context.addPopup(popupState.warning, 'Период закрыт', 5000);
      return;
    }
    setModal(status);
  }

  const { location } = props;

  return(
    <div className={styles.navBar}>
      <div className={styles.navBarItems}>
        <div className={styles.navBarItemsLinks}>
          {links.map(link => {
            return <div className={`${styles.navBarItemsLink} ${location.pathname === link.path ? styles.navBarItemsLinkActive : ''} ${link.visible ? "" : styles.hide}`}>
               <NavLink to={`${ link.path}`} >
                  {link.title}
                </NavLink>
              </div>
          })}
        </div>
        <div className={styles.navBarItemsBtnWrapper}>
          {props.currentUserIsAdmin != null &&
          <div className={styles.navBarItemsBtn} onClick={() => modalHandler(true)}>
            <AiOutlinePlus/> {props.currentUserIsAdmin ? 'Цель' : 'Предложить цель'}
          </div>
          }
        </div>
      </div>
      {!props.currentUserIsAdmin && <SideModal title="Предложение цели" status={modal} sideModalHandler={modalHandler} width="50%" component='offerGoal'/>} 
      {props.currentUserIsAdmin && <SideModal title="Создание цели" status={modal} sideModalHandler={modalHandler} width="50%" component='createGoal'/>} 
    </div>
  )
}

const mapStateToProps = (state) => ({
  currentUserIsAdmin: state.users.currentUserIsAdmin,
  currentPeriod: state.goals.currentPeriod
});

export default withRouter(connect(mapStateToProps)(NavBar));
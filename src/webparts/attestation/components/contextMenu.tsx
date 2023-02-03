import InputComponent from './inputs/Text';
import Button from './Button';
import * as React from 'react';
import { useState, useContext } from 'react';
import './styles/contextMenu.scss';
import { connect } from 'react-redux';
import CentrModal from './modals/CentrModal';
import { Context } from '../../../context';
import { RiPencilFill } from 'react-icons/ri';
import { MdDeleteOutline } from 'react-icons/md';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { fetchSections } from '../../../store/actions/goalsActions';
import popupState from '../../../state/popupState';
import { deleteSection } from '../../../api/goals';

const ContextMenu = ({prop, closeModal, dispatch}) => {
  document.addEventListener('click', (e : any) => {
    if(!(e.path.find(el => el.className == 'context-menu'))) closeModal();
  }, {once: true})
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const context = useContext(Context);

  const modalHandler = (status, type = 'create') => {
    setModalType(type);
    setShowModal(status);
  }

  const deleteSectionBtn = () => {
    deleteSection(context.spContext, prop.section.Id).then(() => {
      dispatch(fetchSections(context.spContext));
      setShowModal(false)
      context.addPopup(popupState.success, 'Подраздел успешно добавлен');
    }).catch((e) => {
      context.addPopup(popupState.error, 'Произошла ошибка');
    }).finally(() => {
      closeModal();
    })
  }

  return(
    <div className="context-menu" style={{top:`${prop.event.pageY}px`, left:`${prop.event.pageX}px`}}>
      <div className="context-menu_list">
        {prop.section.ParentId == 0 && <div className="context-menu_list_item" onClick={() => modalHandler(true, 'create')}>
          <MdOutlineCreateNewFolder/>
          <div className="context-menu_list_item_text">Создать подраздел</div>
        </div>}
        <div className="context-menu_list_item" onClick={() => modalHandler(true, 'edit')}>
          <RiPencilFill/>
          <div className="context-menu_list_item_text">Переименовать</div>
        </div>
        <div className="context-menu_list_item" onClick={() => deleteSectionBtn()}>
          <MdDeleteOutline/>
          <div className="context-menu_list_item_text">Удалить</div>
        </div>
      </div>
      {showModal && modalType == 'edit' &&
        <CentrModal
        title="Переименовать раздел"
        status={showModal}
        centrModalHandler={setShowModal}
        data={{
          section: prop.section,
          submitHandler: closeModal
        }}
        component="editSection"/>}
      {showModal && modalType == 'create' &&
        <CentrModal
        title="Новый подраздел"
        status={showModal}
        centrModalHandler={setShowModal}
        data={{
          section: prop.section,
          submitHandler: closeModal
        }}
        component="createSubSection"/>}
    </div>
  )
}

export default connect()(ContextMenu);

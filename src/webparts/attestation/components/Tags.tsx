import * as React from 'react';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosCloseCircle } from 'react-icons/io';
import CentrModal from './modals/CentrModal';
import Button from './Button';
import './styles/tags.scss';

const Tags = (props) => {

  const [showAlert, setShowAlert] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (props.defaultTags) {
      setTags(props.defaultTags);
      setSelectedTags(props.defaultTags);
    }
  }, [])

  useEffect(() => {
    if (props.getTags) props.getTags(tags);
  }, [tags]);

  const modalHandler = (status) => {
    setShowAlert(status);
  }

  const closeTagsModal = () => {
    setSelectedTags(selectedTags.filter(item => tags.includes(item)));
    modalHandler(false)
  }

  const openTagsModal = () => {
    setSelectedTags(tags);
    modalHandler(true)
  }

  const selectTag = async (tag) => {
    if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(item => item != tag))
    else setSelectedTags([...new Set(selectedTags.concat([tag]))]);
  }

  const addTag = () => {
    modalHandler(false);
    setTags(selectedTags);
  }

  const deleteTag = (tag) => {
    setTags(tags.filter(item => item != tag));
    setSelectedTags(selectedTags.filter(item => item != tag));
  }

  return(
    <div className='tags'>
      <div className='tags-label'>Теги</div>
      <div className='tags-tags_items'>
        {tags.map(tag => {
          return(
          <div className='tags-tags_item'>
            {props.deleteTag && <IoIosCloseCircle onClick={() => deleteTag(tag)}/> }
            {tag}
          </div>
          )
        })}
      </div>
      {props.showAddTag && 
      <div className='tags-add_tag' onClick={() => openTagsModal()}>
        <AiOutlinePlus/> Добавить новый тег
      </div>
      }
      <CentrModal
        title="Выберите теги"
        centrModalHandler={setShowAlert}
        status={showAlert}
        component="alert"
      >
        <div key={'div'} className='tags'>
          <div className='tags-tags_items alert-tags'>
            {props.tags.map(tag => {
              return (
              <div
              className={`tags-tags_item ${selectedTags.includes(tag) ? 'alert-tags_item_active' : ''}`}
              onClick={() => selectTag(tag)}
              >
                {tag}
              </div>
              )
            })}
          </div>
        </div>
        <Button
        title='Отмена'
        border={true}
        fill={false}
        color="#888888"
        margin='0 15px 0 0'
        handler={() => closeTagsModal()}
        key="btn"
        />
        <Button
        title={`Добавить`}
        border={false}
        fill={true}
        color="#fff"
        key="btn"
        handler={() => addTag()}
        />
      </CentrModal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  tags: state.goals.tags
});

export default connect(mapStateToProps)(Tags);
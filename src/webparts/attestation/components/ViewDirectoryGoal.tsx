import * as React from 'react';
import styles from './styles/viewDirectoryGoal.module.scss';
import Input from './inputs/Input';
import Button from './Button';
import Tags from './Tags';


const ViewDirectoryGoal = (props) => {
  return (
    <div className={styles.viewDirectoryGoal}>
    <Input
    placeholder=""
    type="text"
    label="Название цели"
    class={'modalInput'}
    readOnly={true}
    value={props.data.Title}
    />
    <Input
    placeholder=""
    type="text"
    label="Критерий достижения"
    class={'modalInput'}
    readOnly={true}
    value={props.data.AchievementCriteria}
    />
    <Input
    placeholder=""
    type="textarea"
    label="Описание"
    class={'modalTextArea'}
    readOnly={true}
    value={props.data.Description}
    />
    {props.data.Section && 
    <React.Fragment>
      <Input
      placeholder=""
      type="text"
      label="Раздел"
      class={'modalInput'}
      readOnly={true}
      value={props.data.Section.Title}
      />
    </React.Fragment>
    }
    {props.data.Tags && <Tags showAddTag={false} deleteTag={false} defaultTags={props.data.Tags}/>}
    <div style={{width: 'fit-content'}}>
      <Button
      title='Назад'
      border={false}
      handler={() => props.modalHandler(false)}
      fill={true}
      color="#fff"
      margin='20px 0'
      />
    </div>
  </div>
  )
}


export default ViewDirectoryGoal;
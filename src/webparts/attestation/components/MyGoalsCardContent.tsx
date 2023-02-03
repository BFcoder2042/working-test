import * as React from 'react';
import styles from './styles/myGoals.module.scss'
import { goalState, goalDefaultState } from '../../../state/goalState';
import { scaleState, defaultScaleState } from '../../../state/progressBarColorsState';
import { MdEventNote } from 'react-icons/md';
import { IoMdTimer} from 'react-icons/io';
import * as moment from 'moment';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import tooltipState from '../../../state/tooltipState';
import { useContext } from 'react';
import { Context } from '../../../context';

const MyGoalsCardContent = ({data}) => {

  const goalColors = goalState.filter(el => el.text === data.Status)[0] || goalDefaultState;
  const iconColors = scaleState.filter(el => el.text === data.Status)[0] || defaultScaleState;
  const start = moment(data.DateStart).format('DD.MM.YYYY');
  const end = moment(data.DateEnd).format('DD.MM.YYYY');
  const context = useContext(Context);
 
  return(
    <div className={styles.myGoalsCardContent}>
      <div className={styles.myGoalsCardContentHeader}>
        <div
          className={styles.myGoalsCardContentHeaderStatus}
          style={{background: goalColors.background, color: goalColors.color}}>
          {data.Status}
        </div>
      </div>
      <div className={styles.myGoalsCardContentTitle}>{data.NameGoal.Title}</div>
      {data && data.Description.length > 50 &&
      <Tooltip mouseEnterDelay={1} overlayInnerStyle={tooltipState} placement="bottom" trigger={`hover`} transitionName='rc-tooltip-zoom' overlay={<span>{data.Description}</span>}>
        <div className={styles.myGoalsCardContentDescription}>{data.Description.slice(0, 45) + '...'} </div>
      </Tooltip>
      }
      {data && data.Description.length < 50 &&
        <div className={styles.myGoalsCardContentDescription}>{data.Description}</div>
      }
      <div className={styles.myGoalsCardContentTiming}>
        <div className={styles.dateText}>
          <MdEventNote className={styles.icon}/>
          {start} - {end}
          </div>
        <div className={styles.dayText} style={{color: iconColors.color}} >
          <IoMdTimer className={styles.icon} style={{color: iconColors.color}}/>
          {context.getCountDays(data.DateEnd)} д.
          </div>
      </div>
    </div>
  )
} 
  
export default MyGoalsCardContent;
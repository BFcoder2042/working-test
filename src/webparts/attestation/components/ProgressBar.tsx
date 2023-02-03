import * as React from 'react';
import moment from 'moment';
import { useState, useEffect } from 'react';
import styles from './styles/progressBar.module.scss';

const ProgressBar = ({data}) => {
 
  const now = moment();
  const progress = moment().diff(data.DateStart, 'days');
  const dateDiff = moment(data.DateEnd).diff(data.DateStart, 'days');
  const percent = progress/dateDiff*100;
  const [complate, setComplate] = useState(0);
  
  useEffect( () => {
    setInterval( () => setComplate(percent), 500);
  }, []);

  const scaleState =[

      {
          text: 'Выполнена',
          background: '#06D010',
          width:'100%', 
      },
      {
          text: 'Не выполнена',
          background: '#CC0000',
          width: '100%',
      },
      {
        text: 'В работе',
        background: '#06D010',
        width: `${complate}%`,
      },
  ]
  const defaultColor =
      {
          background: '#E8E8E8',
          width: '100%',
      }
  
  const setColors = scaleState.filter(el => el.text === data.Status)[0] || defaultColor;

  return (
    <div className={styles.progBar}>
      {complate > 0 && 
      <div className={styles.progBarScale} 
      style={{
        width:setColors.width, 
        backgroundColor: setColors.background,  
        transition:'width 1s ease-in-out'}} />
      }
    </div>
  );
};

export default ProgressBar;

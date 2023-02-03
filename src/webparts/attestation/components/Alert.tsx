import * as React from 'react';
import './styles/alert.scss';

const Alert = (props) => { 
    return(
      <div className='alert'>
        {props.alertText && <div className='alert-text'>{props.alertText}</div>}
        <div className='alert-container'>
          {props.children.filter(child => child.key === 'div').map(div => {
            return div;
          })}
        </div>
        <div className='alert-btn'>
          {props.children.filter(child => child.key === 'btn').map(button => {
            return button;
          })}
        </div>
      </div>
    )
}

export default Alert;

import * as React from 'react';
import Loader from './loaders/Loader';
import style from './styles/button.module.scss';

const Button = (props) => {

    const styleLoader = {
        position: 'absolute',
    };

    return(
        <React.Fragment>
            <div
            onClick={props.handler}
            className={`${style.btn} ${props.disabled == false ? style.disabled : ''}`}
            style={{background: props.fill ? '#3462A5' : '', border: props.border ? 'solid 2px #c4c4c4ab' : '', color: props.color, margin: props.margin}}
            >
                {props.loading && <Loader width="35px" styleLoader={styleLoader} dark={false}/>}
                <span style={{opacity: props.loading ? '0' : '1'}}>{props.title}</span>
            </div>
        </React.Fragment>
    )
}

export default Button;

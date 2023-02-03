import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import styles from '../styles/input.module.scss';

const Text = (props) => {
    const input = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState("");

    useEffect(() => {
        if (props.setFieldValue && props.value) {
            setTimeout(() => {
                props.setFieldValue(props.name, props.value)
            }, 1)
        }
    }, [props.setFieldValue, props.value])
    return(
        <div className={styles.inputWrapper}>
            <input
            name={props.name}
            ref={input}
            className={`${styles[props.class]} ${props.readOnly ? styles.inputDisabled : ''} ${props.error ? styles['inputError'] : ''}`}
            placeholder={props.placeholder}
            style={props.styleInput}
            onBlur={props.onBlur}
            disabled={props.desable}
            onChange={props.onChange}
            readOnly={props.readOnly}
            value={props.value === "" ? "" : props.value || value}
            onInputCapture={(event) => setValue(event.currentTarget.value)}
            onInput={props.onInput}
            >
            </input>
        </div>
    )
}

export default Text;

import * as React from 'react';
import style from '../styles/input.module.scss';
import Text from './Text';
import Password from './Password';
import Select from './Select';
import Search from './Search';
import Textarea from './Textarea';

const Input = (props) => {

  const components = {
    text: Text,
    password: Password,
    select: Select,
    search: Search,
    textarea: Textarea
  }

  const InputComponent = components[props.type];

  return(
    <div className={style.input} style={props.styleContainer}>  
    {props.label && <div className={style.label}>{props.label}</div>}
      <InputComponent
      name={props.name}
      class={props.class}
      placeholder={props.placeholder}
      onChange={props.onChange}
      onBlur={props.onBlur}
      error={props.error}
      loading={props.loading}
      child={props.child}
      onInput={props.onInput}
      selected={props.selected}
      readOnly={props.readOnly}
      value={props.value}
      styleInput={props.styleInput}
      setFieldValue={props.setFieldValue}
      margin={props.margin}
      disabledSelect={props.disabledSelect}
      clearSelect={props.clearSelect}
      />
    </div>
  )
}

export default Input;
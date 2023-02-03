import React, { useState } from 'react';
import styles from './styles/createSection.module.scss';
import Input from './inputs/Input';
import Button from './Button';
import { Formik } from "formik";
import * as yup from "yup";
import { createSection } from '../../../api/goals';
import { Context } from '../../../context';
import { useContext } from 'react';
import { connect } from 'react-redux';
import { fetchSections } from '../../../store/actions/goalsActions';
import popupState from '../../../state/popupState';

const CreateSection = (props) => {

  const { dispatch } = props;

  const context = useContext(Context);

  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object().shape({
    sectionNameField: yup.string().required("Это поле обязательно!"),
  });

    return (
        <Formik
        initialValues={{
          sectionNameField: "",
        }}
        validateOnBlur
        onSubmit={(values) => {
          const data = {
            title: values.sectionNameField
          }
          setLoading(true);
          createSection(context.spContext, data).then(() => {
            dispatch(fetchSections(context.spContext));
            props.centrModalHandler(false);
            context.addPopup(popupState.success, 'Раздел успешно добавлен');
          }).catch(() => {
            context.addPopup(popupState.error, 'Произошла ошибка');
          }).finally(() => {
            setLoading(false);
          })
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className={styles.createSection}>
            <div className={styles.sectionName}>
              <Input
              placeholder="Название раздела"
              type="text"
              class={'modalInput'}
              styleContainer={ {maxWidth: '330px'} }
              name="sectionNameField"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.sectionNameField ? true : false}
              />
            </div>
            <div className={styles.createSectionBtn}>
              <Button
              title='Отмена'
              border={true}
              fill={false}
              color="#888888"
              margin='0 15px 0 0'
              handler={() => props.centrModalHandler(false)}
              />
              <Button
              handler={() => handleSubmit()}
              title='Создать'
              border={false}
              fill={true}
              color="#fff"
              loading={loading}
              />
            </div>
        </div>
        )}
      </Formik>
    );
};

export default connect()(CreateSection);

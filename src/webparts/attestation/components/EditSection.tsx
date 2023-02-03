import React, { useState } from 'react';
import './styles/editSection.scss';
import Input from './inputs/Input';
import Button from './Button';
import { Formik } from "formik";
import * as yup from "yup";
import { updateSection } from '../../../api/goals';
import { Context } from '../../../context';
import { useContext } from 'react';
import { connect } from 'react-redux';
import { fetchSections, fetchDirectoryGoals } from '../../../store/actions/goalsActions';
import popupState from '../../../state/popupState';

const CreateSection = (props) => {

  const { dispatch } = props;

  const context = useContext(Context);

  const [loading, setLoading] = useState(false);
  const [sectionName, setsectionName] = useState(props.data.section.Title);

  const validationSchema = yup.object().shape({
    sectionNameField: yup.string().required("Это поле обязательно!"),
  });

    return (
        <Formik
        initialValues={{
          sectionNameField: props.data.section.Title,
        }}
        validateOnBlur
        onSubmit={(values) => {
          const data = {
            title: values.sectionNameField,
            id: props.data.section.Id
          }
          setLoading(true);
          updateSection(context.spContext, data).then(() => {
            dispatch(fetchSections(context.spContext));
            props.centrModalHandler(false);
            context.addPopup(popupState.success, 'Раздел успешно переименован');
          }).catch((e) => {
            context.addPopup(popupState.error, 'Произошла ошибка');
          }).finally(() => {
            props.data.submitHandler();
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
          setFieldValue
        }) => (
          <div className="edit-section">
            <div className="edit-section_section-name">
              <Input
              placeholder="Новое название раздела"
              type="text"
              class={'modalInput'}
              name="sectionNameField"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.sectionNameField ? true : false}
              value={sectionName}
              onInput={(event) => setsectionName(event.target.value)}
              setFieldValue={setFieldValue}
              />
            </div>
            <div className="edit-section_btn">
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
              title='Переименовать'
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

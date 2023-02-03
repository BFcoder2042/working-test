import React, { useState } from 'react';
import Input from './inputs/Input';
import './styles/createSubSection.scss';
import Button from './Button';
import { Formik } from "formik";
import * as yup from "yup";
import { createSubSection } from '../../../api/goals';
import { Context } from '../../../context';
import { useContext } from 'react';
import { connect } from 'react-redux';
import { fetchSections } from '../../../store/actions/goalsActions';
import popupState from '../../../state/popupState';

const CreateSubSection = (props) => {

  const { dispatch } = props;

  const context = useContext(Context);

  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object().shape({
    subSectionNameField: yup.string().required("Это поле обязательно!"),
  });

    return (
        <Formik
        initialValues={{
          sectionNameField: props.data.section.Title,
          subSectionNameField: "",
        }}
        validateOnBlur
        onSubmit={(values) => {
          const data = {
            title: values.subSectionNameField,
            parentId: props.data.section.Id
          }
          setLoading(true);
          createSubSection(context.spContext, data).then(() => {
            dispatch(fetchSections(context.spContext));
            props.centrModalHandler(false);
            context.addPopup(popupState.success, 'Подраздел успешно добавлен');
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
        }) => (
          <div className="create-sub-section">
            <div className="create-sub-section_section-name">
              <Input
              placeholder="Название раздела"
              type="text"
              value={props.data.section.Title}
              disabled={true}
              class={'modalInput'}
              name="sectionNameField"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.sectionNameField ? true : false}
              />
              <Input
              placeholder="Название подраздела"
              type="text"
              class={'modalInput'}
              name="subSectionNameField"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.subSectionNameField ? true : false}
              />
            </div>
            <div className="create-sub-section_btn">
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

export default connect()(CreateSubSection);

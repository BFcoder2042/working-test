import * as React from 'react';
import Input from './inputs/Input';
import Button from './Button';
import popupState from '../../../state/popupState';
import { Context } from '../../../context';
import { createGoal } from '../../../api/goals';
import { ICreateGoal } from '../../../interfaces/ICreateGoal';
import { connect } from 'react-redux';
import * as goalsActions from '../../../store/actions/goalsActions';
import { Formik } from "formik";
import * as yup from "yup";
import Tags from './Tags';
import './styles/createGoal.scss';
interface IState {
  section: any;
  subSection: any;
  clearSubSection: any;
  loading: any;
  tags: any;
}

class CreateGoal extends React.Component<ICreateGoal, IState, {}> {

  context!: React.ContextType<typeof Context>

  constructor(props) {
    super(props);
    this.state = {
      section: null,
      subSection: null,
      clearSubSection: null,
      loading: false,
      tags: []
    }
  }

  public render(): React.ReactElement<ICreateGoal> {

    const closeModal = () => {
      this.props.modalHandler(false);
    }

    const getSelectedItemSubSection = async (item) => {
      await this.setState({ subSection: item });
    }

    const getSelectedItemSection = async (item) => {
      await this.setState({ section: item });
      this.setState( {clearSubSection: true} )
      this.setState( {clearSubSection: null} )
    }

    const getTags = (tags) => {
      this.setState({tags: tags})
    }


    const createDirectoryGoal = (values) => {
      const currentSection = this.state.subSection ?? this.state.section
      this.setState( {loading: true} );
      const data = {
        title: values.goalName,
        achievementCriteria: values.criterion,
        description: values.description,
        sectionId: currentSection ? currentSection.Id : currentSection,
        tags: this.state.tags
      }
      createGoal(this.context.spContext, data).then((res) => {
        this.props.dispatch(goalsActions.fetchFilteringDirectoryGoals(this.context.spContext));
        closeModal();
        this.context.addPopup(popupState.success, 'Цель успешно создана');
      }).catch(() => {
        this.context.addPopup(popupState.error, 'Произошла ошибка');
      }).finally(() => {
        this.setState( {loading: false} );
      })
    }

    
    const validationSchema = yup.object().shape({
      goalName: yup.string().required("Это поле обязательно!"),
      criterion: yup.string().required('Это поле обязательно!'),
      description: yup.string().required('Это поле обязательно!')
    });

 

    return (
      <Formik
        initialValues={{
          goalName: "",
          criterion: "",
          description: ""
        }}
        validateOnBlur
        onSubmit={(values) => {
          createDirectoryGoal(values);
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isValid,
          handleSubmit,
          dirty,
        }) => (
        <div className='create-goal'>
          <Input
          placeholder="Введите текст"
          type="text"
          label="Название цели"
          class={'modalInput'}
          name="goalName"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.goalName ? true : false}
          />
          <Input
          placeholder="Введите текст"
          type="text"
          label="Критерий достижения"
          class={'modalInput'}
          name="criterion"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.criterion ? true : false}
          />
          <Input
          placeholder="Введите текст"
          type="textarea"
          label="Описание"
          class={'modalTextArea'}
          name="description"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.description ? true : false}
          />
          <Input
            placeholder="Выберите значение"
            type="select"
            label="Раздел"
            class={'modalInput'}
            child={this.props.sections.filter(section => !section.ParentId)}
            readOnly={true}
            styleInput={ {cursor: 'pointer'} }
            name="goalsField"
            selected={getSelectedItemSection}
          />
          <Input
            placeholder="Выберите значение"
            type="select"
            label="Подраздел"
            class={'modalInput'}
            child={this.state.section ? this.props.sections.filter(section => section.ParentId === this.state.section.Id) : []}
            readOnly={true}
            styleInput={ {cursor: 'pointer'} }
            name="goalsField"
            selected={getSelectedItemSubSection}
            disabledSelect={this.state.section ? false : true}
            clearSelect={this.state.clearSubSection}
          />
          <Tags showAddTag={true} deleteTag={true} getTags={getTags}/>
          <div className='create-goal_btn'>
              <div style={{display: 'flex'}}>
                <Button
                title='Создать цель'
                handler={() => handleSubmit()}
                border={false}
                fill={true}
                color="#fff"
                margin='0 15px 0 0'
                loading={this.state.loading}
                />
                <Button
                title='Отмена'
                fill={false}
                color="#888888"
                handler={() => closeModal()}
                />
              </div>
            </div>
        </div>
        )}
      </Formik>
    );
  };
};

const mapStateToProps = (state) => ({
  sections: state.goals.sections,
});

export default connect(mapStateToProps)(CreateGoal);

CreateGoal.contextType = Context;


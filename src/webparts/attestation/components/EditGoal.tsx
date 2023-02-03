import * as React from 'react';
import Input from './inputs/Input';
import Button from './Button';
import popupState from '../../../state/popupState';
import { Context } from '../../../context';
import { IEditGoal } from '../../../interfaces/IEditGoal';
import { connect } from 'react-redux';
import * as goalsActions from '../../../store/actions/goalsActions';
import './styles/editGoal.scss';
import { Formik } from "formik";
import * as yup from "yup";
import { updateGoal, getUsersGoal } from '../../../api/goals';
import CentrModal from './modals/CentrModal';
import { IUserGoalsObject } from '../../../interfaces/IGoals'
import Tags from './Tags';

interface IState {
  section: any;
  subSection: any;
  clearSubSection: any;
  loading: any;
  loadingAlertBtn: any;
  count: number;
  goalName: string;
  criterion: string;
  description: string;
  showAlert: boolean;
  data: any;
  tags: any;
}

class EditGoal extends React.Component<IEditGoal, IState, {}> {

  context!: React.ContextType<typeof Context>

  constructor(props) {
    super(props);
    this.state = {
      section: null,
      subSection: null,
      clearSubSection: null,
      loading: false,
      loadingAlertBtn: false,
      count: 0,
      goalName: '',
      criterion: '',
      description: '',
      showAlert: false,
      data: null,
      tags: []
    }
  }

  public setSelectValues () {
    this.props.sections.map(async item => {
      if (item.Id === this.props.data.SectionId && !item.ParentId) {
        await this.setState( {section: item} )
      }
      if (item.Id === this.props.data.SectionId && item.ParentId) {
        this.setState( { section: this.props.sections.filter(elem => elem.Id === item.ParentId)[0] } )
        this.setState( {subSection: item} )
      }
    })
  }


  componentDidMount(): void {
    this.setState( {goalName: this.props.data.Title} )
    this.setState( {criterion: this.props.data.AchievementCriteria} )
    this.setState( {description: this.props.data.Description} )
    this.setSelectValues();
  }
  
  public render(): React.ReactElement<IEditGoal> {
    

    const closeModal = () => {
      this.props.modalHandler(false);
    }

    const showAlert = (status) => {
      this.setState( {showAlert: status} )
    }

    const getSelectedItemSubSection = async (item) => {
      await this.setState({ subSection: item });
    }

    const getSelectedItemSection = async (item) => {
      this.setState( {count: this.state.count + 1} )
      await this.setState({ section: item ?? {} });
      if (this.state.count > 1) {
        this.setState( {clearSubSection: true} )
        this.setState( {clearSubSection: null} )
      }
    }

    const getTags = (tags) => {
      this.setState({tags: tags});
    }

    const updateGoalHandler = () => {
      this.setState( {loadingAlertBtn: true} );
      updateGoal(this.context.spContext, this.props.data.Id, this.state.data).then((res) => {
        this.props.dispatch(goalsActions.fetchFilteringDirectoryGoals(this.context.spContext));
        this.context.addPopup(popupState.success, 'Цель успешно обновлена')
        showAlert(false);
        closeModal();
      }).catch((err) => {
        this.context.addPopup(popupState.error, 'Произошла ошибка')
      }).finally(() => {
        this.setState( {loadingAlertBtn: false} );
      })
    }

    const changeGoal = async (values) => {
      this.setState( {loading: true} );
      const currentSection = this.state.subSection ?? this.state.section
      const data = {
        title: values.goalName,
        criterion: values.criterion,
        description: values.description,
        sectionId: currentSection ? currentSection.Id ?? null : null,
        tags: this.state.tags
      }
      await this.setState( {data: data} );
      getUsersGoal(this.context.spContext, this.props.data.Id).then((result : IUserGoalsObject) => {
        if (result.value.length) {
          showAlert(true);
        } else {
          updateGoalHandler();
        }
      }).catch((err) => {
        this.context.addPopup(popupState.error, 'Произошла ошибка')
      }).finally(() => {
        this.setState( {loading: false} );
      })
  
    }

    const validationSchema = yup.object().shape({
      goalName: yup.string().required("Это поле обязательно!"),
      criterion: yup.string().required("Это поле обязательно!"),
      description: yup.string().required("Это поле обязательно!"),
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
        changeGoal(values)
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
        setFieldValue,
      }) => (
      <div className='edit-goal'>
        <Input
        placeholder="Введите текст"
        type="text"
        label="Название цели"
        class={'modalInput'}
        value={this.state.goalName}
        name="goalName"
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.goalName ? true : false}
        onInput={(event) => this.setState({goalName: event.target.value})}
        setFieldValue={setFieldValue}
        />
        <Input
        placeholder="Введите текст"
        type="text"
        label="Критерий достижения"
        class={'modalInput'}
        value={this.state.criterion}
        name="criterion"
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.criterion ? true : false}
        onInput={(event) => this.setState({criterion: event.target.value})}
        setFieldValue={setFieldValue}
        />
        <Input
        placeholder="Введите текст"
        type="textarea"
        label="Описание"
        class={'modalTextArea'}
        value={this.state.description}
        name="description"
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description ? true : false}
        onInput={(event) => this.setState({description: event.target.value})}
        setFieldValue={setFieldValue}
        />
        {this.state.section && 
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
          value={this.state.section}
          />
        }
        {this.state.section && 
          <Input
          placeholder="Выберите значение"
          type="select"
          label="Подраздел"
          class={'modalInput'}
          child={ Object.values(this.state.section).length ? this.props.sections.filter(section => section.ParentId === this.state.section.Id) : []}
          readOnly={true}
          styleInput={ {cursor: 'pointer'} }
          name="goalsField"
          selected={getSelectedItemSubSection}
          value={this.state.subSection}
          clearSelect={this.state.clearSubSection}
          />
        }
        {!this.state.section && !this.state.subSection &&
          <React.Fragment>
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
          </React.Fragment>
        }
        <Tags  showAddTag={true} deleteTag={true} getTags={getTags} defaultTags={this.props.data.Tags}/>
          <div className='edit-goal_btn'>
            <div style={{display: 'flex'}}>
              <Button
              title='Изменить'
              border={false}
              fill={true}
              color="#fff"
              margin='0 15px 0 0'
              loading={this.state.loading}
              handler={() => handleSubmit()}
              />
              <Button
              title='Отмена'
              fill={false}
              color="#888888"
              handler={() => closeModal()}
              />
            </div>
          </div>
          <CentrModal
          title="Изменить цель ?"
          alertText={'Цель найдена среди назначенных, вы точно хотите ее изменить ?'}
          centrModalHandler={showAlert}
          status={this.state.showAlert}
          component="alert"
          >
            <Button
            title='Отмена'
            border={true}
            fill={false}
            color="#888888"
            margin='0 15px 0 0'
            handler={() => showAlert(false)}
            key="btn"
            />
            <Button
            title={`Продолжить`}
            border={false}
            fill={true}
            color="#fff"
            handler={() => updateGoalHandler()}
            loading={this.state.loadingAlertBtn}
            key="btn"
            />
          </CentrModal>
      </div>
      )}
      </Formik>
    );
  };
};

const mapStateToProps = (state) => ({
  sections: state.goals.sections,
});

export default connect(mapStateToProps)(EditGoal);

EditGoal.contextType = Context;


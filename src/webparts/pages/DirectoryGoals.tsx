import * as React from 'react';
import { connect } from 'react-redux';
import { Context } from '../../context';
import styles from '../attestation/components/styles/directoryGoals.module.scss';
import Sections from '../attestation/components/Sections';
import * as goalsActions from '../../store/actions/goalsActions';
import Crumbs from '../attestation/components/Crumbs';
import Input from '../attestation/components/inputs/Input';
import DirectoryGoalRows from '../attestation/components/DirectoryGoalRows';
import CentrModal from '../attestation/components/modals/CentrModal';
import { IDirectoryGoalsProps } from '../../interfaces/IDirectoryGoalsProps';

interface IState {
  centrModal: boolean;
  selectedSection: any;
  tag: any;
  name: any;
  clearTag: any;
}
class DirectoryGoals extends React.Component<IDirectoryGoalsProps, IState, {}> {

  context!: React.ContextType<typeof Context>

  constructor(props) {
    super(props);
    this.state = {
      centrModal: false,
      selectedSection: {
        title: null,
        item: null,
        selectionId: null
      },
      tag: null,
      name: "",
      clearTag: null
    }
  }

  async componentDidMount(): Promise<void> {
    this.props.dispatch(goalsActions.fetchFilteringDirectoryGoals(this.context.spContext));
    this.setState({
      selectedSection:{
        title: 'Все цели',
        item: null,
        selectionId: null
      }
    });
  }

  public render(): React.ReactElement<IDirectoryGoalsProps> {

    const selectSection = async (title, item = null) => {
      await this.setState({
        selectedSection:{
          title: title,
          item: item,
          selectionId: item ? item.Id : null
        }
      });
      this.props.dispatch(goalsActions.fetchFilteringDirectoryGoals(this.context.spContext, this.state.selectedSection.selectionId, this.state.name, this.state.tag));
    }

    const getSelectedTag = async (item) => {
      await this.setState( { tag: item } );
      this.props.dispatch(goalsActions.fetchFilteringDirectoryGoals(this.context.spContext, this.state.selectedSection.selectionId, this.state.name, this.state.tag));
    }

    const getName = async (event) => {
      await this.setState( { name: event.target.value } );
      this.props.dispatch(goalsActions.fetchFilteringDirectoryGoals(this.context.spContext, this.state.selectedSection.selectionId, this.state.name, this.state.tag));
    }

    const centrModalHandler = async (status) => {
      await this.setState( {centrModal: status} );
    };

    const crumbsHandler = async (section) => {
      selectSection(section.Title, section);
    }

    return (
      <div className={styles.directoryGoals} onContextMenu={(event) => event.preventDefault()}>
      {this.props.sections.length > 0  && <Sections centrModalHandler={centrModalHandler} selectSection={selectSection} selectedSection={this.state.selectedSection}/> }
      <div className={styles.directoryGoalsContent}>
        <Crumbs selectedSection={this.state.selectedSection} crumbsHandler={crumbsHandler}/>
        <div className={styles.directoryGoalsFiltres}>
          <div className={styles.directoryGoalsInputs}>
          <Input
            placeholder="Поиск по названию"
            type="text"
            class={'defaultInput'}
            styleContainer={ {margin: '0 15px 0 0', maxWidth: '300px'} }
            onInput={(event) => getName(event)}
            value={this.state.name}
          />
          <Input
            placeholder="Теги"
            type="select"
            class={'defaultInput'}
            readOnly={true}
            styleInput={ {cursor: 'pointer'} }
            styleContainer={ {maxWidth: '150px'} }
            child={this.props.tags}
            selected={getSelectedTag}
            clearSelect={this.state.clearTag}
          />
          </div>
        <div className={styles.directoryGoalsExport}>
          <div>DOC</div>
          <div>PDF</div>
        </div>
        </div>
        <div className={styles.directoryGoalsRows}>
          <div className={styles.directoryGoalsRowsLabels}>
            <span>Название</span>
            <span>Критерий достижения</span>
          </div>
          <div className={styles.directoryGoalsRowsItems}>
            {this.props.filteringDirectoryGoals.map((goal, index) => {
              return <DirectoryGoalRows data={goal} index={index}/>
            })}
          </div>
        </div>
      </div>
      <CentrModal title="Новый раздел" status={this.state.centrModal} centrModalHandler={centrModalHandler} component="createSection"/>
    </div>
    );
  };
};

DirectoryGoals.contextType = Context;

const mapStateToProps = (state) => ({
  sections: state.goals.sections,
  currentUser: state.users.currentUser,
  filteringDirectoryGoals: state.goals.filteringDirectoryGoals,
  tags: state.goals.tags,
  directoryGoals: state.goals.directoryGoals,
  currentUserIsAdmin: state.users.currentUserIsAdmin
});

export default connect(mapStateToProps)(DirectoryGoals);

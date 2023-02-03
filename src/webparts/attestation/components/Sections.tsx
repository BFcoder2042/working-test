import * as React from 'react';
import styles from './styles/sections.module.scss';
import { Context } from '../../../context';
import { ISectionsProps } from '../../../interfaces/ISectionsProps';
import * as goalsActions from '../../../store/actions/goalsActions';
import { connect } from 'react-redux';
import { HiFolder } from 'react-icons/hi';
import ContextMenu from './contextMenu';
import { HiOutlineFolder } from 'react-icons/hi';
import { IoListSharp } from 'react-icons/io5';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoMdArrowDropright } from 'react-icons/Io';

interface IState {
  sections: Array<any>;
  context: any;
}

class Sections extends React.Component<ISectionsProps, IState, {}> {

  context!: React.ContextType<typeof Context>

  constructor(props) {
    super(props);
    this.state = {
      sections: [],
      context: { state: false }
    }
  }


  public modifiedSections = () => {
    const subSections = this.props.sections.filter(sub => sub.ParentId)
    subSections.map(sub => {
      sub.parent = this.props.sections.filter(section => sub.ParentId === section.Id)
    });
    if (subSections.length) {
      const sections = this.props.sections.map(main => {
        main.subSections = subSections.filter(sub => sub.ParentId === main.Id);
        main.status = false;
        return main;
      })
      .filter(main => main.subSections.length || !main.ParentId);
      return sections;
    }
  }

  componentDidMount(): void {
    this.setState({
      sections: this.modifiedSections()
    });
  }

  componentDidUpdate(prevProps): void {
    if (prevProps.sections.length != this.props.sections.length ||
    prevProps.sections.map(el => el.Title).join() != this.props.sections.map(el => el.Title).join()) {
      this.setState({
        sections: this.modifiedSections()
      });
    }
  }

  public render(): React.ReactElement<ISectionsProps> {

    const showSubSection = (section) => {
      const sections = this.state.sections.map(item => {
        if (item.Id === section.Id) {
          item.status = !item.status
        }
        return item;
      });
      this.setState({sections: sections})
    };

    const closeContextMenu = () => {
      this.setState({
        context: {
          state: false
        }
      });
    };

    const contextMenuHandler = (event, section) => {
      if(!this.props.currentUserIsAdmin) return
      event.preventDefault()
      this.setState({
        context: {
          state: true,
          event: {
            pageX: event.pageX,
            pageY: event.pageY,
          },
          section: section
        }
      });
    };

    return (
      <div className={styles.sections}>
        <div className={styles.sectionsWrapper}>
          {this.props.currentUserIsAdmin && <div className={styles.createSections} onClick={() => this.props.centrModalHandler(true)}>
            <AiOutlinePlus/> Создать раздел
          </div>}
          <div className={styles.sectionsItems}>
            <div className={styles.sectionsItem}>
              <div className={`${styles.sectionsItemMain} ${this.props.selectedSection.title === 'Все цели' ? styles.sectionItemMainActive : ''}`} onClick={() => this.props.selectSection('Все цели')}>
                <span><IoListSharp/> Все цели</span>
              </div>
            </div>
            {this.state.sections.map(section => {
              return(
                <div className={styles.sectionsItem}>
                  <div className={`${styles.sectionsItemMain}`} >
                    {section.subSections.length != 0 && <IoMdArrowDropright onClick={() => showSubSection(section)} className={`${styles.sectionDrop} ${section.status ? styles.dropSubArrowShow : styles.dropSubArrowHide}`}/> }
                    <span className={`${this.props.selectedSection.selectionId === section.Id ? styles.sectionItemMainActive : ''}`} onClick={() => this.props.selectSection( section.Title, section )} onContextMenu={(event) => contextMenuHandler(event, section)}><HiFolder/> {section.Title}</span>
                  </div>
                  <div className={`${styles.sectionsItemChilds} ${section.status ? styles.subSectionShow : styles.subSectionHide }`}>
                  {section.subSections.map(subSection => {
                    return <div className={`${styles.sectionsItemChild} ${this.props.selectedSection.selectionId === subSection.Id ? styles.sectionItemChildActive : ''}`} onClick={() => this.props.selectSection(subSection.Title, subSection)} onContextMenu={(event) => contextMenuHandler(event, subSection)}><HiOutlineFolder/> {subSection.Title}</div>
                  })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        { this.state.context.state && <ContextMenu prop={this.state.context} closeModal={closeContextMenu} />}
      </div>
    );
  };
};

const mapStateToProps = (state) => ({
  sections: state.goals.sections,
  currentUserIsAdmin: state.users.currentUserIsAdmin,
});

export default connect(mapStateToProps)(Sections);

Sections.contextType = Context;

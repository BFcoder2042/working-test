import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import styles from './styles/crumbs.module.scss';

const Crumbs = (props) => {

  const parentSectionHandler = (parentSection) => {
    props.crumbsHandler(parentSection);
  }

  return(
    <div className={styles.crumbs}>
      {props.selectedSection && 
        <div className={styles.crumbsItem}>
          {props.selectedSection.item && props.selectedSection.item.parent &&
            <React.Fragment>
              <span className={styles.crumbsClickActive} onClick={() => parentSectionHandler(props.selectedSection.item.parent[0])}>{props.selectedSection.item.parent[0].Title}</span>
              <MdOutlineKeyboardArrowRight/>
            </React.Fragment>
          }
          <span>{props.selectedSection.title}</span>
        </div>      
      }
    </div>
  )
}


export default Crumbs; 
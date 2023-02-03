import * as React from 'react';
import MyGoalsCard from '../attestation/components/MyGoalsCard';
import styles from '../attestation/components/styles/myGoals.module.scss';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/goalsActions';
import { Context } from '../../context';
import { useContext, useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';

const MyGoals = (props) => {

  const context = useContext(Context);
  const { dispatch } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.currentPeriod.Status === 'В работе') {
      setLoading(true);
      dispatch(actions.fetchMyGoals(context.spContext, props.currentPeriod.Id, props.currentUser.Id));
      setLoading(false);
    } else dispatch(actions.clearMyGoals());
  }, []);

  return(
    <div className={styles.myGoals}>
      {loading &&
      [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(() => {
       return (
        <ContentLoader
        backgroundColor="#f0f0f0"
        foregroundColor="#e7e9ee"
        viewBox="0 0 350 151" speed={1}
        > 
        <rect rx="15" ry="15" width="100%" height="100%" />
        </ContentLoader>
       )
      })}
      {!loading &&
      <React.Fragment>
        {props.myGoals.map((goal, index) => { return <MyGoalsCard data={goal} index={index}/> })}
      </React.Fragment>
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  myGoals: state.goals.myGoals,
  currentUser: state.users.currentUser,
  currentPeriod: state.goals.currentPeriod,
});

export default connect(mapStateToProps)(MyGoals);


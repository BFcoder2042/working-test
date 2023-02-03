import * as React from 'react';
import { IAttestationProps } from './IAttestationProps';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import App from './App';
import token from '../../../api/auth';
const ACCESS_TOKEN_KEY = "accessToken";

export default class Attestation extends React.Component<IAttestationProps, {}, {}> {

  componentDidMount(): void {
    token().then((res : any) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access_token);
    }).catch(err => {
      Promise.reject(err);
    })
  }

  public render(): React.ReactElement<IAttestationProps> {

    return (
      <Provider store={store}>
        {localStorage.getItem(ACCESS_TOKEN_KEY) && 
          <App {...store} spContext={this.props.context}/>
        }
      </Provider>
    );
  }
}

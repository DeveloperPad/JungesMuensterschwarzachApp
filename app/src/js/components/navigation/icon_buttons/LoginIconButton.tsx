import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { IconButton, Tooltip } from '@material-ui/core';
import { Input } from '@material-ui/icons';

import Dict from '../../../constants/dict';
import { AppUrls } from '../../../constants/specific-urls';
import { IUserKeys } from '../../../networking/account_data/IUser';
import { CookieService } from '../../../services/CookieService';

interface ILoginIconButtonState {
  isDisplayed: boolean
}

class LoginIconButton extends React.Component<RouteComponentProps<any, StaticContext>, ILoginIconButtonState> {

  public state: ILoginIconButtonState = {
    isDisplayed: false
  }

  private shouldCheckLoginState: boolean = true;

  public render(): React.ReactNode {
    if (this.state.isDisplayed === true) {
      return (
        <Tooltip title={Dict.navigation_app_sign_in}>
          <IconButton
            onClick={this.forward}>
            <Input />
          </IconButton>
        </Tooltip>
      );
    } else {
      return null;
    }
  }

  public componentDidMount(): void {
    this.checkLoginState();
  }

  public componentDidUpdate(): void {
    this.checkLoginState();
  }

  private checkLoginState = (): void => {
    if (!this.shouldCheckLoginState) {
      this.shouldCheckLoginState = true;
      return;
    }

    CookieService.get<number>(IUserKeys.accessLevel)
      .then(accessLevel => {
        const isDisplayed = accessLevel === null;

        this.shouldCheckLoginState = false;
        this.setState({
          isDisplayed
        });
      })
      .catch(error => {
        this.shouldCheckLoginState = false;
        this.setState(prevState => {
          return {
            ...prevState,
            isDisplayed: true
          };
        });
      });
  }

  private forward = (): void => {
    this.props.history.push(
      AppUrls.LOGIN
    );
  }

}

export default withRouter(LoginIconButton);
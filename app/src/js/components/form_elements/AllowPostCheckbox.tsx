import * as React from 'react';

import { Switch, Typography } from '@material-ui/core';

import Dict from '../../constants/dict';
import { IUserKeys } from '../../networking/account_data/IUser';
import ErrorMessageTypography from './ErrorMessageTypography';

interface IAllowPostCheckboxProps {
    checked: boolean;
    errorMessage: string | null;
    onUpdateValue: (key: IUserKeys.allowPost, value: number) => void;
    onBlur: (key: IUserKeys.allowPost, value: number) => void;
}

interface IAllowPostCheckboxState {
    submit: boolean;
}

export default class AllowPostCheckbox extends React.Component<IAllowPostCheckboxProps, IAllowPostCheckboxState> {

    constructor(props: IAllowPostCheckboxProps) {
        super(props);

        this.state = {
            submit: false
        };
    }

    public render(): React.ReactNode {
        return (
            <>
                <div style={contentDivStyle}>
                    <Typography variant="caption">
                        {Dict.account_allowPost}
                    </Typography>
                    <div style={contentDivSpacerStyle} />
                    <Switch
                        checked={this.props.checked}
                        color="primary"
                        name={IUserKeys.allowPost}
                        onChange={this.onChange}
                    />
                </div>
                <ErrorMessageTypography value={this.props.errorMessage} />
            </>
        );
    }

    public shouldComponentUpdate(nextProps: IAllowPostCheckboxProps, nextState: IAllowPostCheckboxState, nextContext: any): boolean {
        return this.props.checked !== nextProps.checked
            || this.props.errorMessage !== nextProps.errorMessage
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(prevProps: IAllowPostCheckboxProps, prevState: IAllowPostCheckboxState): void {
        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.allowPost,
                    this.props.checked ? 1 : 0
                );
            }
            this.setState({
                ...prevState,
                submit: false
            });
        }
    }

    public onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.onUpdateValue(
            IUserKeys.allowPost,
            (event.currentTarget as HTMLInputElement).checked ? 1 : 0
        );
        this.setState(prevState => {
            return {
                ...prevState,
                submit: true
            }
        });
    }

}

const contentDivStyle: React.CSSProperties = {
    alignItems: "center",
    display: "flex",
}

const contentDivSpacerStyle: React.CSSProperties = {
    flex: 1
}
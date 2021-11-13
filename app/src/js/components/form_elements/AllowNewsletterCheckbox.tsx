import * as React from 'react';

import { Checkbox, Switch, Typography } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import { CustomTheme, grid1Style, ThemeTypes } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';
import ErrorMessageTypography from './ErrorMessageTypography';

interface IAllowNewsletterCheckboxProps {
    checked: boolean;
    errorMessage: string | null;
    onUpdateValue: (key: IUserKeys.allowNewsletter, value: number) => void;
    onBlur?: (key: IUserKeys.allowNewsletter, value: number) => void;
    showErrorMessageOnLoad?: boolean; // default: true
    style?: React.CSSProperties;
    themeType?: ThemeTypes;
}

interface IAllowNewsletterCheckboxState {
    showErrorMessage: boolean;
    submit: boolean;
}

export default class AllowNewsletterCheckbox 
    extends React.Component<IAllowNewsletterCheckboxProps, IAllowNewsletterCheckboxState> {

    private contentDivStyle: React.CSSProperties = {
        ...this.props.style,
        alignItems: "center",
        display: "flex",
    }
    private lightTypographyStyle: React.CSSProperties = {
        color: CustomTheme.COLOR_WHITE
    }

    constructor(props: IAllowNewsletterCheckboxProps) {
        super(props);

        this.state = {
            showErrorMessage: props.showErrorMessageOnLoad === undefined || props.showErrorMessageOnLoad,
            submit: false
        };
    }

    public render(): React.ReactNode {
        return this.props.themeType && this.props.themeType === ThemeTypes.LIGHT ? (
            <>
                <div style={this.contentDivStyle}>
                    <Checkbox
                        checked={this.props.checked}
                        color="primary"
                        name={IUserKeys.allowNewsletter}
                        onChange={this.onChange}
                        style={this.lightTypographyStyle}
                    />
                    <div style={grid1Style} />
                    <Typography style={this.lightTypographyStyle}>
                        {Dict.account_allowNewsletter_registration}
                    </Typography>
                </div>
                <ErrorMessageTypography value={this.state.showErrorMessage ? this.props.errorMessage : null} />
            </>
            ) : (
            <>
                <div style={this.contentDivStyle}>
                    <Typography variant="caption">
                        {Dict.account_allowNewsletter}
                    </Typography>
                    <div style={contentDivSpacerStyle} />
                    <Switch
                        checked={this.props.checked}
                        color="primary"
                        name={IUserKeys.allowNewsletter}
                        onChange={this.onChange}
                    />
                </div>
                <ErrorMessageTypography value={this.state.showErrorMessage ? this.props.errorMessage : null} />
            </>
        );
    }

    public shouldComponentUpdate(
        nextProps: IAllowNewsletterCheckboxProps,
        nextState: IAllowNewsletterCheckboxState, nextContext: any): boolean {
        return this.props.checked !== nextProps.checked
            || this.props.errorMessage !== nextProps.errorMessage
            || this.state.submit !== nextState.submit;
    }

    public componentDidUpdate(
        prevProps: IAllowNewsletterCheckboxProps, 
        prevState: IAllowNewsletterCheckboxState): void {
        if (this.state.submit) {
            if (this.props.onBlur) {
                this.props.onBlur(
                    IUserKeys.allowNewsletter,
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
            IUserKeys.allowNewsletter,
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

const contentDivSpacerStyle: React.CSSProperties = {
    flex: 1
}
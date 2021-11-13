import * as React from 'react';

import { Checkbox, Typography } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import { CustomTheme, grid1Style, linkMsgTypographyStyle } from '../../constants/theme';
import ErrorMessageTypography from '../form_elements/ErrorMessageTypography';

export enum ILegalInformationConsentCheckBoxKeys {
    LegalInformationConsent = "legalInformationConsent"
}

interface ILegalInformationConsentCheckboxProps {
    checked: boolean;
    errorMessage: string | null;
    onError: (key: ILegalInformationConsentCheckBoxKeys.LegalInformationConsent, value: string) => void;
    onForwardToLegalInformation: () => void;
    onUpdateValue: (key: ILegalInformationConsentCheckBoxKeys.LegalInformationConsent, value: boolean) => void;
    showErrorMessageOnLoad?: boolean; // default: true
    style?: React.CSSProperties;
}

interface ILegalInformationConsentCheckboxState {
    showErrorMessage: boolean;
}

export default class LegalInformationConsentCheckbox 
    extends React.Component<ILegalInformationConsentCheckboxProps, ILegalInformationConsentCheckboxState> {

    public static LOCAL_ERROR_MESSAGE: string = Dict.legal_notice_consent_required;
    
    private contentDivStyle: React.CSSProperties = {
        ...this.props.style,
        alignItems: "center",
        display: "flex"
    };
    private checkboxStyle: React.CSSProperties = {
        color: CustomTheme.COLOR_WHITE
    }
    private legalNoticeTypographyStyle: React.CSSProperties = {
        color: CustomTheme.COLOR_WHITE
    };

    constructor(props: ILegalInformationConsentCheckboxProps) {
        super(props);

        this.state = {
            showErrorMessage: props.showErrorMessageOnLoad === undefined || props.showErrorMessageOnLoad
        };
    }

    public render(): React.ReactNode {
        return (
            <>
                <div style={this.contentDivStyle}>
                    <Checkbox
                        checked={this.props.checked}
                        color="primary"
                        name={ILegalInformationConsentCheckBoxKeys.LegalInformationConsent}
                        onChange={this.onChange}
                        style={this.checkboxStyle}
                    />
                    <div style={grid1Style} />
                    <Typography style={this.legalNoticeTypographyStyle}>
                        {Dict.legal_notice_consent_paragraph_prefix}
                        <span onClick={this.props.onForwardToLegalInformation} style={linkMsgTypographyStyle}>
                            {Dict.legal_notice_heading}
                        </span>
                        {Dict.legal_notice_consent_paragraph_suffix}
                    </Typography>
                </div>
                <ErrorMessageTypography value={this.state.showErrorMessage ? this.props.errorMessage : null} />
            </>
        );
    }

    public componentDidMount() {
        this.validate();
    }

    public shouldComponentUpdate(nextProps: ILegalInformationConsentCheckboxProps, nextState: ILegalInformationConsentCheckboxState, nextContext: any): boolean {
        return this.props.checked !== nextProps.checked
            || this.props.errorMessage !== nextProps.errorMessage;
    }

    public componentDidUpdate(prevProps: ILegalInformationConsentCheckboxProps, prevState: ILegalInformationConsentCheckboxState): void {
        this.validate();

        if (!this.state.showErrorMessage) {
            this.setState({
                ...prevState,
                showErrorMessage: true
            });
        }
    }

    private onChange = (event: any): void => {
        this.props.onUpdateValue(
            ILegalInformationConsentCheckBoxKeys.LegalInformationConsent,
            event.target.checked
        );
    }

    public validate = (): void => {
        this.props.onError(
            ILegalInformationConsentCheckBoxKeys.LegalInformationConsent,
            this.props.checked ?
                null : LegalInformationConsentCheckbox.LOCAL_ERROR_MESSAGE
        );
    }

}
import * as React from "react";

import { Checkbox, Typography } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import {
    CustomTheme,
    grid1Style,
    linkMsgTypographyStyle,
} from "../../constants/theme";
import ErrorMessageTypography from "../form_elements/ErrorMessageTypography";

export enum ILegalInformationConsentCheckBoxKeys {
    LegalInformationConsent = "legalInformationConsent",
}

interface ILegalInformationConsentCheckboxProps {
    checked: boolean;
    errorMessage: string | null;
    onError: (
        key: ILegalInformationConsentCheckBoxKeys.LegalInformationConsent,
        value: string
    ) => void;
    onForwardToLegalInformation: () => void;
    onUpdateValue: (
        key: ILegalInformationConsentCheckBoxKeys.LegalInformationConsent,
        value: boolean
    ) => void;
    suppressErrorMsg?: boolean;
    style?: React.CSSProperties;
}

export const LEGAL_INFORMATION_CONSENT_CHECKBOX_LOCAL_ERROR_MESSAGE: string = Dict.legal_notice_consent_required;

const LegalInformationConsentCheckbox = (
    props: ILegalInformationConsentCheckboxProps
) => {
    const {
        checked,
        errorMessage,
        onError,
        onForwardToLegalInformation,
        onUpdateValue,
        suppressErrorMsg,
        style,
    } = props;

    const onChange = React.useCallback((event: any): void => {
        onUpdateValue(
            ILegalInformationConsentCheckBoxKeys.LegalInformationConsent,
            event.target.checked
        );
    }, [onUpdateValue]);

    React.useEffect(() => {
        onError(
            ILegalInformationConsentCheckBoxKeys.LegalInformationConsent,
            checked ? null : LEGAL_INFORMATION_CONSENT_CHECKBOX_LOCAL_ERROR_MESSAGE
        );
    }, [checked, onError]);

    return (
        <>
            <div
                style={{
                    ...style,
                    alignItems: "center",
                    display: "flex",
                }}
            >
                <Checkbox
                    checked={checked}
                    color="primary"
                    name={
                        ILegalInformationConsentCheckBoxKeys.LegalInformationConsent
                    }
                    onChange={onChange}
                    style={{
                        color: CustomTheme.COLOR_WHITE,
                    }}
                />
                <div style={grid1Style} />
                <Typography
                    style={{
                        color: CustomTheme.COLOR_WHITE,
                    }}
                >
                    {Dict.legal_notice_consent_paragraph_prefix}
                    <span
                        onClick={onForwardToLegalInformation}
                        style={linkMsgTypographyStyle}
                    >
                        {Dict.legal_notice_heading}
                    </span>
                    {Dict.legal_notice_consent_paragraph_suffix}
                </Typography>
            </div>
            <ErrorMessageTypography
                value={suppressErrorMsg ? null : errorMessage}
            />
        </>
    );
};

export default LegalInformationConsentCheckbox;

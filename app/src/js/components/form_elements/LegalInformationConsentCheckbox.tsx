import * as React from "react";

import { Checkbox, Typography } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import {
    CustomTheme,
    grid1Style,
    linkMsgTypographyStyle,
} from "../../constants/theme";
import ErrorMessageTypography from "../form_elements/ErrorMessageTypography";
import { useState } from "react";
import { useEffect } from "react";

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
    showErrorMessageOnLoad?: boolean; // default: true
    style?: React.CSSProperties;
}

const LegalInformationConsentCheckbox = (
    props: ILegalInformationConsentCheckboxProps
) => {
    const LOCAL_ERROR_MESSAGE: string = Dict.legal_notice_consent_required;

    const {
        checked,
        errorMessage,
        onError,
        onForwardToLegalInformation,
        onUpdateValue,
        showErrorMessageOnLoad,
        style,
    } = props;
    const [showErrorMessage, setShowErrorMessage] = useState(
        showErrorMessageOnLoad === undefined || showErrorMessageOnLoad
    );

    const onChange = (event: any): void => {
        onUpdateValue(
            ILegalInformationConsentCheckBoxKeys.LegalInformationConsent,
            event.target.checked
        );
    };

    useEffect(() => {
        onError(
            ILegalInformationConsentCheckBoxKeys.LegalInformationConsent,
            checked ? null : LOCAL_ERROR_MESSAGE
        );

        if (!showErrorMessage) {
            setShowErrorMessage(true);
        }
    }, [checked, LOCAL_ERROR_MESSAGE, onError, showErrorMessage]);

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
                value={showErrorMessage ? errorMessage : null}
            />
        </>
    );
};

export default LegalInformationConsentCheckbox;

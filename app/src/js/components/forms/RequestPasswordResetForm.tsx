import * as React from 'react';

import { Typography, withTheme, WithTheme } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import {
    grid1Style, grid6Style, successMsgTypographyStyle, ThemeTypes
} from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';
import {
    RequestPasswordResetRequest
} from '../../networking/account_data/RequestPasswordResetRequest';
import { IResponse } from '../../networking/Request';
import EMailAddressInput, { E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGE } from '../form_elements/EMailAddressInput';
import SubmitButton from '../form_elements/SubmitButton';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';
import { showNotification } from '../utilities/Notifier';
import { useEffect, useRef, useState } from 'react';

type IRequestPasswordResetFormProps = WithTheme;

type IFormKeys = IUserKeys.eMailAddress;

interface IForm {
    [IUserKeys.eMailAddress]: string;
}

interface IFormError {
    [IUserKeys.eMailAddress]: string | null;
}

const RequestPasswordResetForm = (props: IRequestPasswordResetFormProps) => {
    const { theme } = props;

    const [form, setForm] = useState<IForm>({
        [IUserKeys.eMailAddress]: ""
    });
    const [formError, setFormError] = useState<IForm>({
        [IUserKeys.eMailAddress]: null
    });
    const [successMsg, setSuccessMsg] = useState<string>();
    const requestPasswordResetRequest = useRef<RequestPasswordResetRequest>();
    

    const accountPasswortResetTypographyStyle: React.CSSProperties = {
        color: "#ffffff",
        display: "inline-block",
        marginBottom: 3 * theme.spacing(),
        textAlign: "center"
    };
    const marginTopStyle: React.CSSProperties = {
        marginTop: 2 * theme.spacing()
    };

    const updateForm = (key: IFormKeys, value: string): void => {
        setForm((form: IForm) => {
            form[key] = value;
            return form;
        });
    }
    const updateFormError = (key: IFormKeys, value: string | null): void => {
        setFormError((formError: IFormError) => {
            formError[key] = value;
            return formError;
        });
    }
    const sendRequest = (): void => {
        if (formError[IUserKeys.eMailAddress] === E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGE) {
            return;
        }

        requestPasswordResetRequest.current = new RequestPasswordResetRequest(
            form[IUserKeys.eMailAddress],
            (response: IResponse) => {
                const errorMsg = response.errorMsg;
                const successMsg = response.successMsg;

                if (errorMsg) {
                    if (errorMsg.indexOf(IUserKeys.eMailAddress) > -1) {
                        updateFormError(IUserKeys.eMailAddress, Dict[errorMsg] ?? errorMsg);
                    } else {
                        showNotification(errorMsg);
                    }
                } else if (successMsg) {
                    setSuccessMsg(Dict[successMsg] ?? successMsg);
                }

                requestPasswordResetRequest.current = null;
            },
            (error: any) => {
                showNotification(Dict.error_message_timeout);
                requestPasswordResetRequest.current = null;
            }
        );
        requestPasswordResetRequest.current.execute();
    }

    useEffect(() => {
        return () => {
            if (requestPasswordResetRequest.current) {
                requestPasswordResetRequest.current.cancel();
            }
        }
    }, []);

    const showRequestGrid = (): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography
                    variant="h5"
                    style={accountPasswortResetTypographyStyle}>
                    <span>{Dict.navigation_request_password_reset}</span>
                </Typography>

                <EMailAddressInput
                    errorMessage={formError[IUserKeys.eMailAddress]}
                    onError={updateFormError}
                    onUpdateValue={updateForm}
                    showErrorMessageOnLoad={false}
                    themeType={ThemeTypes.LIGHT}
                    value={form[IUserKeys.eMailAddress]}
                />

                <SubmitButton
                    disabled={requestPasswordResetRequest.current !== null}
                    onClick={sendRequest}
                    style={marginTopStyle}
                />
            </Grid>
        );
    }
    const showResponseGrid = (): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography
                    variant="h5"
                    style={successMsgTypographyStyle}>
                    <span>{successMsg}</span>
                </Typography>
            </Grid>
        );
    }
    return (
        <Grid>
            <GridItem
                style={grid6Style}>
                {successMsg ? showResponseGrid() : showRequestGrid()}
            </GridItem>
            <GridItem style={grid1Style}>
            </GridItem>
        </Grid>
    );
}

export default withTheme(RequestPasswordResetForm);

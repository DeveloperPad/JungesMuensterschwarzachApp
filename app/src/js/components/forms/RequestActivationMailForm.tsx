import * as React from 'react';

import { Typography, withTheme, WithTheme } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import {
    grid1Style, grid6Style, successMsgTypographyStyle, ThemeTypes
} from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';
import {
    RequestActivationMailRequest
} from '../../networking/account_data/RequestActivationMailRequest';
import { IResponse } from '../../networking/Request';
import EMailAddressInput, { E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGE } from '../form_elements/EMailAddressInput';
import SubmitButton from '../form_elements/SubmitButton';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';
import { showNotification } from '../utilities/Notifier';
import { useEffect, useRef, useState } from 'react';

type IRequestActivationMailFormProps = WithTheme;

type IFormKeys = IUserKeys.eMailAddress;

interface IForm {
    [IUserKeys.eMailAddress]: string;
}

interface IFormError {
    [IUserKeys.eMailAddress]: string | null;
}

const RequestActivationMailForm = (props: IRequestActivationMailFormProps) => {
    const { theme } = props;
    const [form, setForm] = useState<IForm>({
        [IUserKeys.eMailAddress]: ""
    });
    const [formError, setFormError] = useState<IFormError>({
        [IUserKeys.eMailAddress]: null
    });
    const [successMsg, setSuccessMsg] = useState<string>();
    const requestActivationMailRequest = useRef<RequestActivationMailRequest>();

    const marginTopStyle: React.CSSProperties = {
        marginTop: 2 * theme.spacing()
    };
    const accountActivationMailTypographyStyle: React.CSSProperties = {
        color: "#ffffff",
        display: "inline-block",
        marginBottom: 3 * theme.spacing(),
        textAlign: "center"
    };

    const updateForm = (key: IFormKeys, value: string): void => {
        setForm(form => {
            form[key] = value;
            return form;
        });
    }
    const updateFormError = (key: IFormKeys, value: string | null): void => {
        setFormError(formError => {
            formError[key] = value;
            return formError;
        });
    }
    const sendRequest = (): void => {
        if (formError[IUserKeys.eMailAddress] === E_MAIL_ADDRESS_INPUT_LOCAL_ERROR_MESSAGE) {
            return;
        }

        requestActivationMailRequest.current = new RequestActivationMailRequest(
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

                requestActivationMailRequest.current = null;
            },
            (error: any) => {
                showNotification(Dict.error_message_timeout);
                requestActivationMailRequest.current = null;
            }
        );
        requestActivationMailRequest.current.execute();
    }

    useEffect(() => {
        return () => {
            if (requestActivationMailRequest.current) {
                requestActivationMailRequest.current.cancel();
            }
        };
    }, []);

    const showRequestGrid = (): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography
                    variant="h5"
                    style={accountActivationMailTypographyStyle}>
                    <span>{Dict.navigation_request_activation_link}</span>
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
                    disabled={requestActivationMailRequest.current !== null}
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

export default withTheme(RequestActivationMailForm);

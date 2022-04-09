import * as React from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Typography, withTheme, WithTheme } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import { AppUrls } from '../../constants/specific-urls';
import {
    grid1Style, grid6Style, successMsgTypographyStyle, ThemeTypes
} from '../../constants/theme';
import { TokenRedemptionRequest } from '../../networking/account_data/TokenRedemptionRequest';
import { IResponse } from '../../networking/Request';
import SubmitButton from '../form_elements/SubmitButton';
import TokenInput, { ITokenInputKeys } from '../form_elements/TokenInput';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';
import { showNotification } from '../utilities/Notifier';
import { useEffect, useRef, useState } from 'react';

type ITokenRedemptionFormProps = WithTheme;

type IFormKeys = ITokenInputKeys.tokenCode;

interface IForm {
    [ITokenInputKeys.tokenCode]: string;
}

interface IFormError {
    [ITokenInputKeys.tokenCode]: string | null;
}

const TokenRedemptionForm = (props: ITokenRedemptionFormProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = props;
    const getTokenCode = (): string => {
        return decodeURI(location.pathname.slice((AppUrls.HELP_REDEEM_TOKEN + "/").length));
    }
    const [form, setForm] = useState<IForm>({
        [ITokenInputKeys.tokenCode]: getTokenCode()
    });
    const [formError, setFormError] = useState<IFormError>({
        [ITokenInputKeys.tokenCode]: null
    })
    const [successMsg, setSuccessMsg] = useState<string>();
    const tokenRedemptionRequest = useRef<TokenRedemptionRequest>();

    const redeemTokenTypographyStyle: React.CSSProperties = {
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
    const updateFormError = (key: IFormKeys, value: string): void => {
        setFormError((formError: IFormError) => {
            formError[key] = value;
            return formError;
        });
    }
    const sendRequest = (): void => {
        tokenRedemptionRequest.current = new TokenRedemptionRequest(
            form[ITokenInputKeys.tokenCode],
            (response: IResponse) => {
                const errorMsg = response.errorMsg;
                const successMsg = response.successMsg;

                if (errorMsg) {
                    if (errorMsg.indexOf("token") > -1 || errorMsg.indexOf("account") > -1) {
                        updateFormError(ITokenInputKeys.tokenCode, Dict[errorMsg] ?? errorMsg);
                    } else {
                        showNotification(errorMsg);
                    }
                } else if (successMsg) {
                    if (successMsg === "account_password_new") {
                        navigate(AppUrls.HELP_REDEEM_TOKEN_RESET_PASSWORD + "/" + encodeURI(form[ITokenInputKeys.tokenCode]));
                    } else {
                        setSuccessMsg(Dict[successMsg] ?? successMsg);
                    }
                }

                tokenRedemptionRequest.current = null;
            },
            (error: any) => {
                showNotification(Dict.error_message_timeout);
                tokenRedemptionRequest.current = null;
            }
        );
        tokenRedemptionRequest.current.execute();
    }

    useEffect(() => {
        if (form[ITokenInputKeys.tokenCode] 
            && form[ITokenInputKeys.tokenCode].trim().length > 0) {
            sendRequest();
        }

        return () => {
            if (tokenRedemptionRequest.current) {
                tokenRedemptionRequest.current.cancel();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showRequestGrid = (): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography
                    variant="h5"
                    style={redeemTokenTypographyStyle}>
                    <span>{Dict.navigation_redeem_token}</span>
                </Typography>

                <TokenInput
                    errorMessage={formError[ITokenInputKeys.tokenCode]}
                    onUpdateValue={updateForm}
                    themeType={ThemeTypes.LIGHT}
                    value={form[ITokenInputKeys.tokenCode]}
                />

                <SubmitButton
                    disabled={tokenRedemptionRequest.current !== null}
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

export default withTheme(TokenRedemptionForm);

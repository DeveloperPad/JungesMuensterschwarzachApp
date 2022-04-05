import * as React from 'react';

import { Typography, withTheme, WithTheme } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import { AppUrls } from '../../constants/specific-urls';
import {
    grid1Style, grid6Style, successMsgTypographyStyle, ThemeTypes
} from '../../constants/theme';
import { NewsletterRedemptionRequest } from '../../networking/newsletter/NewsletterRedemptionRequest';
import { IResponse } from '../../networking/Request';
import SubmitButton from '../form_elements/SubmitButton';
import TokenInput, { ITokenInputKeys } from '../form_elements/TokenInput';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';
import { showNotification } from '../utilities/Notifier';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

type INewsletterRedemptionFormProps = WithTheme;

type IFormKeys = ITokenInputKeys.tokenCode;

interface IForm {
    [ITokenInputKeys.tokenCode]: string;
}

interface IFormError {
    [ITokenInputKeys.tokenCode]: string | null;
}

const NewsletterRedemptionForm = (props: INewsletterRedemptionFormProps) => {
    const { theme } = props;
    const location = useLocation();
    const [successMsg, setSuccessMsg] = useState<string>();
    const [form, setForm] = useState<IForm>({
        [ITokenInputKeys.tokenCode]: decodeURI(location.pathname.slice(
            (AppUrls.HELP_NEWSLETTER_REDEEM + "/").length
        ))
    });
    const [formError, setFormError] = useState<IFormError>({
        [ITokenInputKeys.tokenCode]: null
    });
    const redemptionRequest = useRef<NewsletterRedemptionRequest>();

    const typographyStyle: React.CSSProperties = {
        color: "#ffffff",
        display: "inline-block",
        marginBottom: 3 * theme.spacing(),
        textAlign: "center"
    };
    const marginTopStyle: React.CSSProperties = {
        marginTop: 2 * theme.spacing()
    };

    const updateForm = (key: IFormKeys, value: string): void => {
        setForm(form => {
            form[key] = value;
            return form;
        });
    }
    const updateFormError = (key: IFormKeys, value: string): void => {
        setFormError(form => {
            form[key] = value;
            return form;
        });
    }
    const sendRequest = (): void => {
        redemptionRequest.current = new NewsletterRedemptionRequest(
            form[ITokenInputKeys.tokenCode],
            (response: IResponse) => {
                const errorMsg = response.errorMsg;
                const successMsg = response.successMsg;

                if (errorMsg) {
                    if (errorMsg.indexOf("token") > -1) {
                        updateFormError(
                            ITokenInputKeys.tokenCode,
                            Dict[errorMsg] ?? errorMsg
                        );
                    } else {
                        showNotification(errorMsg);
                    }
                } else if (successMsg) {
                    setSuccessMsg(Dict[successMsg] ?? successMsg);
                }


                redemptionRequest.current = null;
            },
            (error: any) => {
                showNotification(Dict.error_message_timeout);
                redemptionRequest.current = null;
            }
        );
        redemptionRequest.current.execute();
    }

    useEffect(() => {
        if (form[ITokenInputKeys.tokenCode] 
            && form[ITokenInputKeys.tokenCode].trim().length > 0) {
            sendRequest();
        }

        return () => {
            if (redemptionRequest.current) {
                redemptionRequest.current.cancel();
            }
        };
    }, []);

    const showRequestGrid = (): React.ReactElement<any> => {
        return (
            <Grid>
                <Typography
                    variant="h5"
                    style={typographyStyle}>
                    <span>{Dict.navigation_redeem_token}</span>
                </Typography>

                <TokenInput
                    errorMessage={formError[ITokenInputKeys.tokenCode]}
                    onUpdateValue={updateForm}
                    themeType={ThemeTypes.LIGHT}
                    value={form[ITokenInputKeys.tokenCode]}
                />

                <SubmitButton
                    disabled={redemptionRequest.current !== null}
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

export default withTheme(NewsletterRedemptionForm);
import log, * as logger from 'loglevel';
import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import {
    Accordion, AccordionDetails, AccordionSummary, Button, Card, CardContent, CardHeader, Dialog,
    DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, Typography, withTheme,
    WithTheme
} from '@material-ui/core';

import Dict from '../../constants/dict';
import Formats from '../../constants/formats';
import { getDate } from '../../constants/global-functions';
import { LogTags } from '../../constants/log-tags';
import { AppUrls } from '../../constants/specific-urls';
import {
    gridHorizontalStyle, markerAccountRequirementsStyle, markerEventRequirementsStyle,
    markerRequirementsLeftMarginStyle
} from '../../constants/theme';
import { DeleteAccountDataRequest } from '../../networking/account_data/DeleteAccountDataRequest';
import {
    FetchAccountDataRequest, IFetchAccountDataResponse
} from '../../networking/account_data/FetchAccountDataRequest';
import IUser, { IUserKeys } from '../../networking/account_data/IUser';
import { UpdateAccountDataRequest } from '../../networking/account_data/UpdateAccountDataRequest';
import INotice from '../../networking/INotice';
import { IResponse } from '../../networking/Request';
import { CookieService } from '../../services/CookieService';
import AccessIdentifierInput from '../form_elements/AccessIdentifierInput';
import AllowNewsletterCheckbox from '../form_elements/AllowNewsletterCheckbox';
import AllowPostCheckbox from '../form_elements/AllowPostCheckbox';
import BirthdateInput from '../form_elements/BirthdateInput';
import CityInput from '../form_elements/CityInput';
import CountryInput from '../form_elements/CountryInput';
import DeleteButton from '../form_elements/DeleteButton';
import DisplayNameInput from '../form_elements/DisplayNameInput';
import EatingHabitsInput from '../form_elements/EatingHabitsInput';
import EMailAddressInput from '../form_elements/EMailAddressInput';
import FirstNameInput from '../form_elements/FirstNameInput';
import ForwardButton from '../form_elements/ForwardButton';
import HouseNumberInput from '../form_elements/HouseNumberInput';
import LastNameInput from '../form_elements/LastNameInput';
import PhoneNumberInput from '../form_elements/PhoneNumberInput';
import StreetNameInput from '../form_elements/StreetNameInput';
import SupplementaryAddressInput from '../form_elements/SupplementaryAddressInput';
import ZipCodeInput from '../form_elements/ZipCodeInput';
import Grid from '../utilities/Grid';
import { showNotification } from '../utilities/Notifier';

type IProfileFormProps = RouteComponentProps<any, StaticContext> & WithTheme;

interface IProfileFormState {
    fetchAccountDataRequest: FetchAccountDataRequest | null;
    updateAccountDataRequest: UpdateAccountDataRequest | null;
    deleteAccountDataRequest: DeleteAccountDataRequest | null;
    fetchedForm: IForm | null;
    form: IForm;
    formError: IFormError;
    notice: INotice | null;
    showDeletionConfirmationDialog: boolean;
}

type IFormKeys =
    IUserKeys.accessIdentifier |
    IUserKeys.allowNewsletter |
    IUserKeys.allowPost |
    IUserKeys.birthdate |
    IUserKeys.city |
    IUserKeys.country |
    IUserKeys.displayName |
    IUserKeys.eMailAddress |
    IUserKeys.eatingHabits |
    IUserKeys.firstName |
    IUserKeys.houseNumber |
    IUserKeys.supplementaryAddress |
    IUserKeys.lastName |
    IUserKeys.phoneNumber |
    IUserKeys.streetName |
    IUserKeys.zipCode;
type IFormValues = string | number | Date;

interface IForm {
    [IUserKeys.accessIdentifier]: string,
    [IUserKeys.allowNewsletter]: number;
    [IUserKeys.allowPost]: number;
    [IUserKeys.birthdate]: Date;
    [IUserKeys.city]: string;
    [IUserKeys.country]: string;
    [IUserKeys.displayName]: string;
    [IUserKeys.eMailAddress]: string;
    [IUserKeys.eatingHabits]: string;
    [IUserKeys.firstName]: string;
    [IUserKeys.houseNumber]: string;
    [IUserKeys.supplementaryAddress]: string;
    [IUserKeys.lastName]: string;
    [IUserKeys.phoneNumber]: string;
    [IUserKeys.streetName]: string;
    [IUserKeys.zipCode]: string;
}

interface IFormError {
    [IUserKeys.accessIdentifier]: string | null;
    [IUserKeys.allowNewsletter]: string | null;
    [IUserKeys.allowPost]: string | null;
    [IUserKeys.birthdate]: string | null;
    [IUserKeys.city]: string | null;
    [IUserKeys.country]: string | null;
    [IUserKeys.displayName]: string | null;
    [IUserKeys.eMailAddress]: string | null;
    [IUserKeys.eatingHabits]: string | null;
    [IUserKeys.firstName]: string | null;
    [IUserKeys.houseNumber]: string | null;
    [IUserKeys.supplementaryAddress]: string | null;
    [IUserKeys.lastName]: string | null;
    [IUserKeys.phoneNumber]: string | null;
    [IUserKeys.streetName]: string | null;
    [IUserKeys.zipCode]: string | null;
}

class ProfileForm extends React.PureComponent<IProfileFormProps, IProfileFormState> {

    private expansionPanelDetailsStyle: React.CSSProperties = {
        flexDirection: "column"
    };
    private expansionPanelDetailsInnerStyle: React.CSSProperties = {
        marginLeft: this.props.theme.spacing(),
        marginRight: this.props.theme.spacing(),
        paddingTop: this.props.theme.spacing()
    };
    private separatorStyle: React.CSSProperties = {
        height: this.props.theme.spacing(2)
    };

    constructor(props: IProfileFormProps) {
        super(props);

        this.state = {
            fetchAccountDataRequest: null,
            updateAccountDataRequest: null,
            deleteAccountDataRequest: null,
            fetchedForm: null,
            form: this.emptyForm(),
            formError: this.emptyFormError(),
            notice: {
                message: Dict.label_wait,
                type: Dict.label_loading
            },
            showDeletionConfirmationDialog: false
        }
    }

    public componentDidMount() {
        CookieService.get<number>(IUserKeys.userId)
            .then(userId => {
                if (userId === null) {
                    log.error(LogTags.AUTHENTICATION + Dict.error_message_account_required);
                    this.props.history.push(AppUrls.HOME);
                } else {
                    this.fetchAccountData();
                }
            })
            .catch(error => {
                log.error(LogTags.STORAGE_MANAGER + "Could not load userId: " + error);
                this.props.history.push(AppUrls.HOME);
            });
    }

    public componentDidUpdate(prevProps: IProfileFormProps, prevState: IProfileFormState): void {
        if (this.state.fetchAccountDataRequest) {
            this.state.fetchAccountDataRequest.execute();
        }

        if (this.state.updateAccountDataRequest) {
            this.state.updateAccountDataRequest.execute();
        }

        if (this.state.deleteAccountDataRequest) {
            this.state.deleteAccountDataRequest.execute();
        }
    }

    public componentWillUnmount(): void {
        if (this.state.fetchAccountDataRequest) {
            this.state.fetchAccountDataRequest.cancel();
        }

        if (this.state.updateAccountDataRequest) {
            this.state.updateAccountDataRequest.cancel();
        }

        if (this.state.deleteAccountDataRequest) {
            this.state.deleteAccountDataRequest.cancel();
        }
    }

    public updateForm = (key: IFormKeys, value: IFormValues): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                form: {
                    ...prevState.form,
                    [key]: value
                }
            };
        });
    }

    public updateFormError = (key: IFormKeys, value: string | null): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                formError: {
                    ...prevState.formError,
                    [key]: value
                }
            }
        })
    }

    public render(): React.ReactNode {
        return (
            this.state.notice ? this.showNotice() : this.showContent()
        );
    }

    private showNotice = (): React.ReactNode => {
        const { message, type } = this.state.notice!;

        return (
            <Card>
                <CardHeader title={Dict.hasOwnProperty(type) ? Dict[type] : type} />
                <CardContent>
                    <Typography>{Dict.hasOwnProperty(message) ? Dict[message] : message}</Typography>
                </CardContent>
            </Card>
        );
    }

    private showContent = (): React.ReactNode => {
        return (
            <>
                <Accordion
                    expanded={true}>
                    <AccordionSummary>
                        <Typography
                            color="textSecondary"
                            variant="h5">
                            {Dict.label_legend}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        style={this.expansionPanelDetailsStyle}>
                        <div style={this.expansionPanelDetailsInnerStyle}>
                            <Grid style={legendGridStyle}>
                                <Typography style={accountMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                                <Typography style={markerRequirementsLeftMarginStyle}>
                                    {Dict.account_credentials_signUp}
                                </Typography>
                            </Grid>
                            {this.separator()}
                            <Grid style={legendGridStyle}>
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                                <Typography style={markerRequirementsLeftMarginStyle}>
                                    {Dict.account_credentials_event}
                                </Typography>
                            </Grid>
                        </div>
                    </AccordionDetails>
                </Accordion >

                <Accordion
                    defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<Icon>keyboard_arrow_down</Icon>}>
                        <Typography
                            color="textSecondary"
                            variant="h5">
                            {Dict.account_data_account}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        style={this.expansionPanelDetailsStyle}>
                        <div style={this.expansionPanelDetailsInnerStyle}>
                            <AccessIdentifierInput
                                value={this.state.form[IUserKeys.accessIdentifier]}
                            />
                            {this.separator()}
                            <Grid
                                style={gridHorizontalStyle}
                            >
                                <EMailAddressInput
                                    errorMessage={this.state.formError[IUserKeys.eMailAddress]}
                                    onError={this.updateFormError}
                                    onUpdateValue={this.updateForm}
                                    onBlur={this.updateAccountData}
                                    value={this.state.form[IUserKeys.eMailAddress]}
                                />
                                <Typography style={accountMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {this.separator()}
                            <DisplayNameInput
                                errorMessage={this.state.formError[IUserKeys.displayName]}
                                onError={this.updateFormError}
                                onUpdateValue={this.updateForm}
                                onBlur={this.updateAccountData}
                                value={this.state.form[IUserKeys.displayName]}
                            />
                            {this.separator()}
                            <div style={textCenterStyle}>
                                <ForwardButton
                                    forwardTo={AppUrls.PROFILE_CHANGE_PASSWORD}
                                    label={Dict.account_password_new}
                                />
                                {this.separator()}
                                <DeleteButton
                                    label={Dict.account_deletion}
                                    onClick={this.showDeletionConfirmationDialog.bind(this, true)}
                                />
                            </div>

                        </div>
                    </AccordionDetails>
                </Accordion >

                <Accordion
                    defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<Icon>keyboard_arrow_down</Icon>}>
                        <Typography
                            color="textSecondary"
                            variant="h5">
                            {Dict.account_data_contact}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        style={this.expansionPanelDetailsStyle}>
                        <div style={this.expansionPanelDetailsInnerStyle}>
                            <Grid
                                style={gridHorizontalStyle}
                            >
                                <FirstNameInput
                                    errorMessage={this.state.formError[IUserKeys.firstName]}
                                    onError={this.updateFormError}
                                    onUpdateValue={this.updateForm}
                                    onBlur={this.updateAccountData}
                                    value={this.state.form[IUserKeys.firstName]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {this.separator()}
                            <Grid
                                style={gridHorizontalStyle}
                            >
                                <LastNameInput
                                    errorMessage={this.state.formError[IUserKeys.lastName]}
                                    onError={this.updateFormError}
                                    onUpdateValue={this.updateForm}
                                    onBlur={this.updateAccountData}
                                    value={this.state.form[IUserKeys.lastName]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {this.separator()}
                            <Grid
                                style={gridHorizontalStyle}
                            >
                                <StreetNameInput
                                    errorMessage={this.state.formError[IUserKeys.streetName]}
                                    onError={this.updateFormError}
                                    onUpdateValue={this.updateForm}
                                    onBlur={this.updateAccountData}
                                    value={this.state.form[IUserKeys.streetName]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {this.separator()}
                            <Grid
                                style={gridHorizontalStyle}
                            >
                                <HouseNumberInput
                                    errorMessage={this.state.formError[IUserKeys.houseNumber]}
                                    onError={this.updateFormError}
                                    onUpdateValue={this.updateForm}
                                    onBlur={this.updateAccountData}
                                    value={this.state.form[IUserKeys.houseNumber]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {this.separator()}
                            <Grid
                                style={gridHorizontalStyle}
                            >
                                <SupplementaryAddressInput
                                    errorMessage={this.state.formError[IUserKeys.supplementaryAddress]}
                                    onError={this.updateFormError}
                                    onUpdateValue={this.updateForm}
                                    onBlur={this.updateAccountData}
                                    value={this.state.form[IUserKeys.supplementaryAddress]}
                                />
                            </Grid>
                            {this.separator()}
                            <Grid
                                style={gridHorizontalStyle}
                            >
                                <ZipCodeInput
                                    errorMessage={this.state.formError[IUserKeys.zipCode]}
                                    onError={this.updateFormError}
                                    onUpdateValue={this.updateForm}
                                    onBlur={this.updateAccountData}
                                    value={this.state.form[IUserKeys.zipCode]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {this.separator()}
                            <Grid
                                style={gridHorizontalStyle}
                            >
                                <CityInput
                                    errorMessage={this.state.formError[IUserKeys.city]}
                                    onError={this.updateFormError}
                                    onUpdateValue={this.updateForm}
                                    onBlur={this.updateAccountData}
                                    value={this.state.form[IUserKeys.city]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {this.separator()}
                            <Grid
                                style={gridHorizontalStyle}
                            >
                                <CountryInput
                                    errorMessage={this.state.formError[IUserKeys.country]}
                                    onError={this.updateFormError}
                                    onUpdateValue={this.updateForm}
                                    onBlur={this.updateAccountData}
                                    value={this.state.form[IUserKeys.country]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {this.separator()}
                            <AllowPostCheckbox
                                checked={this.state.form[IUserKeys.allowPost] === 1}
                                errorMessage={this.state.formError[IUserKeys.allowPost]}
                                onUpdateValue={this.updateForm}
                                onBlur={this.updateAccountData}
                            />
                            {this.separator()}
                            <AllowNewsletterCheckbox
                                checked={this.state.form[IUserKeys.allowNewsletter] === 1}
                                errorMessage={this.state.formError[IUserKeys.allowNewsletter]}
                                onUpdateValue={this.updateForm}
                                onBlur={this.updateAccountData}
                            />
                            {this.separator()}
                            <Grid
                                style={gridHorizontalStyle}
                            >
                                <EMailAddressInput
                                    disabled={true}
                                    errorMessage={this.state.formError[IUserKeys.eMailAddress]}
                                    onError={this.updateFormError}
                                    onUpdateValue={this.updateForm}
                                    onBlur={this.updateAccountData}
                                    value={this.state.form[IUserKeys.eMailAddress]}
                                />
                                <Typography style={accountMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {this.separator()}
                            <Grid
                                style={gridHorizontalStyle}
                            >
                                <PhoneNumberInput
                                    errorMessage={this.state.formError[IUserKeys.phoneNumber]}
                                    onError={this.updateFormError}
                                    onUpdateValue={this.updateForm}
                                    onBlur={this.updateAccountData}
                                    value={this.state.form[IUserKeys.phoneNumber]}
                                />
                            </Grid>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion
                    defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<Icon>keyboard_arrow_down</Icon>}>
                        <Typography
                            color="textSecondary"
                            variant="h5">
                            {Dict.account_data_event}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        style={this.expansionPanelDetailsStyle}>
                        <div style={this.expansionPanelDetailsInnerStyle}>
                            <Grid
                                style={gridHorizontalStyle}
                            >
                                <BirthdateInput
                                    errorMessage={this.state.formError[IUserKeys.birthdate]}
                                    onError={this.updateFormError}
                                    onUpdateValue={this.updateForm}
                                    onBlur={this.updateAccountData}
                                    value={this.state.form[IUserKeys.birthdate]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {this.separator()}
                            <Grid
                                style={gridHorizontalStyle}
                            >
                                <EatingHabitsInput
                                    errorMessage={this.state.formError[IUserKeys.eatingHabits]}
                                    onError={this.updateFormError}
                                    onUpdateValue={this.updateForm}
                                    onBlur={this.updateAccountData}
                                    value={this.state.form[IUserKeys.eatingHabits]}
                                />
                            </Grid>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Dialog
                    onClose={this.showDeletionConfirmationDialog.bind(this, false)}
                    open={this.state.showDeletionConfirmationDialog}
                    style={preWrapStyle}
                >
                    <DialogTitle>{Dict.account_deletion_confirmation_title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText style={preWrapStyle}>
                            {Dict.account_deletion_confirmation_message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.showDeletionConfirmationDialog.bind(this, false)} color="primary">{Dict.label_cancel}</Button>
                        <Button onClick={this.deleteAccountData} color="primary">{Dict.label_confirm}</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    private separator = (): React.ReactNode => {
        return (
            <div style={this.separatorStyle} />
        );
    }

    private emptyForm = (): IForm => {
        return {
            [IUserKeys.accessIdentifier]: Dict.account_accessLevel_guest,
            [IUserKeys.allowNewsletter]: 0,
            [IUserKeys.allowPost]: 0,
            [IUserKeys.birthdate]: new Date(),
            [IUserKeys.city]: "",
            [IUserKeys.country]: "",
            [IUserKeys.displayName]: "",
            [IUserKeys.eMailAddress]: "",
            [IUserKeys.eatingHabits]: "",
            [IUserKeys.firstName]: "",
            [IUserKeys.houseNumber]: "",
            [IUserKeys.supplementaryAddress]: "",
            [IUserKeys.lastName]: "",
            [IUserKeys.phoneNumber]: "",
            [IUserKeys.streetName]: "",
            [IUserKeys.zipCode]: ""
        };
    }

    private emptyFormError = (): IFormError => {
        return {
            [IUserKeys.accessIdentifier]: null,
            [IUserKeys.allowNewsletter]: null,
            [IUserKeys.allowPost]: null,
            [IUserKeys.birthdate]: null,
            [IUserKeys.city]: null,
            [IUserKeys.country]: null,
            [IUserKeys.displayName]: null,
            [IUserKeys.eMailAddress]: null,
            [IUserKeys.eatingHabits]: null,
            [IUserKeys.firstName]: null,
            [IUserKeys.houseNumber]: null,
            [IUserKeys.supplementaryAddress]: null,
            [IUserKeys.lastName]: null,
            [IUserKeys.phoneNumber]: null,
            [IUserKeys.streetName]: null,
            [IUserKeys.zipCode]: null
        }
    }


    /* - fetch - */

    private fetchAccountData = (notice: INotice | null = null, resetErrors: boolean = true): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                fetchAccountDataRequest: new FetchAccountDataRequest(
                    (response: IFetchAccountDataResponse) => {
                        const errorMsg = response.errorMsg;
                        const user = response.user
        
                        if (errorMsg) {
                            this.setState(prevState => {
                                return {
                                    ...prevState,
                                    fetchAccountDataRequest: null,
                                    notice: {
                                        message: errorMsg,
                                        type: Dict.error_type_server
                                    }
                                };
                            });
                        } else if (user) {
                            const fetchedForm: IForm = {
                                [IUserKeys.accessIdentifier]: user.accessIdentifier || "",
                                [IUserKeys.allowNewsletter]: user.allowNewsletter || 0,
                                [IUserKeys.allowPost]: user.allowPost || 0,
                                [IUserKeys.birthdate]: user.birthdate ? getDate(user.birthdate, Formats.DATE.DATETIME_DATABASE) : null,
                                [IUserKeys.city]: user.city || "",
                                [IUserKeys.country]: user.country || "",
                                [IUserKeys.displayName]: user.displayName || "",
                                [IUserKeys.eMailAddress]: user.eMailAddress || "",
                                [IUserKeys.eatingHabits]: user.eatingHabits || "",
                                [IUserKeys.firstName]: user.firstName || "",
                                [IUserKeys.houseNumber]: user.houseNumber || "",
                                [IUserKeys.supplementaryAddress]: user.supplementaryAddress || "",
                                [IUserKeys.lastName]: user.lastName || "",
                                [IUserKeys.phoneNumber]: user.phoneNumber || "",
                                [IUserKeys.streetName]: user.streetName || "",
                                [IUserKeys.zipCode]: user.zipCode || "",
                            };
                            const form: IForm = {
                                ...fetchedForm
                            };
        
                            this.setState(prevState => {
                                return {
                                    ...prevState,
                                    fetchAccountDataRequest: null,
                                    fetchedForm,
                                    form,
                                    formError: resetErrors ? this.emptyFormError() : prevState.formError,
                                    notice
                                };
                            });
                        }
                    },
                    () => {
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                fetchAccountDataRequest: null,
                                notice: {
                                    message: Dict.error_message_try_later,
                                    type: Dict.error_type_network
                                }
                            }
                        });
                    }
                )
            }
        });
    }

    /* - update - */

    private updateAccountData = (key: IFormKeys, value: IFormValues): void => {
        if (!this.state.fetchedForm || !this.state.form ||
            this.state.formError[key] ||
            this.state.fetchedForm[key] === this.state.form[key]) {
            return;
        }

        let newValue = null;
        if (typeof value === "string") {
            newValue = value;
        } else if (typeof value === "number" || value) {
            newValue = value.toString();
        }

        logger.info(LogTags.ACCOUNT_DATA + "updating '" + key + "' to '" + newValue + "'");

        this.setState(prevState => {
            return {
                ...prevState,
                updateAccountDataRequest: new UpdateAccountDataRequest(
                    key,
                    newValue,
                    (response: IResponse) => {
                        const errorMsg = response.errorMsg;
                        const successMsg = response.successMsg;
        
                        if (errorMsg) {
                            let errorKey: IFormKeys | null = null;
        
                            for (const formKey in this.state.formError) {
                                if (errorMsg.indexOf(formKey) > -1) {
                                    errorKey = formKey as IFormKeys;
                                    break;
                                }
                            }
        
                            if (errorKey) {
                                this.setState(prevState => {
                                    return {
                                        ...prevState,
                                        updateAccountDataRequest: null,
                                        formError: {
                                            ...this.emptyFormError(),
                                            [errorKey]: Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg
                                        }
                                    }
                                });
                            } else {
                                this.setState(prevState => {
                                    return {
                                        ...prevState,
                                        updateAccountDataRequest: null,
                                        formError: this.emptyFormError()
                                    }
                                });
                                showNotification(errorMsg);
                            }
                        } else {
                            this.setState(prevState => {
                                return {
                                    ...prevState,
                                    updateAccountDataRequest: null
                                };
                            });
                        }
        
                        this.fetchAccountData(
                            successMsg ? {
                                message: successMsg,
                                type: Dict.label_warning
                            } : null,
                            errorMsg ? false : true
                        );
                    },
                    () => {
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                updateAccountDataRequest: null,
                                notice: {
                                    message: Dict.error_message_try_later,
                                    type: Dict.error_type_network
                                }
                            }
                        });
                    }
                )
            }
        });
    }

    /* - delete - */

    private showDeletionConfirmationDialog = (show: boolean): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                showDeletionConfirmationDialog: show
            }
        });
    }

    private deleteAccountData = (): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                showDeletionConfirmationDialog: false,
                deleteAccountDataRequest: new DeleteAccountDataRequest(
                    (response: IResponse) => {
                        const errorMsg = response.errorMsg;
                        const successMsg = response.successMsg;
        
                        if (errorMsg) {
                            this.setState(prevState => {
                                return {
                                    ...prevState,
                                    deleteAccountDataRequest: null,
                                    notice: {
                                        message: errorMsg,
                                        type: Dict.error_type_server
                                    }
                                };
                            });
                        } else {
                            this.setState(prevState => {
                                return {
                                    ...prevState,
                                    deleteAccountDataRequest: null,
                                    notice: {
                                        message: successMsg,
                                        type: Dict.label_warning
                                    }
                                };
                            });
                        }
                    },
                    () => {
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                deleteAccountDataRequest: null,
                                notice: null
                            };
                        });
                    }
                )
            };
        });
    }

}

export default withTheme(withRouter(ProfileForm));

const textCenterStyle: React.CSSProperties = {
    textAlign: "center"
}

const preWrapStyle: React.CSSProperties = {
    whiteSpace: "pre-wrap"
}

const legendGridStyle: React.CSSProperties = {
    ...gridHorizontalStyle,
    justifyContent: "flex-start"
}

const accountMarkerStyle: React.CSSProperties = {
    ...markerAccountRequirementsStyle,
    ...markerRequirementsLeftMarginStyle
}

const eventMarkerStyle: React.CSSProperties = {
    ...markerEventRequirementsStyle,
    ...markerRequirementsLeftMarginStyle
}
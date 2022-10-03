import log, * as logger from "loglevel";
import * as React from "react";
import { useLocation, useNavigate } from "react-router";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Icon,
    Typography,
    withTheme,
    WithTheme,
} from "@mui/material";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { getDate } from "../../constants/global-functions";
import { LogTags } from "../../constants/log-tags";
import { AppUrls } from "../../constants/specific-urls";
import {
    gridHorizontalStyle,
    markerAccountRequirementsStyle,
    markerEventRequirementsStyle,
    markerRequirementsLeftMarginStyle,
} from "../../constants/theme";
import { DeleteAccountDataRequest } from "../../networking/account_data/DeleteAccountDataRequest";
import {
    FetchAccountDataRequest,
    IFetchAccountDataResponse,
} from "../../networking/account_data/FetchAccountDataRequest";
import { IUserKeys } from "../../networking/account_data/IUser";
import { UpdateAccountDataRequest } from "../../networking/account_data/UpdateAccountDataRequest";
import INotice from "../../networking/INotice";
import { IResponse } from "../../networking/Request";
import { CookieService } from "../../services/CookieService";
import AccessIdentifierInput from "../form_elements/AccessIdentifierInput";
import AllowNewsletterCheckbox from "../form_elements/AllowNewsletterCheckbox";
import AllowPostCheckbox from "../form_elements/AllowPostCheckbox";
import BirthdateInput from "../form_elements/BirthdateInput";
import CityInput from "../form_elements/CityInput";
import CountryInput from "../form_elements/CountryInput";
import DeleteButton from "../form_elements/DeleteButton";
import DisplayNameInput from "../form_elements/DisplayNameInput";
import EatingHabitsInput from "../form_elements/EatingHabitsInput";
import EMailAddressInput from "../form_elements/EMailAddressInput";
import FirstNameInput from "../form_elements/FirstNameInput";
import ForwardButton from "../form_elements/ForwardButton";
import HouseNumberInput from "../form_elements/HouseNumberInput";
import LastNameInput from "../form_elements/LastNameInput";
import PhoneNumberInput from "../form_elements/PhoneNumberInput";
import StreetNameInput from "../form_elements/StreetNameInput";
import SupplementaryAddressInput from "../form_elements/SupplementaryAddressInput";
import ZipCodeInput from "../form_elements/ZipCodeInput";
import { useRequestQueue } from "../utilities/CustomHooks";
import Grid from "../utilities/Grid";
import { showNotification } from "../utilities/Notifier";

type IProfileFormProps = WithTheme;

type IFormKeys =
    | IUserKeys.accessIdentifier
    | IUserKeys.allowNewsletter
    | IUserKeys.allowPost
    | IUserKeys.birthdate
    | IUserKeys.city
    | IUserKeys.country
    | IUserKeys.displayName
    | IUserKeys.eMailAddress
    | IUserKeys.eatingHabits
    | IUserKeys.firstName
    | IUserKeys.houseNumber
    | IUserKeys.supplementaryAddress
    | IUserKeys.lastName
    | IUserKeys.phoneNumber
    | IUserKeys.streetName
    | IUserKeys.zipCode;
type IFormValues = string | number | Date;

interface IForm {
    [IUserKeys.accessIdentifier]: string;
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

const ProfileForm = (props: IProfileFormProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = props;

    const [form, setForm] = React.useState<IForm>({
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
        [IUserKeys.zipCode]: "",
    });
    const emptyFormError = React.useMemo((): IFormError => {
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
            [IUserKeys.zipCode]: null,
        };
    }, []);
    const [formError, setFormError] = React.useState<IFormError>({
        ...emptyFormError,
    });
    const [notice, setNotice] = React.useState<INotice>({
        message: Dict.label_wait,
        type: Dict.label_loading,
    });
    const [showDeletionConfirmationDialog, setShowDeletionConfirmationDialog] =
        React.useState<boolean>(false);
    const fetchedForm = React.useRef<IForm>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [request, isRequestRunning] = useRequestQueue();

    const areEnrollmentDataRequired = React.useMemo(
        () => location.pathname === AppUrls.PROFILE_ENROLLMENT_DATA,
        [location.pathname]
    );
    const expansionPanelDetailsStyle: React.CSSProperties = React.useMemo(
        () => ({
            flexDirection: "column",
        }),
        []
    );
    const expansionPanelDetailsInnerStyle: React.CSSProperties = React.useMemo(
        () => ({
            marginLeft: theme.spacing(),
            marginRight: theme.spacing(),
            paddingTop: theme.spacing(),
        }),
        [theme]
    );
    const separatorStyle: React.CSSProperties = React.useMemo(
        () => ({
            height: theme.spacing(2),
        }),
        [theme]
    );
    const textCenterStyle: React.CSSProperties = React.useMemo(
        () => ({
            textAlign: "center",
        }),
        []
    );
    const preWrapStyle: React.CSSProperties = React.useMemo(
        () => ({
            whiteSpace: "pre-wrap",
        }),
        []
    );
    const legendGridStyle: React.CSSProperties = React.useMemo(
        () => ({
            ...gridHorizontalStyle,
            justifyContent: "flex-start",
        }),
        []
    );
    const accountMarkerStyle: React.CSSProperties = React.useMemo(
        () => ({
            ...markerAccountRequirementsStyle,
            ...markerRequirementsLeftMarginStyle,
        }),
        []
    );
    const eventMarkerStyle: React.CSSProperties = React.useMemo(
        () => ({
            ...markerEventRequirementsStyle,
            ...markerRequirementsLeftMarginStyle,
        }),
        []
    );

    const updateForm = React.useCallback(
        (key: IFormKeys, value: IFormValues): void => {
            setForm((form) => ({
                ...form,
                [key]: value,
            }));
        },
        []
    );
    const updateFormError = React.useCallback(
        (key: IFormKeys, value: string | null): void => {
            setFormError((formError) => ({
                ...formError,
                [key]: value,
            }));
        },
        []
    );
    const fetchAccountData = React.useCallback((): void => {
        request(
            new FetchAccountDataRequest(
                (response: IFetchAccountDataResponse) => {
                    const errorMsg = response.errorMsg;
                    const user = response.user;

                    if (errorMsg) {
                        setNotice({
                            message: errorMsg,
                            type: Dict.error_type_server,
                        });
                    } else if (user) {
                        const downloadedForm: IForm = {
                            [IUserKeys.accessIdentifier]:
                                user.accessIdentifier || "",
                            [IUserKeys.allowNewsletter]:
                                user.allowNewsletter || 0,
                            [IUserKeys.allowPost]: user.allowPost || 0,
                            [IUserKeys.birthdate]: user.birthdate
                                ? getDate(
                                      user.birthdate,
                                      Formats.DATE.DATETIME_DATABASE
                                  )
                                : null,
                            [IUserKeys.city]: user.city || "",
                            [IUserKeys.country]: user.country || "",
                            [IUserKeys.displayName]: user.displayName || "",
                            [IUserKeys.eMailAddress]: user.eMailAddress || "",
                            [IUserKeys.eatingHabits]: user.eatingHabits || "",
                            [IUserKeys.firstName]: user.firstName || "",
                            [IUserKeys.houseNumber]: user.houseNumber || "",
                            [IUserKeys.supplementaryAddress]:
                                user.supplementaryAddress || "",
                            [IUserKeys.lastName]: user.lastName || "",
                            [IUserKeys.phoneNumber]: user.phoneNumber || "",
                            [IUserKeys.streetName]: user.streetName || "",
                            [IUserKeys.zipCode]: user.zipCode || "",
                        };
                        setForm(downloadedForm);
                        setNotice(null);
                        fetchedForm.current = downloadedForm;
                    }
                },
                () => {
                    setNotice({
                        message: Dict.error_message_try_later,
                        type: Dict.error_type_network,
                    });
                }
            )
        );
    }, [request]);
    const updateAccountData = React.useCallback(
        (key: IFormKeys, value: IFormValues): void => {
            if (
                !fetchedForm.current ||
                !form ||
                formError[key] ||
                fetchedForm.current[key] === form[key]
            ) {
                return;
            }

            let newValue = null;
            if (typeof value === "string") {
                newValue = value;
            } else if (typeof value === "number" || value) {
                newValue = value.toString();
            }

            logger.info(
                LogTags.ACCOUNT_DATA +
                    "updating '" +
                    key +
                    "' to '" +
                    newValue +
                    "'"
            );

            request(
                new UpdateAccountDataRequest(
                    key,
                    newValue,
                    (response: IResponse) => {
                        const errorMsg = response.errorMsg;
                        const successMsg = response.successMsg;

                        if (errorMsg) {
                            let errorKey: IFormKeys | null = null;

                            for (const formKey in formError) {
                                if (errorMsg.indexOf(formKey) > -1) {
                                    errorKey = formKey as IFormKeys;
                                    break;
                                }
                            }

                            if (errorKey) {
                                setFormError(formError => ({
                                    ...formError,
                                    [errorKey]: Dict[errorMsg] ?? errorMsg
                                }));
                            } else {
                                setFormError({
                                    ...emptyFormError,
                                });
                                showNotification(errorMsg);
                            }
                        } else {
                            setForm((form) => ({
                                ...form,
                                [key]: value,
                            }));
                            setFormError((formError) => ({
                                ...formError,
                                [key]: null,
                            }));
                            fetchedForm.current = {
                                ...fetchedForm.current,
                                [key]: value,
                            };
                            showNotification(successMsg);
                        }
                    },
                    () => {
                        setNotice({
                            message: Dict.error_message_try_later,
                            type: Dict.error_type_network,
                        });
                    }
                )
            );
        },
        [emptyFormError, form, formError, request]
    );
    const deleteAccountData = React.useCallback((): void => {
        setShowDeletionConfirmationDialog(false);
        request(
            new DeleteAccountDataRequest(
                (response: IResponse) => {
                    const errorMsg = response.errorMsg;
                    const successMsg = response.successMsg;

                    if (errorMsg) {
                        setNotice({
                            message: errorMsg,
                            type: Dict.error_type_server,
                        });
                    } else {
                        setNotice({
                            message: successMsg,
                            type: Dict.label_warning,
                        });
                    }
                },
                () => {
                    setNotice(null);
                }
            )
        );
    }, [request]);

    React.useEffect(() => {
        CookieService.get<number>(IUserKeys.userId)
            .then((userId) => {
                if (userId === null) {
                    log.error(
                        LogTags.AUTHENTICATION +
                            Dict.error_message_account_required
                    );
                    navigate(AppUrls.HOME);
                } else {
                    fetchAccountData();
                }
            })
            .catch((error) => {
                log.error(
                    LogTags.STORAGE_MANAGER + "Could not load userId: " + error
                );
                navigate(AppUrls.HOME);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const separator = React.useMemo((): React.ReactNode => {
        return <div style={separatorStyle} />;
    }, [separatorStyle]);

    const renderedNotice = React.useMemo((): React.ReactElement<any> => {
        if (!notice) {
            return null;
        }

        const { message, type } = notice;
        return (
            <Card>
                <CardHeader title={Dict[type] ?? type} />
                <CardContent>
                    <Typography>{Dict[message] ?? message}</Typography>
                </CardContent>
            </Card>
        );
    }, [notice]);
    const renderedForm = React.useMemo(
        (): React.ReactElement<any> => (
            <>
                <Accordion expanded={true}>
                    <AccordionSummary>
                        <Typography color="textSecondary" variant="h5">
                            {Dict.label_legend}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={expansionPanelDetailsStyle}>
                        <div style={expansionPanelDetailsInnerStyle}>
                            <Grid style={legendGridStyle}>
                                <Typography style={accountMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                                <Typography
                                    style={markerRequirementsLeftMarginStyle}
                                >
                                    {Dict.account_credentials_signUp}
                                </Typography>
                            </Grid>
                            {separator}
                            <Grid style={legendGridStyle}>
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                                <Typography
                                    style={markerRequirementsLeftMarginStyle}
                                >
                                    {Dict.account_credentials_event}
                                </Typography>
                            </Grid>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<Icon>keyboard_arrow_down</Icon>}
                    >
                        <Typography color="textSecondary" variant="h5">
                            {Dict.account_data_account}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={expansionPanelDetailsStyle}>
                        <div style={expansionPanelDetailsInnerStyle}>
                            <AccessIdentifierInput
                                value={form[IUserKeys.accessIdentifier]}
                            />
                            {separator}
                            <Grid style={gridHorizontalStyle}>
                                <EMailAddressInput
                                    errorMessage={
                                        formError[IUserKeys.eMailAddress]
                                    }
                                    onError={updateFormError}
                                    onUpdateValue={updateForm}
                                    onBlur={updateAccountData}
                                    required={areEnrollmentDataRequired}
                                    value={form[IUserKeys.eMailAddress]}
                                />
                                <Typography style={accountMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {separator}
                            <DisplayNameInput
                                errorMessage={formError[IUserKeys.displayName]}
                                onError={updateFormError}
                                onUpdateValue={updateForm}
                                onBlur={updateAccountData}
                                value={form[IUserKeys.displayName]}
                            />
                            {separator}
                            <div style={textCenterStyle}>
                                <ForwardButton
                                    forwardTo={AppUrls.PROFILE_CHANGE_PASSWORD}
                                    label={Dict.account_password_new}
                                />
                                {separator}
                                <DeleteButton
                                    label={Dict.account_deletion}
                                    onClick={setShowDeletionConfirmationDialog.bind(
                                        this,
                                        true
                                    )}
                                />
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<Icon>keyboard_arrow_down</Icon>}
                    >
                        <Typography color="textSecondary" variant="h5">
                            {Dict.account_data_contact}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={expansionPanelDetailsStyle}>
                        <div style={expansionPanelDetailsInnerStyle}>
                            <Grid style={gridHorizontalStyle}>
                                <FirstNameInput
                                    errorMessage={
                                        formError[IUserKeys.firstName]
                                    }
                                    onError={updateFormError}
                                    onUpdateValue={updateForm}
                                    onBlur={updateAccountData}
                                    required={areEnrollmentDataRequired}
                                    value={form[IUserKeys.firstName]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {separator}
                            <Grid style={gridHorizontalStyle}>
                                <LastNameInput
                                    errorMessage={formError[IUserKeys.lastName]}
                                    onError={updateFormError}
                                    onUpdateValue={updateForm}
                                    onBlur={updateAccountData}
                                    required={areEnrollmentDataRequired}
                                    value={form[IUserKeys.lastName]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {separator}
                            <Grid style={gridHorizontalStyle}>
                                <StreetNameInput
                                    errorMessage={
                                        formError[IUserKeys.streetName]
                                    }
                                    onError={updateFormError}
                                    onUpdateValue={updateForm}
                                    onBlur={updateAccountData}
                                    required={areEnrollmentDataRequired}
                                    value={form[IUserKeys.streetName]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {separator}
                            <Grid style={gridHorizontalStyle}>
                                <HouseNumberInput
                                    errorMessage={
                                        formError[IUserKeys.houseNumber]
                                    }
                                    onError={updateFormError}
                                    onUpdateValue={updateForm}
                                    onBlur={updateAccountData}
                                    required={areEnrollmentDataRequired}
                                    value={form[IUserKeys.houseNumber]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {separator}
                            <Grid style={gridHorizontalStyle}>
                                <SupplementaryAddressInput
                                    errorMessage={
                                        formError[
                                            IUserKeys.supplementaryAddress
                                        ]
                                    }
                                    onError={updateFormError}
                                    onUpdateValue={updateForm}
                                    onBlur={updateAccountData}
                                    value={form[IUserKeys.supplementaryAddress]}
                                />
                            </Grid>
                            {separator}
                            <Grid style={gridHorizontalStyle}>
                                <ZipCodeInput
                                    errorMessage={formError[IUserKeys.zipCode]}
                                    onError={updateFormError}
                                    onUpdateValue={updateForm}
                                    onBlur={updateAccountData}
                                    required={areEnrollmentDataRequired}
                                    value={form[IUserKeys.zipCode]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {separator}
                            <Grid style={gridHorizontalStyle}>
                                <CityInput
                                    errorMessage={formError[IUserKeys.city]}
                                    onError={updateFormError}
                                    onUpdateValue={updateForm}
                                    onBlur={updateAccountData}
                                    required={areEnrollmentDataRequired}
                                    value={form[IUserKeys.city]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {separator}
                            <Grid style={gridHorizontalStyle}>
                                <CountryInput
                                    errorMessage={formError[IUserKeys.country]}
                                    onError={updateFormError}
                                    onUpdateValue={updateForm}
                                    onBlur={updateAccountData}
                                    required={areEnrollmentDataRequired}
                                    value={form[IUserKeys.country]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {separator}
                            <AllowPostCheckbox
                                checked={form[IUserKeys.allowPost] === 1}
                                errorMessage={formError[IUserKeys.allowPost]}
                                onUpdateValue={updateForm}
                                onBlur={updateAccountData}
                            />
                            {separator}
                            <AllowNewsletterCheckbox
                                checked={form[IUserKeys.allowNewsletter] === 1}
                                errorMessage={
                                    formError[IUserKeys.allowNewsletter]
                                }
                                onUpdateValue={updateForm}
                                onBlur={updateAccountData}
                            />
                            {separator}
                            <Grid style={gridHorizontalStyle}>
                                <EMailAddressInput
                                    disabled={true}
                                    errorMessage={
                                        formError[IUserKeys.eMailAddress]
                                    }
                                    onError={updateFormError}
                                    onUpdateValue={updateForm}
                                    onBlur={updateAccountData}
                                    required={areEnrollmentDataRequired}
                                    value={form[IUserKeys.eMailAddress]}
                                />
                                <Typography style={accountMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {separator}
                            <Grid style={gridHorizontalStyle}>
                                <PhoneNumberInput
                                    errorMessage={
                                        formError[IUserKeys.phoneNumber]
                                    }
                                    onError={updateFormError}
                                    onUpdateValue={updateForm}
                                    onBlur={updateAccountData}
                                    value={form[IUserKeys.phoneNumber]}
                                />
                            </Grid>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<Icon>keyboard_arrow_down</Icon>}
                    >
                        <Typography color="textSecondary" variant="h5">
                            {Dict.account_data_event}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={expansionPanelDetailsStyle}>
                        <div style={expansionPanelDetailsInnerStyle}>
                            <Grid style={gridHorizontalStyle}>
                                <BirthdateInput
                                    errorMessage={
                                        formError[IUserKeys.birthdate]
                                    }
                                    onError={updateFormError}
                                    onUpdateValue={updateForm}
                                    onBlur={updateAccountData}
                                    required={areEnrollmentDataRequired}
                                    value={form[IUserKeys.birthdate]}
                                />
                                <Typography style={eventMarkerStyle}>
                                    {Dict.account_credentials_mark}
                                </Typography>
                            </Grid>
                            {separator}
                            <Grid style={gridHorizontalStyle}>
                                <EatingHabitsInput
                                    errorMessage={
                                        formError[IUserKeys.eatingHabits]
                                    }
                                    onError={updateFormError}
                                    onUpdateValue={updateForm}
                                    onBlur={updateAccountData}
                                    value={form[IUserKeys.eatingHabits]}
                                />
                            </Grid>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Dialog
                    onClose={setShowDeletionConfirmationDialog.bind(
                        this,
                        false
                    )}
                    open={showDeletionConfirmationDialog}
                    style={preWrapStyle}
                >
                    <DialogTitle>
                        {Dict.account_deletion_confirmation_title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText style={preWrapStyle}>
                            {Dict.account_deletion_confirmation_message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={setShowDeletionConfirmationDialog.bind(
                                this,
                                false
                            )}
                            color="primary"
                        >
                            {Dict.label_cancel}
                        </Button>
                        <Button onClick={deleteAccountData} color="primary">
                            {Dict.label_confirm}
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        ),
        [
            accountMarkerStyle,
            areEnrollmentDataRequired,
            deleteAccountData,
            eventMarkerStyle,
            expansionPanelDetailsInnerStyle,
            expansionPanelDetailsStyle,
            form,
            formError,
            legendGridStyle,
            preWrapStyle,
            separator,
            showDeletionConfirmationDialog,
            textCenterStyle,
            updateAccountData,
            updateForm,
            updateFormError,
        ]
    );

    return notice ? renderedNotice : renderedForm;
};

export default withTheme(ProfileForm);

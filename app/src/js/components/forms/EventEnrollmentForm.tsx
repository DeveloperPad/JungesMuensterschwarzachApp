import log from "loglevel";
import * as React from "react";
import { useNavigate } from "react-router";

import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    withTheme,
    WithTheme,
} from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Formats from "../../constants/formats";
import { formatDate } from "../../constants/global-functions";
import { LogTags } from "../../constants/log-tags";
import { AppUrls } from "../../constants/specific-urls";
import {
    CustomTheme,
    grid1Style,
    gridHorizontalStyle,
} from "../../constants/theme";
import { IUserKeys } from "../../networking/account_data/IUser";
import { DisenrollEventDataRequest } from "../../networking/events/DisenrollEventDataRequest";
import { EnrollEventDataRequest } from "../../networking/events/EnrollEventDataRequest";
import {
    FetchEventEnrollmentDataRequest,
    IFetchEventEnrollmentDataResponse,
} from "../../networking/events/FetchEventEnrollmentDataRequest";
import { IEventEnrollmentKeys } from "../../networking/events/IEventEnrollment";
import IEventItem, { IEventItemKeys } from "../../networking/events/IEventItem";
import { UpdateEventEnrollmentCommentDataRequest } from "../../networking/events/UpdateEventEnrollmentCommentDataRequest";
import INotice from "../../networking/INotice";
import { IResponse } from "../../networking/Request";
import { CookieService } from "../../services/CookieService";
import EventEnrollmentCommentInput from "../form_elements/EventEnrollmentCommentInput";
import SubmitButton from "../form_elements/SubmitButton";
import Grid from "../utilities/Grid";
import { showNotification } from "../utilities/Notifier";
import { useStateRequest } from "../utilities/CustomHooks";

type IEventEnrollmentFormProps = WithTheme & {
    eventItem: IEventItem;
    isLoggedIn: boolean;
    refetchEventItem: () => void;
};

type IFormKeys = IEventEnrollmentKeys.eventEnrollmentComment;

interface IForm {
    [IEventEnrollmentKeys.eventEnrollmentComment]: string;
}

interface IFormError {
    [IEventEnrollmentKeys.eventEnrollmentComment]: string | null;
}

const EventEnrollmentForm = (props: IEventEnrollmentFormProps) => {
    const navigate = useNavigate();
    const { eventItem, isLoggedIn, refetchEventItem, theme } =
        props;
    const [isEnrolled, setIsEnrolled] = React.useState<boolean>(false);
    const [
        showEnrollmentConfirmationDialog,
        setShowEnrollmentConfirmationDialog,
    ] = React.useState<boolean>(false);
    const [notice, setNotice] = React.useState<INotice>({
        message: Dict.label_wait,
        type: Dict.label_loading,
    });
    const [form, setForm] = React.useState<IForm>({
        [IEventEnrollmentKeys.eventEnrollmentComment]: "",
    });
    const [formError, setFormError] = React.useState<IFormError>({
        [IEventEnrollmentKeys.eventEnrollmentComment]: null,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [request, setRequest] = useStateRequest();
    const fetchedForm = React.useRef<IForm>();

    const contentIndentationStyle: React.CSSProperties = React.useMemo(
        () => ({
            marginLeft: 2 * theme.spacing(),
        }),
        [theme]
    );
    const lowerSeparatorStyle: React.CSSProperties = React.useMemo(
        () => ({
            height: theme.spacing(),
        }),
        [theme]
    );
    const preWrapStyle: React.CSSProperties = React.useMemo(
        () => ({
            whiteSpace: "pre-wrap",
        }),
        []
    );

    const updateForm = React.useCallback(
        (key: IFormKeys, value: string): void => {
            console.log("updating " + key + " to " + value);
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
    const fetchEventEnrollment = React.useCallback((): void => {
        if (!isLoggedIn) {
            return;
        }

        setRequest(
            new FetchEventEnrollmentDataRequest(
                eventItem[IEventItemKeys.eventId],
                (response: IFetchEventEnrollmentDataResponse) => {
                    const errorMsg = response.errorMsg;

                    if (errorMsg) {
                        setNotice({
                            message: errorMsg,
                            type: Dict.error_type_account,
                        });
                    } else {
                        let comment = "";
                        let enrolled = false;

                        const eventEnrollment = response.eventEnrollment;
                        if (eventEnrollment) {
                            enrolled = true;
                            const eventEnrollmentComment =
                                eventEnrollment[
                                    IEventEnrollmentKeys.eventEnrollmentComment
                                ];

                            if (eventEnrollmentComment) {
                                comment = eventEnrollmentComment;
                            }
                        }

                        const downloadedForm: IForm = {
                            [IEventEnrollmentKeys.eventEnrollmentComment]:
                                comment,
                        };

                        fetchedForm.current = downloadedForm;
                        setForm(downloadedForm);
                        updateFormError(IEventEnrollmentKeys.eventEnrollmentComment, null);
                        setIsEnrolled(enrolled);
                        setNotice(null);
                    }

                    setRequest(null);
                },
                () => {
                    setNotice({
                        message: Dict.error_message_try_later,
                        type: Dict.error_type_network,
                    });
                    setRequest(null);
                }
            )
        );
        refetchEventItem();
    }, [eventItem, isLoggedIn, refetchEventItem, setRequest, updateFormError]);
    const enroll = React.useCallback((): void => {
        if (!isLoggedIn || isEnrolled) {
            return;
        }

        setRequest(
            new EnrollEventDataRequest(
                eventItem[IEventItemKeys.eventId],
                form[IEventEnrollmentKeys.eventEnrollmentComment],
                (response: IResponse) => {
                    const errorMsg = response.errorMsg;

                    if (errorMsg) {
                        if (
                            errorMsg.indexOf(
                                IEventEnrollmentKeys.eventEnrollmentComment
                            ) > -1
                        ) {
                            updateFormError(IEventEnrollmentKeys.eventEnrollmentComment, Dict[errorMsg] ?? errorMsg);
                        } else if (
                            errorMsg ===
                            "event_user_enrollment_missing_account_data"
                        ) {
                            // TODO: replace with DictKeys from commons
                            navigate(AppUrls.PROFILE);
                            showNotification(errorMsg);
                        } else {
                            updateFormError(IEventEnrollmentKeys.eventEnrollmentComment, null);
                            showNotification(errorMsg);
                        }

                        setNotice(null);
                        setRequest(null);
                    } else {
                        updateFormError(IEventEnrollmentKeys.eventEnrollmentComment, null);
                        setNotice(null);

                        fetchEventEnrollment();
                    }
                },
                () => {
                    setNotice({
                        message: Dict.error_message_try_later,
                        type: Dict.error_type_network,
                    });
                    setRequest(null);
                }
            )
        );
        setShowEnrollmentConfirmationDialog(false);
    }, [eventItem, fetchEventEnrollment, form, isEnrolled, isLoggedIn, navigate, setRequest, updateFormError]);
    const updateEventEnrollmentData = React.useCallback(
        (key: IFormKeys, value: string): void => {
            if (
                !isLoggedIn ||
                !isEnrolled ||
                !fetchedForm.current ||
                fetchedForm.current[key] === value ||
                formError[key]
            ) {
                return;
            }

            setRequest(
                new UpdateEventEnrollmentCommentDataRequest(
                    eventItem[IEventItemKeys.eventId],
                    value,
                    (response: IResponse) => {
                        const errorMsg = response.errorMsg;
                        const successMsg = response.successMsg;

                        if (errorMsg) {
                            if (
                                errorMsg.indexOf(
                                    IEventEnrollmentKeys.eventEnrollmentComment
                                ) > -1
                            ) {
                                updateFormError(IEventEnrollmentKeys.eventEnrollmentComment, Dict[errorMsg] ?? errorMsg);
                            } else {
                                updateFormError(key, null);
                                showNotification(errorMsg);
                            }
                        } else {
                            updateFormError(key, null);
                            showNotification(successMsg);
                        }

                        setNotice(null);
                        setRequest(null);
                    },
                    () => {
                        setNotice({
                            message: Dict.error_message_try_later,
                            type: Dict.error_type_network,
                        });
                        setRequest(null);
                    }
                )
            );
        },
        [eventItem, formError, isEnrolled, isLoggedIn, setRequest, updateFormError]
    );
    const disenroll = React.useCallback((): void => {
        if (!isLoggedIn || !isEnrolled) {
            return;
        }

        setRequest(
            new DisenrollEventDataRequest(
                eventItem[IEventItemKeys.eventId],
                (response: IResponse) => {
                    const errorMsg = response.errorMsg;

                    if (errorMsg) {
                        updateFormError(IEventEnrollmentKeys.eventEnrollmentComment, null);
                        showNotification(errorMsg);

                        setRequest(null);
                    } else {
                        updateFormError(IEventEnrollmentKeys.eventEnrollmentComment, null);

                        fetchEventEnrollment();
                    }

                    setNotice(null);
                },
                () => {
                    setNotice({
                        message: Dict.error_message_try_later,
                        type: Dict.error_type_network,
                    });
                    setRequest(null);
                }
            )
        );
    }, [eventItem, fetchEventEnrollment, isEnrolled, isLoggedIn, setRequest, updateFormError]);

    React.useEffect(() => {
        CookieService.get<number>(IUserKeys.accessLevel)
            .then((accessLevel) => {
                if (accessLevel) {
                    //setIsLoggedIn(true);
                    fetchEventEnrollment();
                } else {
                    setNotice(null);
                }
            })
            .catch((error) => {
                log.warn(
                    LogTags.STORAGE_MANAGER +
                        "accessLevel could not be loaded: " +
                        error
                );
                navigate(AppUrls.LOGOUT);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderedNotice = React.useMemo(() => {
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
    const renderedForm = React.useMemo(() => {
        const enrollmentStart: Date =
            eventItem[IEventItemKeys.eventEnrollmentStart];
        const enrollmentEnd: Date =
            eventItem[IEventItemKeys.eventEnrollmentEnd];
        const now: Date = new Date();

        const content = !isLoggedIn ? (
            <Typography>{Dict.error_message_account_required}</Typography>
        ) : now < enrollmentStart ? (
            <Typography>
                {isEnrolled
                    ? Dict.event_user_disenrollment_too_early
                    : Dict.event_user_enrollment_too_early}
            </Typography>
        ) : enrollmentEnd < now ? (
            <Typography>
                {isEnrolled
                    ? Dict.event_user_disenrollment_too_late
                    : Dict.event_user_enrollment_too_late}
            </Typography>
        ) : (
            <>
                <Grid style={gridHorizontalStyle}>
                    <EventEnrollmentCommentInput
                        errorMessage={
                            formError[
                                IEventEnrollmentKeys.eventEnrollmentComment
                            ]
                        }
                        onBlur={updateEventEnrollmentData}
                        onError={updateFormError}
                        onUpdateValue={updateForm}
                        style={grid1Style}
                        value={
                            form[IEventEnrollmentKeys.eventEnrollmentComment]
                        }
                    />
                </Grid>

                <div style={lowerSeparatorStyle} />

                <SubmitButton
                    label={
                        isEnrolled ? Dict.event_disenroll : Dict.event_enroll
                    }
                    onClick={
                        isEnrolled
                            ? disenroll.bind(this)
                            : setShowEnrollmentConfirmationDialog.bind(
                                  this,
                                  true
                              )
                    }
                />
            </>
        );
        const registrationStateTypographyStyle: React.CSSProperties = {
            ...contentIndentationStyle,
            color: isEnrolled
                ? CustomTheme.COLOR_SUCCESS
                : CustomTheme.COLOR_FAILURE,
        };

        return (
            <>
                <Typography variant="body1">
                    {Dict.event_eventEnrollmentStart}
                </Typography>
                <Typography style={contentIndentationStyle}>
                    {formatDate(
                        eventItem[IEventItemKeys.eventEnrollmentStart],
                        Formats.DATE.DATETIME_LOCAL
                    )}
                </Typography>

                <div style={lowerSeparatorStyle} />

                <Typography variant="body1">
                    {Dict.event_eventEnrollmentEnd}
                </Typography>
                <Typography style={contentIndentationStyle}>
                    {formatDate(
                        eventItem[IEventItemKeys.eventEnrollmentEnd],
                        Formats.DATE.DATETIME_LOCAL
                    )}
                </Typography>

                <div style={lowerSeparatorStyle} />

                <Typography variant="body1">
                    {Dict.event_user_enrollment_state}
                </Typography>
                <Typography style={registrationStateTypographyStyle}>
                    {isEnrolled
                        ? Dict.event_user_enrollment_state_enrolled
                        : Dict.event_user_enrollment_state_enrolled_not}
                </Typography>

                <hr />

                <Card>
                    <CardHeader title={Dict.event_eventEnrollment} />
                    <CardContent>{content}</CardContent>
                </Card>

                <Dialog
                    onClose={setShowEnrollmentConfirmationDialog.bind(
                        this,
                        false
                    )}
                    open={showEnrollmentConfirmationDialog}
                    style={preWrapStyle}
                >
                    <DialogTitle>
                        {Dict.event_user_enrollment_confirmation_title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText style={preWrapStyle}>
                            {Dict.event_user_enrollment_confirmation_message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={setShowEnrollmentConfirmationDialog.bind(
                                this,
                                false
                            )}
                            color="primary"
                        >
                            {Dict.label_cancel}
                        </Button>
                        <Button onClick={enroll} color="primary">
                            {Dict.label_confirm}
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }, [
        contentIndentationStyle,
        disenroll,
        enroll,
        eventItem,
        form,
        formError,
        isEnrolled,
        isLoggedIn,
        lowerSeparatorStyle,
        preWrapStyle,
        showEnrollmentConfirmationDialog,
        updateEventEnrollmentData,
        updateForm,
        updateFormError,
    ]);

    return notice ? renderedNotice : renderedForm;
};

export default withTheme(EventEnrollmentForm);

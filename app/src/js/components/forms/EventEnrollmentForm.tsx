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
import { CheckInEventDataRequest } from "../../networking/events/CheckInEventDataRequest";
import { DisenrollEventDataRequest } from "../../networking/events/DisenrollEventDataRequest";
import { EnrollEventDataRequest } from "../../networking/events/EnrollEventDataRequest";
import { UpdateEventEnrollmentPublicMediaUsageConsentDataRequest } from "../../networking/events/UpdateEventEnrollmentPublicMediaUsageConsentDataRequest";
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
import { useRequestQueue } from "../utilities/CustomHooks";
import Grid from "../utilities/Grid";
import { showNotification } from "../utilities/Notifier";
import PublicMediaUsageConsentCheckbox from "../form_elements/PublicMediaUsageConsentCheckbox";

type IEventEnrollmentFormProps = WithTheme & {
    eventItem: IEventItem;
    isLoggedIn: boolean;
    refetchEventItem: () => void;
};

type IFormKeys =
    | IEventEnrollmentKeys.eventEnrollmentComment
    | IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent;

interface IForm {
    [IEventEnrollmentKeys.eventEnrollmentComment]: string;
    [IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent]: number;
}

interface IFormError {
    [IEventEnrollmentKeys.eventEnrollmentComment]: string | null;
    [IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent]:
        | string
        | null;
}

const EventEnrollmentForm = (props: IEventEnrollmentFormProps) => {
    const navigate = useNavigate();
    const { eventItem, isLoggedIn, refetchEventItem, theme } = props;
    const [isEnrolled, setIsEnrolled] = React.useState<boolean>(false);
    const [isCheckedIn, setIsCheckedIn] = React.useState<boolean>(false);
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
        [IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent]: 0,
    });
    const emptyFormError = React.useMemo(
        () => ({
            [IEventEnrollmentKeys.eventEnrollmentComment]: null,
            [IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent]: null,
        }),
        []
    );
    const [formError, setFormError] = React.useState<IFormError>({
        ...emptyFormError,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [request, isRequestRunning] = useRequestQueue();
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
        (key: IFormKeys, value: string | number): void => {
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

        request(
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
                        let publicMediaUsageConsent = 0;
                        let enrolled = false;
                        let checkedIn = false;

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

                            const eventEnrollmentPublicMediaUsageConsent =
                                eventEnrollment[
                                    IEventEnrollmentKeys
                                        .eventEnrollmentPublicMediaUsageConsent
                                ];
                            if (
                                eventEnrollmentPublicMediaUsageConsent !== null
                            ) {
                                publicMediaUsageConsent = parseInt(
                                    eventEnrollmentPublicMediaUsageConsent,
                                    10
                                );
                                checkedIn = true;
                            }
                        }

                        const downloadedForm: IForm = {
                            [IEventEnrollmentKeys.eventEnrollmentComment]:
                                comment,
                            [IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent]:
                                publicMediaUsageConsent,
                        };

                        fetchedForm.current = downloadedForm;
                        setForm(downloadedForm);
                        setFormError({
                            ...emptyFormError,
                        });
                        setIsEnrolled(enrolled);
                        setIsCheckedIn(checkedIn);
                        setNotice(null);
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
        refetchEventItem();
    }, [emptyFormError, eventItem, isLoggedIn, refetchEventItem, request]);
    const enroll = React.useCallback((): void => {
        if (!isLoggedIn || isEnrolled) {
            return;
        }

        request(
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
                            updateFormError(
                                IEventEnrollmentKeys.eventEnrollmentComment,
                                Dict[errorMsg] ?? errorMsg
                            );
                        } else if (
                            errorMsg ===
                            "event_user_enrollment_missing_account_data"
                        ) {
                            // TODO: replace with DictKeys from commons
                            navigate(AppUrls.PROFILE_ENROLLMENT_DATA);
                            showNotification(errorMsg);
                        } else {
                            updateFormError(
                                IEventEnrollmentKeys.eventEnrollmentComment,
                                null
                            );
                            showNotification(errorMsg);
                        }

                        setNotice(null);
                    } else {
                        updateFormError(
                            IEventEnrollmentKeys.eventEnrollmentComment,
                            null
                        );
                        setNotice(null);
                        showNotification(Dict.event_user_enrolled);

                        fetchEventEnrollment();
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
        setShowEnrollmentConfirmationDialog(false);
    }, [
        eventItem,
        fetchEventEnrollment,
        form,
        isEnrolled,
        isLoggedIn,
        navigate,
        request,
        updateFormError,
    ]);
    const updateEventEnrollmentComment = React.useCallback(
        (
            key: IEventEnrollmentKeys.eventEnrollmentComment,
            value: string
        ): void => {
            if (
                !isLoggedIn ||
                !isEnrolled ||
                !fetchedForm.current ||
                fetchedForm.current[key] === value ||
                formError[key]
            ) {
                return;
            }

            request(
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
                                updateFormError(
                                    IEventEnrollmentKeys.eventEnrollmentComment,
                                    Dict[errorMsg] ?? errorMsg
                                );
                            } else {
                                updateFormError(key, null);
                                showNotification(errorMsg);
                            }
                        } else {
                            updateFormError(key, null);
                            showNotification(successMsg);
                        }

                        setNotice(null);
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
        [eventItem, formError, isEnrolled, isLoggedIn, request, updateFormError]
    );
    const disenroll = React.useCallback((): void => {
        if (!isLoggedIn || !isEnrolled) {
            return;
        }

        request(
            new DisenrollEventDataRequest(
                eventItem[IEventItemKeys.eventId],
                (response: IResponse) => {
                    const errorMsg = response.errorMsg;

                    if (errorMsg) {
                        updateFormError(
                            IEventEnrollmentKeys.eventEnrollmentComment,
                            null
                        );
                        showNotification(errorMsg);
                    } else {
                        updateFormError(
                            IEventEnrollmentKeys.eventEnrollmentComment,
                            null
                        );
                        showNotification(Dict.event_user_disenrolled);
                        fetchEventEnrollment();
                    }

                    setNotice(null);
                },
                () => {
                    setNotice({
                        message: Dict.error_message_try_later,
                        type: Dict.error_type_network,
                    });
                }
            )
        );
    }, [
        eventItem,
        fetchEventEnrollment,
        isEnrolled,
        isLoggedIn,
        request,
        updateFormError,
    ]);
    const checkIn = React.useCallback((): void => {
        if (!isLoggedIn || !isEnrolled || isCheckedIn) {
            return;
        }

        request(
            new CheckInEventDataRequest(
                eventItem[IEventItemKeys.eventId],
                form[
                    IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent
                ],
                (response: IResponse) => {
                    const errorMsg = response.errorMsg;
                    const successMsg = response.successMsg;

                    if (errorMsg) {
                        if (
                            errorMsg.indexOf(
                                IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent
                            ) > -1
                        ) {
                            updateFormError(
                                IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent,
                                Dict[errorMsg] ?? errorMsg
                            );
                        } else {
                            updateFormError(
                                IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent,
                                null
                            );
                            showNotification(errorMsg);
                        }

                        setNotice(null);
                    } else {
                        updateFormError(
                            IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent,
                            null
                        );
                        setNotice(null);
                        showNotification(successMsg);

                        fetchEventEnrollment();
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
    }, [
        eventItem,
        fetchEventEnrollment,
        form,
        isCheckedIn,
        isEnrolled,
        isLoggedIn,
        request,
        updateFormError,
    ]);
    const updateEventEnrollmentPublicMediaUsageConsent = React.useCallback(
        (
            key: IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent,
            value: number
        ): void => {
            if (
                !isLoggedIn ||
                !isEnrolled ||
                !isCheckedIn ||
                !fetchedForm.current ||
                fetchedForm.current[key] === value ||
                formError[key]
            ) {
                return;
            }

            request(
                new UpdateEventEnrollmentPublicMediaUsageConsentDataRequest(
                    eventItem[IEventItemKeys.eventId],
                    value,
                    (response: IResponse) => {
                        const errorMsg = response.errorMsg;
                        const successMsg = response.successMsg;

                        if (errorMsg) {
                            if (
                                errorMsg.indexOf(
                                    IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent
                                ) > -1
                            ) {
                                updateFormError(
                                    IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent,
                                    Dict[errorMsg] ?? errorMsg
                                );
                            } else {
                                updateFormError(key, null);
                                showNotification(errorMsg);
                            }
                        } else {
                            updateFormError(key, null);
                            showNotification(successMsg);
                            fetchEventEnrollment();
                        }

                        setNotice(null);
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
        [
            eventItem,
            fetchEventEnrollment,
            formError,
            isCheckedIn,
            isEnrolled,
            isLoggedIn,
            request,
            updateFormError,
        ]
    );

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
    // TODO: extract to separate component
    const renderedEnrollmentForm = React.useMemo(() => {
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
                        onBlur={updateEventEnrollmentComment}
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
                    disabled={isRequestRunning}
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
        return (
            <Card>
                <CardHeader title={Dict.event_eventEnrollment} />
                <CardContent>{content}</CardContent>
            </Card>
        );
    }, [
        disenroll,
        eventItem,
        form,
        formError,
        isEnrolled,
        isLoggedIn,
        lowerSeparatorStyle,
        isRequestRunning,
        updateEventEnrollmentComment,
        updateForm,
        updateFormError,
    ]);
    // TODO: extract to separate component
    const renderedCheckInForm = React.useMemo(() => {
        const eventStart: Date = eventItem[IEventItemKeys.eventStart];
        const eventEnd: Date = eventItem[IEventItemKeys.eventEnd];
        const now: Date = new Date();

        if (!isLoggedIn || !isEnrolled || now < eventStart || eventEnd < now) {
            return null;
        }

        return (
            <>
                <div style={lowerSeparatorStyle} />
                <Card>
                    <CardHeader title={Dict.event_checkIn} />
                    <CardContent>
                        <Grid style={gridHorizontalStyle}>
                            <PublicMediaUsageConsentCheckbox
                                checked={
                                    !!form[
                                        IEventEnrollmentKeys
                                            .eventEnrollmentPublicMediaUsageConsent
                                    ]
                                }
                                errorMessage={
                                    formError[
                                        IEventEnrollmentKeys
                                            .eventEnrollmentPublicMediaUsageConsent
                                    ]
                                }
                                onBlur={
                                    isCheckedIn
                                        ? updateEventEnrollmentPublicMediaUsageConsent
                                        : () => {}
                                }
                                onUpdateValue={updateForm}
                            />
                        </Grid>

                        <div style={lowerSeparatorStyle} />

                        <SubmitButton
                            disabled={isCheckedIn}
                            label={Dict.event_checkIn}
                            onClick={checkIn}
                        />
                    </CardContent>
                </Card>
            </>
        );
    }, [
        checkIn,
        eventItem,
        form,
        formError,
        isCheckedIn,
        isEnrolled,
        isLoggedIn,
        lowerSeparatorStyle,
        updateEventEnrollmentPublicMediaUsageConsent,
        updateForm,
    ]);
    const renderedForm = React.useMemo(() => {
        const registrationStateTypographyStyle: React.CSSProperties = {
            ...contentIndentationStyle,
            color: !isEnrolled
                ? CustomTheme.COLOR_FAILURE
                : !isCheckedIn
                ? CustomTheme.COLOR_SECONDARY
                : CustomTheme.COLOR_SUCCESS,
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
                    {!isEnrolled
                        ? Dict.event_user_enrollment_state_enrolled_not
                        : !isCheckedIn
                        ? Dict.event_user_enrollment_state_enrolled
                        : Dict.event_user_enrollment_state_checked_in}
                </Typography>

                <hr />

                {renderedEnrollmentForm}

                {renderedCheckInForm}

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
        enroll,
        eventItem,
        isCheckedIn,
        isEnrolled,
        lowerSeparatorStyle,
        preWrapStyle,
        renderedCheckInForm,
        renderedEnrollmentForm,
        showEnrollmentConfirmationDialog,
    ]);

    return notice ? renderedNotice : renderedForm;
};

export default withTheme(EventEnrollmentForm);

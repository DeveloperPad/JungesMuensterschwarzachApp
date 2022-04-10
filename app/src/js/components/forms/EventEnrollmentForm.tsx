import * as React from "react";

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
import { LogTags } from "../../constants/log-tags";
import log from "loglevel";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

type IEventEnrollmentFormProps = WithTheme & {
    eventItem: IEventItem;
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
    const { eventItem, refetchEventItem, theme } = props;
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
    const [
        showEnrollmentConfirmationDialog,
        setShowEnrollmentConfirmationDialog,
    ] = useState<boolean>(false);
    const [notice, setNotice] = useState<INotice>({
        message: Dict.label_wait,
        type: Dict.label_loading,
    });
    const [form, setForm] = useState<IForm>({
        [IEventEnrollmentKeys.eventEnrollmentComment]: "",
    });
    const [formError, setFormError] = useState<IFormError>({
        [IEventEnrollmentKeys.eventEnrollmentComment]: null,
    });

    const fetchedForm = useRef<IForm>();
    const fetchEventEnrollmentDataRequest =
        useRef<FetchEventEnrollmentDataRequest>();
    const enrollEventDataRequest = useRef<EnrollEventDataRequest>();
    const updateEventEnrollmentCommentDataRequest =
        useRef<UpdateEventEnrollmentCommentDataRequest>();
    const disenrollEventDataRequest = useRef<DisenrollEventDataRequest>();
    const navigate = useNavigate();

    const contentIndentationStyle: React.CSSProperties = {
        marginLeft: 2 * theme.spacing(),
    };
    const lowerSeparatorStyle: React.CSSProperties = {
        height: theme.spacing(),
    };
    const preWrapStyle: React.CSSProperties = {
        whiteSpace: "pre-wrap",
    };

    const updateForm = React.useCallback((key: IFormKeys, value: string): void => {
        setForm((form) => ({
            ...form,
            [key]: value
        }));
    }, []);
    const updateFormError = React.useCallback((key: IFormKeys, value: string | null): void => {
        setFormError((formError) => ({
            ...formError,
            [key]: value
        }));
    }, []);
    const fetchEventEnrollment = (): void => {
        if (!isLoggedIn) {
            return;
        }

        fetchEventEnrollmentDataRequest.current =
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
                        setFormError({
                            [IEventEnrollmentKeys.eventEnrollmentComment]: null,
                        });
                        setIsEnrolled(enrolled);
                        setNotice(null);
                    }
                    fetchEventEnrollmentDataRequest.current = null;
                },
                () => {
                    setNotice({
                        message: Dict.error_message_try_later,
                        type: Dict.error_type_network,
                    });
                    fetchEventEnrollmentDataRequest.current = null;
                }
            );
        fetchEventEnrollmentDataRequest.current.execute();
        refetchEventItem();
    };
    const enroll = (): void => {
        if (!isLoggedIn || isEnrolled) {
            return;
        }

        enrollEventDataRequest.current = new EnrollEventDataRequest(
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
                        setFormError({
                            [IEventEnrollmentKeys.eventEnrollmentComment]:
                                Dict[errorMsg] ?? errorMsg,
                        });
                        setNotice(null);
                    } else if (
                        errorMsg ===
                        "event_user_enrollment_missing_account_data"
                    ) {
                        // TODO: replace with DictKeys from commons
                        navigate(AppUrls.PROFILE);
                        showNotification(errorMsg);
                    } else {
                        setFormError({
                            [IEventEnrollmentKeys.eventEnrollmentComment]: null,
                        });
                        setNotice(null);
                        showNotification(errorMsg);
                    }
                } else {
                    setFormError({
                        [IEventEnrollmentKeys.eventEnrollmentComment]: null,
                    });
                    setNotice(null);
                    fetchEventEnrollment();
                }
                enrollEventDataRequest.current = null;
            },
            () => {
                setNotice({
                    message: Dict.error_message_try_later,
                    type: Dict.error_type_network,
                });
                enrollEventDataRequest.current = null;
            }
        );
        enrollEventDataRequest.current.execute();
        setShowEnrollmentConfirmationDialog(false);
    };
    const updateEventEnrollmentData = (key: IFormKeys, value: string): void => {
        if (
            !isLoggedIn ||
            !isEnrolled ||
            !fetchedForm.current ||
            fetchedForm.current[key] === value ||
            formError[key]
        ) {
            return;
        }

        updateEventEnrollmentCommentDataRequest.current =
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
                            setFormError({
                                [IEventEnrollmentKeys.eventEnrollmentComment]:
                                    Dict.hasOwnProperty(errorMsg)
                                        ? Dict[errorMsg]
                                        : errorMsg,
                            });
                            setNotice(null);
                        } else {
                            setFormError({
                                [key]: null,
                            });
                            setNotice(null);
                            showNotification(errorMsg);
                        }
                    } else {
                        setFormError({
                            [key]: null,
                        });
                        setNotice(null);
                        showNotification(successMsg);
                    }
                    updateEventEnrollmentCommentDataRequest.current = null;
                },
                () => {
                    setNotice({
                        message: Dict.error_message_try_later,
                        type: Dict.error_type_network,
                    });
                    updateEventEnrollmentCommentDataRequest.current = null;
                }
            );
        updateEventEnrollmentCommentDataRequest.current.execute();
    };
    const disenroll = (): void => {
        if (!isLoggedIn || !isEnrolled) {
            return;
        }

        disenrollEventDataRequest.current = new DisenrollEventDataRequest(
            eventItem[IEventItemKeys.eventId],
            (response: IResponse) => {
                const errorMsg = response.errorMsg;

                if (errorMsg) {
                    setFormError({
                        [IEventEnrollmentKeys.eventEnrollmentComment]: null,
                    });
                    setNotice(null);
                    showNotification(errorMsg);
                } else {
                    setFormError({
                        [IEventEnrollmentKeys.eventEnrollmentComment]: null,
                    });
                    setNotice(null);
                    fetchEventEnrollment();
                }
                disenrollEventDataRequest.current = null;
            },
            () => {
                setNotice({
                    message: Dict.error_message_try_later,
                    type: Dict.error_type_network,
                });
                disenrollEventDataRequest.current = null;
            }
        );
        disenrollEventDataRequest.current.execute();
    };

    CookieService.get<number>(IUserKeys.accessLevel)
        .then((accessLevel) => {
            if (accessLevel) {
                setIsLoggedIn(true);
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

    useEffect(() => {
        return () => {
            if (fetchEventEnrollmentDataRequest.current) {
                fetchEventEnrollmentDataRequest.current.cancel();
            }

            if (enrollEventDataRequest.current) {
                enrollEventDataRequest.current.cancel();
            }

            if (updateEventEnrollmentCommentDataRequest.current) {
                updateEventEnrollmentCommentDataRequest.current.cancel();
            }

            if (disenrollEventDataRequest.current) {
                disenrollEventDataRequest.current.cancel();
            }
        };
    });

    if (notice) {
        return (
            <Card>
                <CardHeader title={Dict[notice.type] ?? notice.type} />
                <CardContent>
                    <Typography>
                        {Dict[notice.message] ?? notice.message}
                    </Typography>
                </CardContent>
            </Card>
        );
    } else {
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
    }
};

export default withTheme(EventEnrollmentForm);

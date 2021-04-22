import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import {
    Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Typography, withTheme, WithTheme
} from '@material-ui/core';

import Dict from '../../constants/dict';
import Formats from '../../constants/formats';
import { formatDate } from '../../constants/global-functions';
import { AppUrls } from '../../constants/specific-urls';
import { CustomTheme, grid1Style, gridHorizontalStyle } from '../../constants/theme';
import { IUserKeys } from '../../networking/account_data/IUser';
import { DisenrollEventDataRequest } from '../../networking/events/DisenrollEventDataRequest';
import { EnrollEventDataRequest } from '../../networking/events/EnrollEventDataRequest';
import {
    FetchEventEnrollmentDataRequest, IFetchEventEnrollmentDataResponse
} from '../../networking/events/FetchEventEnrollmentDataRequest';
import { IEventEnrollmentKeys } from '../../networking/events/IEventEnrollment';
import IEventItem, { IEventItemKeys } from '../../networking/events/IEventItem';
import {
    UpdateEventEnrollmentCommentDataRequest
} from '../../networking/events/UpdateEventEnrollmentCommentDataRequest';
import INotice from '../../networking/INotice';
import { IResponse } from '../../networking/Request';
import { CookieService } from '../../services/CookieService';
import EventEnrollmentCommentInput from '../form_elements/EventEnrollmentCommentInput';
import SubmitButton from '../form_elements/SubmitButton';
import Grid from '../utilities/Grid';
import { showNotification } from '../utilities/Notifier';
import { LogTags } from '../../constants/log-tags';
import log from 'loglevel';

type IEventEnrollmentFormProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    eventItem: IEventItem;
    refetchEventItem: () => void;
}

interface IEventEnrollmentFormState {
    fetchedForm: IForm | null;
    form: IForm;
    formError: IFormError;
    isEnrolled: boolean;
    isLoggedIn: boolean;
    notice: INotice | null;
    showEnrollmentConfirmationDialog: boolean;
}

type IFormKeys =
    IEventEnrollmentKeys.eventEnrollmentComment;

interface IForm {
    [IEventEnrollmentKeys.eventEnrollmentComment]: string;
}

interface IFormError {
    [IEventEnrollmentKeys.eventEnrollmentComment]: string | null;
}

class EventEnrollmentForm extends React.PureComponent<IEventEnrollmentFormProps, IEventEnrollmentFormState> {

    private fetchEventEnrollmentDataRequest: FetchEventEnrollmentDataRequest | null;
    private enrollEventDataRequest: EnrollEventDataRequest | null;
    private updateEventEnrollmentCommentDataRequest: UpdateEventEnrollmentCommentDataRequest | null;
    private disenrollEventDataRequest: DisenrollEventDataRequest | null;

    private contentIndentationStyle: React.CSSProperties = {
        marginLeft: 2 * this.props.theme.spacing()
    }
    private lowerSeparatorStyle: React.CSSProperties = {
        height: this.props.theme.spacing()
    };

    constructor(props: IEventEnrollmentFormProps) {
        super(props);

        this.state = {
            fetchedForm: null,
            form: {
                [IEventEnrollmentKeys.eventEnrollmentComment]: ""
            },
            formError: {
                [IEventEnrollmentKeys.eventEnrollmentComment]: null
            },
            isEnrolled: false,
            isLoggedIn: false,
            notice: {
                message: Dict.label_wait,
                type: Dict.label_loading
            },
            showEnrollmentConfirmationDialog: false
        }
    }

    public componentDidMount() {
        CookieService.get<number>(IUserKeys.accessLevel)
            .then(accessLevel => {
                if (accessLevel) {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            isLoggedIn: true
                        };
                    });
                    this.fetchEventEnrollment();
                } else {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            notice: null
                        }
                    });
                }
            })
            .catch(error => {
                log.warn(LogTags.STORAGE_MANAGER + "accessLevel could not be loaded: " + error);
                this.props.history.push(
                    AppUrls.LOGOUT
                );
            });
    }

    public componentWillUnmount(): void {
        if (this.fetchEventEnrollmentDataRequest) {
            this.fetchEventEnrollmentDataRequest.cancel();
        }

        if (this.enrollEventDataRequest) {
            this.enrollEventDataRequest.cancel();
        }

        if (this.updateEventEnrollmentCommentDataRequest) {
            this.updateEventEnrollmentCommentDataRequest.cancel();
        }

        if (this.disenrollEventDataRequest) {
            this.disenrollEventDataRequest.cancel();
        }
    }

    public updateForm = (key: IFormKeys, value: string): void => {
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
        const enrollmentStart: Date = this.props.eventItem[IEventItemKeys.eventEnrollmentStart];
        const enrollmentEnd: Date = this.props.eventItem[IEventItemKeys.eventEnrollmentEnd];
        const now: Date = new Date();

        const content = !this.state.isLoggedIn ? (
            <Typography>
                {Dict.error_message_account_required}
            </Typography>
        ) : now < enrollmentStart ? (
            <Typography>
                {this.state.isEnrolled ? Dict.event_user_disenrollment_too_early : Dict.event_user_enrollment_too_early}
            </Typography>
        ) : enrollmentEnd < now ? (
            <Typography>
                {this.state.isEnrolled ? Dict.event_user_disenrollment_too_late : Dict.event_user_enrollment_too_late}
            </Typography>
        ) : (
            <>
                <Grid style={gridHorizontalStyle}>
                    <EventEnrollmentCommentInput
                        errorMessage={this.state.formError[IEventEnrollmentKeys.eventEnrollmentComment]}
                        onBlur={this.updateEventEnrollmentData}
                        onError={this.updateFormError}
                        onUpdateValue={this.updateForm}
                        style={grid1Style}
                        value={this.state.form[IEventEnrollmentKeys.eventEnrollmentComment]}
                    />
                </Grid>

                <div style={this.lowerSeparatorStyle} />

                <SubmitButton
                    label={this.state.isEnrolled ? Dict.event_disenroll : Dict.event_enroll}
                    onClick={this.state.isEnrolled ? this.disenroll.bind(this) : this.showConfirmationDialog.bind(this, true)}
                />
            </>
        );
        const registrationStateTypographyStyle: React.CSSProperties = {
            ...this.contentIndentationStyle,
            color: this.state.isEnrolled ? CustomTheme.COLOR_SUCCESS : CustomTheme.COLOR_FAILURE
        }

        return (
            <>
                <Typography
                    variant="body1">
                    {Dict.event_eventEnrollmentStart}
                </Typography>
                <Typography
                    style={this.contentIndentationStyle}
                >
                    {formatDate(this.props.eventItem[IEventItemKeys.eventEnrollmentStart], Formats.DATE.DATETIME_LOCAL)}
                </Typography>

                <div style={this.lowerSeparatorStyle} />

                <Typography
                    variant="body1">
                    {Dict.event_eventEnrollmentEnd}
                </Typography>
                <Typography
                    style={this.contentIndentationStyle}
                >
                    {formatDate(this.props.eventItem[IEventItemKeys.eventEnrollmentEnd], Formats.DATE.DATETIME_LOCAL)}
                </Typography>

                <div style={this.lowerSeparatorStyle} />

                <Typography
                    variant="body1">
                    {Dict.event_user_enrollment_state}
                </Typography>
                <Typography
                    style={registrationStateTypographyStyle}
                >
                    {this.state.isEnrolled ? Dict.event_user_enrollment_state_enrolled : Dict.event_user_enrollment_state_enrolled_not}
                </Typography>

                <hr />

                <Card>
                    <CardHeader title={Dict.event_eventEnrollment} />
                    <CardContent>
                        {content}
                    </CardContent>
                </Card>

                <Dialog
                    onClose={this.showConfirmationDialog.bind(this, false)}
                    open={this.state.showEnrollmentConfirmationDialog}
                    style={preWrapStyle}
                >
                    <DialogTitle>{Dict.event_user_enrollment_confirmation_title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText style={preWrapStyle}>
                            {Dict.event_user_enrollment_confirmation_message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.showConfirmationDialog.bind(this, false)} color="primary">{Dict.label_cancel}</Button>
                        <Button onClick={this.enroll} color="primary">{Dict.label_confirm}</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }


    /* - fetch - */

    private fetchEventEnrollment = (): void => {
        if (!this.state.isLoggedIn) {
            return;
        }

        this.fetchEventEnrollmentDataRequest = new FetchEventEnrollmentDataRequest(
            this.props.eventItem[IEventItemKeys.eventId],
            (response: IFetchEventEnrollmentDataResponse) => {
                const errorMsg = response.errorMsg;

                if (errorMsg) {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            notice: {
                                message: errorMsg,
                                type: Dict.error_type_account
                            }
                        }
                    });
                } else {
                    let comment = "";
                    let isEnrolled = false;

                    const eventEnrollment = response.eventEnrollment;
                    if (eventEnrollment) {
                        isEnrolled = true;
                        const eventEnrollmentComment = 
                            eventEnrollment[IEventEnrollmentKeys.eventEnrollmentComment];
                        
                        if (eventEnrollmentComment) {
                            comment = eventEnrollmentComment;
                        }
                    }

                    const fetchedForm: IForm = {
                        [IEventEnrollmentKeys.eventEnrollmentComment]: comment
                    };

                    this.setState(prevState => {
                        return {
                            ...prevState,
                            fetchedForm,
                            form: fetchedForm,
                            formError: {
                                [IEventEnrollmentKeys.eventEnrollmentComment]: null
                            },
                            isEnrolled,
                            notice: null
                        }
                    });
                }
                this.fetchEventEnrollmentDataRequest = null;
            },
            () => {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        notice: {
                            message: Dict.error_message_try_later,
                            type: Dict.error_type_network
                        }
                    }
                });
                this.fetchEventEnrollmentDataRequest = null;
            }
        );
        this.fetchEventEnrollmentDataRequest.execute();

        this.props.refetchEventItem();
    }

    /* - enroll - */

    private showConfirmationDialog = (visible: boolean): void => {
        this.setState(prevState => {
            return {
                ...prevState,
                showEnrollmentConfirmationDialog: visible
            }
        });
    }

    private enroll = (): void => {
        if (!this.state.isLoggedIn || this.state.isEnrolled) {
            return;
        }

        this.enrollEventDataRequest = new EnrollEventDataRequest(
            this.props.eventItem[IEventItemKeys.eventId],
            this.state.form[IEventEnrollmentKeys.eventEnrollmentComment],
            (response: IResponse) => {
                const errorMsg = response.errorMsg;

                if (errorMsg) {
                    if (errorMsg.indexOf(IEventEnrollmentKeys.eventEnrollmentComment) > -1) {
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                formError: {
                                    [IEventEnrollmentKeys.eventEnrollmentComment]: Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg
                                },
                                notice: null
                            }
                        });
                    } else if (errorMsg === "event_user_enrollment_missing_account_data") {
                        // TODO: replace with DictKeys from commons
                        this.props.history.push(
                            AppUrls.PROFILE
                        );
                        showNotification(errorMsg);
                    } else {
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                formError: {
                                    [IEventEnrollmentKeys.eventEnrollmentComment]: null
                                },
                                notice: null
                            }
                        });
                        showNotification(errorMsg);
                    }
                } else {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            formError: {
                                [IEventEnrollmentKeys.eventEnrollmentComment]: null
                            },
                            notice: null
                        }
                    });

                    this.fetchEventEnrollment();
                }
                this.enrollEventDataRequest = null;
            },
            () => {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        notice: {
                            message: Dict.error_message_try_later,
                            type: Dict.error_type_network
                        }
                    }
                });
                this.enrollEventDataRequest = null;
            }
        );
        this.enrollEventDataRequest.execute();
        this.showConfirmationDialog(false);
    }


    /* - update - */

    private updateEventEnrollmentData = (key: IFormKeys, value: string): void => {
        if (!this.state.isLoggedIn
            || !this.state.isEnrolled
            || !this.state.fetchedForm
            || this.state.fetchedForm[key] === value
            || this.state.formError[key]) {
            return;
        }

        this.updateEventEnrollmentCommentDataRequest = new UpdateEventEnrollmentCommentDataRequest(
            this.props.eventItem[IEventItemKeys.eventId],
            value,
            (response: IResponse) => {
                const errorMsg = response.errorMsg;
                const successMsg = response.successMsg;

                if (errorMsg) {
                    if (errorMsg.indexOf(IEventEnrollmentKeys.eventEnrollmentComment) > -1) {
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                formError: {
                                    [IEventEnrollmentKeys.eventEnrollmentComment]: Dict.hasOwnProperty(errorMsg) ? Dict[errorMsg] : errorMsg
                                },
                                notice: null
                            }
                        });
                    } else {
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                formError: {
                                    [key]: null
                                },
                                notice: null
                            }
                        });
                        showNotification(errorMsg);
                    }
                } else {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            formError: {
                                [key]: null
                            },
                            notice: null
                        }
                    });
                    showNotification(successMsg);
                }
                this.updateEventEnrollmentCommentDataRequest = null;
            },
            () => {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        notice: {
                            message: Dict.error_message_try_later,
                            type: Dict.error_type_network
                        }
                    }
                });
                this.updateEventEnrollmentCommentDataRequest = null;
            }
        );
        this.updateEventEnrollmentCommentDataRequest.execute();
    }

    /* - disenroll - */

    private disenroll = (): void => {
        if (!this.state.isLoggedIn || !this.state.isEnrolled) {
            return;
        }

        this.disenrollEventDataRequest = new DisenrollEventDataRequest(
            this.props.eventItem[IEventItemKeys.eventId],
            (response: IResponse) => {
                const errorMsg = response.errorMsg;

                if (errorMsg) {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            formError: {
                                [IEventEnrollmentKeys.eventEnrollmentComment]: null
                            },
                            notice: null
                        }
                    });
                    showNotification(errorMsg);
                } else {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            formError: {
                                [IEventEnrollmentKeys.eventEnrollmentComment]: null
                            },
                            notice: null
                        }
                    });
                    this.fetchEventEnrollment();
                }
                this.disenrollEventDataRequest = null;
            },
            () => {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        notice: {
                            message: Dict.error_message_try_later,
                            type: Dict.error_type_network
                        }
                    }
                });
                this.disenrollEventDataRequest = null;
            }
        );
        this.disenrollEventDataRequest.execute();
    }

}

export default withTheme(withRouter(EventEnrollmentForm));

const preWrapStyle: React.CSSProperties = {
    whiteSpace: "pre-wrap"
}
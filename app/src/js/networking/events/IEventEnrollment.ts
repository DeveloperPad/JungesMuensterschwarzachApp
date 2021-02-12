// this enum defines the event enrollment keys
export enum IEventEnrollmentKeys {
    eventEnrollmentComment = "eventEnrollmentComment"
}

// this interface defines the user object's structure and value types
export default interface IEventEnrollment {
    [IEventEnrollmentKeys.eventEnrollmentComment]: string;
}

export interface IEventEnrollmentError {
    [IEventEnrollmentKeys.eventEnrollmentComment]: string | null;
}
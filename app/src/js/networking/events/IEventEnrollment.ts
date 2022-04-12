// this enum defines the event enrollment keys
export enum IEventEnrollmentKeys {
    eventEnrollmentComment = "eventEnrollmentComment",
    eventEnrollmentPublicMediaUsageConsent = "eventEnrollmentPublicMediaUsageConsent"
}

// this interface defines the user object's structure and value types
export default interface IEventEnrollment {
    [IEventEnrollmentKeys.eventEnrollmentComment]: string;
    [IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent]: string;
}

export interface IEventEnrollmentError {
    [IEventEnrollmentKeys.eventEnrollmentComment]: string | null;
    [IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent]: string | null;
}
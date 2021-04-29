import Dict from "../../constants/dict"

// this enum defines the user object's keys
export enum IUserKeys {
    accessIdentifier = "accessIdentifier",
    accessLevel = "accessLevel",
    allowNewsletter = "allowNewsletter",
    allowPost = "allowPost",
    birthdate = "birthdate",
    city = "city",
    country = "country",
    displayName = "displayName",
    eMailAddress = "eMailAddress",
    eatingHabits = "eatingHabits",
    firstName = "firstName",
    houseNumber = "houseNumber",
    supplementaryAddress = "supplementaryAddress",
    lastName = "lastName",
    password = "password",
    passwordRepetition = "passwordRepetition", // fake user data property for client side repetition verification
    phoneNumber = "phoneNumber",
    streetName = "streetName",
    userId = "userId",
    zipCode = "zipCode"
}

// this constant defines specific values of some user object keys
export const IUserValues = {
    [IUserKeys.accessLevel]: {
        course_instructor: 3,
        course_leader: 4,
        developer: 5,
        editor: 2,
        guest: 0,
        user: 1
    },
    [IUserKeys.accessIdentifier]: {
        5: Dict.account_accessLevel_developer,
        4: Dict.account_accessLevel_courseLeader,
        3: Dict.account_accessLevel_courseInstructor,
        2: Dict.account_accessLevel_editor,
        1: Dict.account_accessLevel_user,
        0: Dict.account_accessLevel_guest
    }
}

// this interface defines the user object's structure and value types
export default interface IUser {
    [IUserKeys.accessIdentifier]?: string,
    [IUserKeys.accessLevel]?: number;
    [IUserKeys.allowNewsletter]?: number;
    [IUserKeys.allowPost]?: number;
    [IUserKeys.birthdate]?: Date;
    [IUserKeys.city]?: string;
    [IUserKeys.country]?: string;
    [IUserKeys.displayName]?: string;
    [IUserKeys.eMailAddress]?: string;
    [IUserKeys.eatingHabits]?: string;
    [IUserKeys.firstName]?: string;
    [IUserKeys.houseNumber]?: string;
    [IUserKeys.supplementaryAddress]?: string;
    [IUserKeys.lastName]?: string;
    [IUserKeys.password]?: string;
    [IUserKeys.passwordRepetition]?: string;
    [IUserKeys.phoneNumber]?: string;
    [IUserKeys.streetName]?: string;
    [IUserKeys.userId]?: number;
    [IUserKeys.zipCode]?: string;
}

export type IUserValuesType = string | number | Date | null

// this interface defines an error object for the user object
export interface IUserError {
    [IUserKeys.accessIdentifier]?: string | null;
    [IUserKeys.accessLevel]?: string | null;
    [IUserKeys.allowNewsletter]?: string | null;
    [IUserKeys.allowPost]?: string | null;
    [IUserKeys.birthdate]?: string | null;
    [IUserKeys.city]?: string | null;
    [IUserKeys.country]?: string | null;
    [IUserKeys.displayName]?: string | null;
    [IUserKeys.eMailAddress]?: string | null;
    [IUserKeys.eatingHabits]?: string | null;
    [IUserKeys.firstName]?: string | null;
    [IUserKeys.houseNumber]?: string | null;
    [IUserKeys.supplementaryAddress]?: string | null;
    [IUserKeys.lastName]?: string | null;
    [IUserKeys.password]?: string | null;
    [IUserKeys.passwordRepetition]?: string | null;
    [IUserKeys.phoneNumber]?: string | null;
    [IUserKeys.streetName]?: string | null;
    [IUserKeys.userId]?: string | null;
    [IUserKeys.zipCode]?: string | null;
}
import { OkPacket } from 'mysql2/promise';

export function isNoRowDataPacket(arg: any): arg is OkPacket | OkPacket[] {
    return arg.forEach === null || arg.map === null || arg.length === null;
}
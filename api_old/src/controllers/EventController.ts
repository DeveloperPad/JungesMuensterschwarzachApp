import { classToPlain, plainToClass } from 'class-transformer';
import { AccountDataPublic } from 'models/AccountDataPublic';
import { DictionaryKeys } from 'models/DictionaryKeys';
import { Error } from 'models/Error';
import { Event } from 'models/Event';
import { EventArrival } from 'models/EventArrival';
import { EventLocation } from 'models/EventLocation';
import { EventOffer } from 'models/EventOffer';
import { EventPackingList } from 'models/EventPackingList';
import { EventPrice } from 'models/EventPrice';
import { EventSchedule } from 'models/EventSchedule';
import { EventTargetGroup } from 'models/EventTargetGroup';
import { Image } from 'models/Image';
import { RowDataPacket } from 'mysql2';
import { AccessLevelController } from 'src/controllers/AccessLevelController';
import { DatabaseController } from 'src/controllers/DatabaseController';
import { EventArrivalController } from 'src/controllers/EventArrivalController';
import { EventLocationController } from 'src/controllers/EventLocationController';
import { EventOfferController } from 'src/controllers/EventOfferController';
import { EventPackingListController } from 'src/controllers/EventPackingListController';
import { EventPriceController } from 'src/controllers/EventPriceController';
import { EventScheduleController } from 'src/controllers/EventScheduleController';
import { EventTargetGroupController } from 'src/controllers/EventTargetGroupController';
import { cleanOptions } from 'src/utilities/ClassTransformerFills';
import { isNoRowDataPacket } from 'src/utilities/TypeScriptChecks';
import { DateUtils } from 'utilities/DateUtils';

export class EventController {

    private static TITLE_LENGTH_MAX = 100;
    private static TOPIC_LENGTH_MAX = 100;
    private static DETAILS_LENGTH_MAX = 65535;


    // C

    public static async create(event: Event): Promise<Event> {
        return this.validate(event, false).then(
            _ => this.createDB(event)
        );
    }

    private static async createDB(event: Event): Promise<Event> {
        const plainEvent: any = classToPlain(event, cleanOptions);
        const [rows, fields] = await DatabaseController.getPool().execute(
            "INSERT INTO events ( \
                eventTitle, eventTopic, eventDetails, \
                eventStart, eventEnd, \
                eventEnrollmentStart, eventEnrollmentEnd, \
                eventOfferId, eventScheduleId, \
                eventTargetGroupId, eventPriceId, \
                eventPackingListId, eventLocationId, \
                eventArrivalId, requiredAccessLevel \
             ) VALUES( \
                 ?, ?, ?, \
                 ?, ?, \
                 ?, ?, \
                 ?, ?, \
                 ?, ?, \
                 ?, ?, \
                 ?, ? \
             )",
            [
                plainEvent.eventTitle, plainEvent.eventTopic, plainEvent.eventDetails,
                plainEvent.eventStart, plainEvent.eventEnd,
                plainEvent.eventEnrollmentStart, plainEvent.eventEnrollmentEnd,
                plainEvent.eventOffer.eventOfferId, plainEvent.eventSchedule.eventScheduleId,
                plainEvent.eventTargetGroup.eventTargetGroupId, plainEvent.eventPrice.eventPriceId,
                plainEvent.eventPackingList.eventPackingListId, plainEvent.eventLocation.eventLocationId,
                plainEvent.eventArrival.eventArrivalId, plainEvent.requiredAccessLevel
            ]
        );

        if (!('insertId' in rows)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.event_eventId_invalid
            ));
        }

        return this.getById(rows.insertId);
    }


    // R

    public static async getAll(): Promise<Event[]> {
        const [
            [eventRows, eventFields],
            [eventImageRows, eventImageFields],
            [eventUserRows, eventUserFields]
        ] = await Promise.all([
            DatabaseController.getPool().query(
                "SELECT * \
                FROM   events e, \
                        event_offers eo, \
                        event_schedules es, \
                        event_target_groups etg, \
                        event_prices ep, \
                        event_packing_lists epl, \
                        event_locations el, \
                        event_arrivals ea \
                WHERE  eo.eventOfferId = e.eventOfferId AND \
                        es.eventScheduleId = e.eventScheduleId AND \
                        etg.eventTargetGroupId = e.eventTargetGroupId AND \
                        ep.eventPriceId = e.eventPriceId AND \
                        epl.eventPackingListId = e.eventPackingListId AND \
                        el.eventLocationId = e.eventLocationId AND \
                        ea.eventArrivalId = e.eventArrivalId \
                ORDER BY e.eventId ASC"
            ),
            DatabaseController.getPool().query(
                "SELECT ei.eventId, \
                        ei.imageId, \
                        il.path \
                FROM   event_images ei, \
                        image_library il \
                WHERE  ei.imageId = il.imageId \
                ORDER BY ei.eventId ASC, ei.imageId ASC"
            ),
            DatabaseController.getPool().query(
                "SELECT ee.eventId, \
                        ad.userId, \
                        ad.displayName \
                FROM    account_data ad, \
                        event_enrollments ee \
                WHERE   ad.userId = ee.userId \
                ORDER BY ad.displayName"
            )
        ]);

        // return empty event list, if one of the promises failed
        if (isNoRowDataPacket(eventUserRows) || isNoRowDataPacket(eventImageRows) || isNoRowDataPacket(eventRows)) {
            return Promise.resolve([]);
        }

        const eventUserMap = EventController.getEventUserMap(eventUserRows);
        const eventImageMap = EventController.getImageMap(eventImageRows);

        // merge all promises to one event object
        return Promise.resolve((eventRows as RowDataPacket[]).map((row: any) => {
            const event: Event = plainToClass(Event, row, cleanOptions);
            event.eventOffer = plainToClass(EventOffer, row, cleanOptions);
            event.eventSchedule = plainToClass(EventSchedule, row, cleanOptions);
            event.eventTargetGroup = plainToClass(EventTargetGroup, row, cleanOptions);
            event.eventPrice = plainToClass(EventPrice, row, cleanOptions);
            event.eventPackingList = plainToClass(EventPackingList, row, cleanOptions);
            event.eventLocation = plainToClass(EventLocation, row, cleanOptions);
            event.eventArrival = plainToClass(EventArrival, row, cleanOptions);
            event.images = eventImageMap.get(event.eventId) || [];
            event.participants = eventUserMap.get(event.eventId) || [];
            return event;
        }));
    }

    public static async getById(id: number): Promise<Event> {
        return this.validateId(id).then(
            _ => this.getByIdDB(id)
        );
    }

    private static async getByIdDB(id: number): Promise<Event> {
        const [
            [eventRows, eventFields],
            [eventImageRows, eventImageFields],
            [eventUserRows, eventUserFields]
        ] = await Promise.all([
            DatabaseController.getPool().execute(
                "SELECT * \
                 FROM   events e, \
                        event_offers eo, \
                        event_schedules es, \
                        event_target_groups etg, \
                        event_prices ep, \
                        event_packing_lists epl, \
                        event_locations el, \
                        event_arrivals ea \
                 WHERE  e.eventId = ? AND \
                        eo.eventOfferId = e.eventOfferId AND \
                        es.eventScheduleId = e.eventScheduleId AND \
                        etg.eventTargetGroupId = e.eventTargetGroupId AND \
                        ep.eventPriceId = e.eventPriceId AND \
                        epl.eventPackingListId = e.eventPackingListId AND \
                        el.eventLocationId = e.eventLocationId AND \
                        ea.eventArrivalId = e.eventArrivalId",
                [id]
            ),
            DatabaseController.getPool().execute(
                "SELECT ei.eventId, \
                        ei.imageId, \
                        il.path \
                 FROM   event_images ei, \
                        image_library il \
                 WHERE  ei.eventId = ? AND \
                        ei.imageId = il.imageId \
                 ORDER BY ei.eventId ASC, ei.imageId ASC",
                 [id]
            ),
            DatabaseController.getPool().execute(
                "SELECT ee.eventId, \
                        ad.userId, \
                        ad.displayName \
                 FROM   account_data ad, \
                        event_enrollments ee \
                 WHERE  ee.eventId = ? AND \
                        ad.userId = ee.userId \
                 ORDER BY ad.displayName",
                 [id]
            )
        ]);

        // throw exception, if one promise failed
        if (isNoRowDataPacket(eventUserRows) || isNoRowDataPacket(eventImageRows) || isNoRowDataPacket(eventRows)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.error_message_try_later
            ));
        }

        // throw exception, if no event found
        if (eventRows.length <= 0) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_server,
                DictionaryKeys.event_not_exists
            ));
        }

        const eventUserMap = EventController.getEventUserMap(eventUserRows);
        const eventImageMap = EventController.getImageMap(eventImageRows);

        // merge promises into one event
        const event = plainToClass(Event, eventRows[0], cleanOptions);
        event.eventOffer = plainToClass(EventOffer, eventRows[0], cleanOptions);
        event.eventSchedule = plainToClass(EventSchedule, eventRows[0], cleanOptions);
        event.eventTargetGroup = plainToClass(EventTargetGroup, eventRows[0], cleanOptions);
        event.eventPrice = plainToClass(EventPrice, eventRows[0], cleanOptions);
        event.eventPackingList = plainToClass(EventPackingList, eventRows[0], cleanOptions);
        event.eventLocation = plainToClass(EventLocation, eventRows[0], cleanOptions);
        event.eventArrival = plainToClass(EventArrival, eventRows[0], cleanOptions);
        event.images = eventImageMap.get(event.eventId) || [];
        event.participants = eventUserMap.get(event.eventId) || [];
        return Promise.resolve(event);
    }

    /**
     * Creates a Map from event to users.
     * 
     * @param eventUserRows user rows
     * @returns Map from event to users
     */
    private static getEventUserMap(eventUserRows: RowDataPacket[] | RowDataPacket[][]): Map<number, AccountDataPublic[]> {
        const eventUserMap: Map<number, AccountDataPublic[]> = new Map()

        eventUserRows.forEach((eventUserRow: any) => {
            const savedUserArray = eventUserMap.get(eventUserRow.eventId) || [];
            savedUserArray.push(
                plainToClass(AccountDataPublic, eventUserRow, cleanOptions)
            );

            eventUserMap.set(
                eventUserRow.eventId,
                savedUserArray
            );
        });

        return eventUserMap;
    }

    /**
     * Creates a Map from event to images.
     * 
     * @param eventImageRows image rows
     * @returns Map from event to images
     */
    private static getImageMap(eventImageRows: RowDataPacket[] | RowDataPacket[][]): Map<number, Image[]> {
        const eventImageMap: Map<number, Image[]> = new Map()

        eventImageRows.forEach((eventImageRow: any) => {
            const savedImageArray = eventImageMap.get(eventImageRow.eventId) || [];
            savedImageArray.push(
                plainToClass(Image, eventImageRow, cleanOptions)
            );

            eventImageMap.set(
                eventImageRow.eventId,
                savedImageArray
            );
        });

        return eventImageMap;
    }


    // U

    public static async update(event: Event): Promise<Event> {
        return this.validate(event).then(
            _ => this.updateDB(event)
        );
    }

    private static async updateDB(event: Event): Promise<Event> {
        const plainEvent: any = classToPlain(event, cleanOptions);
        const [rows, fields] = await DatabaseController.getPool().execute(
            "UPDATE events SET \
                eventTitle = ?, eventTopic = ?, eventDetails = ?, \
                eventStart = ?, eventEnd = ?, \
                eventEnrollmentStart = ?, eventEnrollmentEnd = ?, \
                eventOfferId = ?, eventScheduleId = ?, \
                eventTargetGroupId = ?, eventPriceId = ?, \
                eventPackingListId = ?, eventLocationId = ?, \
                eventArrivalId = ?, requiredAccessLevel = ? \
             WHERE eventId = ?",
            [
                plainEvent.eventTitle, plainEvent.eventTopic, plainEvent.eventDetails,
                plainEvent.eventStart, plainEvent.eventEnd,
                plainEvent.eventEnrollmentStart, plainEvent.eventEnrollmentEnd,
                plainEvent.eventOffer.eventOfferId, plainEvent.eventSchedule.eventScheduleId,
                plainEvent.eventTargetGroup.eventTargetGroupId, plainEvent.eventPrice.eventPriceId,
                plainEvent.eventPackingList.eventPackingListId, plainEvent.eventLocation.eventLocationId,
                plainEvent.eventArrival.eventArrivalId, plainEvent.requiredAccessLevel,
                plainEvent.eventId
            ]
        );

        return this.getById(event.eventId);
    }


    // D

    public static async delete(id: number): Promise<void> {
        return this.validateId(id).then(
            _ => this.deleteDB(id)
        );
    }

    public static async deleteDB(id: number): Promise<void> {
        return await DatabaseController.getPool().execute(
            "DELETE FROM events \
             WHERE eventId = ?",
             [id]
        ).then((_: any) =>
            Promise.resolve()
        ).catch((error: Error) =>
            Promise.reject(error)
        );
    }


    // Helpers

    public static async validate(event: Event, withId: boolean = true): Promise<void> {
        return this.validateId(event.eventId, withId)
            .then(_ => this.validateTitle(event.eventTitle))
            .then(_ => this.validateTopic(event.eventTopic))
            .then(_ => this.validateDetails(event.eventDetails))
            .then(_ => this.validateEventStartEnd(event))
            .then(_ => this.validateEventEnrollmentStartEnd(event))
            .then(_ => this.validateOffer(event.eventOffer))
            .then(_ => this.validateSchedule(event.eventSchedule))
            .then(_ => this.validateTargetGroup(event.eventTargetGroup))
            .then(_ => this.validatePrice(event.eventPrice))
            .then(_ => this.validatePackingList(event.eventPackingList))
            .then(_ => this.validateLocation(event.eventLocation))
            .then(_ => this.validateArrival(event.eventArrival))
            .then(_ => this.validateRequiredAccessLevel(event.requiredAccessLevel));
    }

    private static async validateId(id: number, withId: boolean = true): Promise<void> {
        return !withId && !id || id >= 0 ?
            Promise.resolve() : 
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventId_invalid
            ));
    }

    private static async validateTitle(title: string): Promise<void> {
        return !title
            || title.length <= 0
            || title.length > EventController.TITLE_LENGTH_MAX ?
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventTitle_invalid
            )) :
            Promise.resolve();
    }

    private static async validateTopic(topic: string): Promise<void> {
        return !topic
            || topic.length <= 0
            || topic.length > EventController.TOPIC_LENGTH_MAX ?
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventTopic_invalid
            )) :
            Promise.resolve();
    }

    private static async validateDetails(details: string): Promise<void> {
        return !details
            || details.length <= 0
            || details.length > EventController.DETAILS_LENGTH_MAX ?
            Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventDetails_invalid
            )) :
            Promise.resolve();
    }

    private static async validateEventStartEnd(event: Event): Promise<void> {
        if (!event.eventStart || !event.eventStart.isValid()) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventStart_malformed
            ));
        } else if (!event.eventEnd || !event.eventEnd.isValid()) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventEnd_malformed
            ));
        } else if (event.eventEnd.isBefore(event.eventStart)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventStartEnd_invalid
            ));
        } else {
            return Promise.resolve();
        }
    }

    private static async validateEventEnrollmentStartEnd(event: Event): Promise<void> {
        if (!event.eventEnrollmentStart || !event.eventEnrollmentStart.isValid()) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventEnrollmentStart_malformed
            ));
        } else if (!event.eventEnrollmentEnd || !event.eventEnrollmentEnd.isValid()) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventEnrollmentEnd_malformed
            ));
        } else if (event.eventEnrollmentEnd.isBefore(event.eventEnrollmentStart)) {
            return Promise.reject(new Error(
                DictionaryKeys.error_type_storage,
                DictionaryKeys.event_eventEnrollmentStartEnd_invalid
            ));
        } else {
            return Promise.resolve();
        }
    }

    private static async validateOffer(eventOffer: EventOffer): Promise<void> {
        return EventOfferController.getById(
            eventOffer !== undefined && eventOffer.eventOfferId !== undefined ? eventOffer.eventOfferId : -1
        ).then(_ => Promise.resolve());
    }

    private static async validateSchedule(eventSchedule: EventSchedule): Promise<void> {
        return EventScheduleController.getById(
            eventSchedule !== undefined && eventSchedule.eventScheduleId !== undefined ? eventSchedule.eventScheduleId : -1
        ).then(_ => Promise.resolve());
    }

    private static async validateTargetGroup(eventTargetGroup: EventTargetGroup): Promise<void> {
        return EventTargetGroupController.getById(
            eventTargetGroup !== undefined && eventTargetGroup.eventTargetGroupId !== undefined ? eventTargetGroup.eventTargetGroupId : -1
        ).then(_ => Promise.resolve());
    }

    private static async validatePrice(eventPrice: EventPrice): Promise<void> {
        return EventPriceController.getById(
            eventPrice !== undefined && eventPrice.eventPriceId !== undefined ? eventPrice.eventPriceId : -1
        ).then(_ => Promise.resolve());
    }

    private static async validatePackingList(eventPackingList: EventPackingList): Promise<void> {
        return EventPackingListController.getById(
            eventPackingList !== undefined && eventPackingList.eventPackingListId !== undefined ? eventPackingList.eventPackingListId : -1
        ).then(_ => Promise.resolve());
    }

    private static async validateLocation(eventLocation: EventLocation): Promise<void> {
        return EventLocationController.getById(
            eventLocation !== undefined && eventLocation.eventLocationId !== undefined ? eventLocation.eventLocationId : -1
        ).then(_ => Promise.resolve());
    }

    private static async validateArrival(eventArrival: EventArrival): Promise<void> {
        return EventArrivalController.getById(
            eventArrival !== undefined && eventArrival.eventArrivalId !== undefined ? eventArrival.eventArrivalId : -1
        ).then(_ => Promise.resolve());
    }

    private static async validateRequiredAccessLevel(accessLevel: number): Promise<void> {
        return AccessLevelController.getByAccessLevel(accessLevel)
            .then(_ => Promise.resolve());
    }

}
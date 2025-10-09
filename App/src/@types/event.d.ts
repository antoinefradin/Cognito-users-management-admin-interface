// src/@types/enterprise.d.ts
export enum EventNameEnum {
    MODIFY = "MODIFY",
    INSERT = "INSERT",
    REMOVE = "REMOVE"
}

export enum EventTypeEnum {
    ENTERPRISE_CREATED = "ENTERPRISE_CREATED",
    ENTERPRISE_DELETED = "ENTERPRISE_DELETED",
    ENTERPRISE_UPDATED = "ENTERPRISE_UPDATED",
    LICENSE_CREATED = "LICENSE_CREATED",
    LICENSE_DELETED = "LICENSE_DELETED",
    LICENSE_UPDATED = "LICENSE_UPDATED"
}

export enum EntityTypeEnum {
    ENTERPRISE = "ENTERPRISE",
    LICENSE = "LICENSE"
}



export type EventMeta = {
  id: string;
  eventDate: str;
  eventType: EventTypeEnum;
  userId: str;
  details?: dict;
};


export type GetEventsResponse = EventMeta[];

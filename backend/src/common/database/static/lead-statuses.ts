export enum LeadsStatusesId {
  new = 1,
  attemptedToContact = 2,
  open = 3,
  unqualified = 4,
  waiting = 5,
}

export enum LeadsStatusesCode {
  new = 'new',
  attemptedToContact = 'attemptedToContact',
  open = 'open',
  unqualified = 'unqualified',
  waiting = 'waiting',
}

export enum LeadsStatusesName {
  new = 'New',
  attemptedToContact = 'Attempted to contact',
  open = 'Open',
  unqualified = 'Unqualified',
  waiting = 'Waiting',
}

export const statusCodesArray = Object.values(LeadsStatusesCode);
export const statusNamesArray = Object.values(LeadsStatusesName);

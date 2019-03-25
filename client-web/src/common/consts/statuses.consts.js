export const TRANSACTION_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DENIED: 'DENIED',
  PROCESSING: 'PROCESSING',
  CANCELED: 'CANCELED',
  FINISHED: 'FINISHED'
};

export const EQUIPMENT_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  DELIVERING: 'DELIVERING',
  RENTING: 'RENTING',
  WAITING_FOR_RETURNING: 'WAITING_FOR_RETURNING'
};

export const EQUIPMENT_SHOWABLE_STATUSES = {
  AVAILABLE: 'Available',
  DELIVERING: 'Delivering',
  RENTING: 'Renting',
  WAITING_FOR_RETURNING: 'Wait for returning'
};

export const MATERIAL_TRANSACTION_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DENIED: 'DENIED',
  DELIVERING: 'DELIVERING',
  CANCELED: 'CANCELED',
  FINISHED: 'FINISHED'
};

export const DEBRIS_POST_STATUSES = {
  ACCEPTED: 'ACCEPTED',
  DELIVERING: 'DELIVERING',
  WORKING: 'WORKING',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED'
};

export const DEBRIS_POST_STATUS_COLORS = {
  ACCEPTED: 'primary',
  DELIVERING: 'warning',
  WORKING: 'warning',
  FINISHED: 'success',
  CANCELED: 'danger'
};

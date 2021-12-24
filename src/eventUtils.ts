import { VALUE_DATA_ATTRIBUTE } from './constants';

export function isEventTargetDay(event: { target: EventTarget }) {
  return (
    event.target instanceof HTMLElement &&
    !!event.target.getAttribute(VALUE_DATA_ATTRIBUTE)
  );
}

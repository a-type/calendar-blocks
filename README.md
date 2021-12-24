# 🗓🧱 calendar-blocks

```
yarn add calendar-blocks
```

Flexible, customizable React calendar / date-picker primitives.

- Compose your own Calendar UI easily with keyboard navigation
- Supports single-date and range selection
- Exposes internal state via context (write your own controls!)
- Highly in-depth attributes for full styling control

## A low-level library

Let's get off on the right foot - this isn't an out-of-the-box date picker. The functionality works with very little code, but it won't look pretty! On the flip side, since there's few assumptions about rendering, you've got full control. You don't even have to make it a grid if you don't want to.

So I can show you some 'basic' example code like this, which is mostly state-keeping:

```tsx
import { Calendar, CalendarDay, useCalendarDayGrid } from 'calendar-blocks';

const DatePicker = () => {
  // which month / year are we looking at?
  const [{ month, year }, setViewInfo] = useState<{
    month: number;
    year: number;
  }>({
    month: now.getMonth(),
    year: now.getFullYear(),
  });
  // what date is selected?
  const [value, setValue] = useState<Date | null>(null);
  // what days should we render? this hook is provided by calendar-blocks
  const days = useCalendarDayGrid(month, year);

  return (
    // the calendar manages selection state and reports changes
    <Calendar
      displayMonth={month}
      displayYear={year}
      value={value}
      onChange={setValue}
      onDisplayChange={setViewInfo}
    >
      {days.map((day) => (
        <CalendarDay value={day} key={date.toISOString()} />
      ))}
    </Calendar>
  );
};
```

But you should know this won't look like a calendar. It'll just be a list of buttons for each day in the month!

It's not so hard to make a grid in modern CSS, though. For inspiration, check out the [examples directory](https://github.com/a-type/calendar-blocks/tree/main/homepage/src/examples) and [Storybook examples.](https://a-type.github.io/calendar-blocks/storybook) `calendar-blocks` is flexible enough to accomplish many layouts, including virtualized grids!

### Other things `calendar-blocks` doesn't do

- CSS styling of any kind
- Providing month names or buttons to navigate between months and years (the state is in your domain already, so you can implement this with normal buttons or fancy swipe gestures at your discretion)
- Providing visual details like day-of-the-week headers (these don't require any logic and are pretty dependent on your layout - but they often fit quite well into an existing CSS grid once you've set it up, see the examples)
- Internationalization. This one is my bad! I could use some help in implementing things like alternative start-of-week days or even alternative calendars. I recognize these are not at all uncommon needs, but I've been building this mostly to fulfill my own US-centric work.

## Keyboard navigation

One of the primary features of `calendar-blocks` is providing keyboard navigation and selection bindings seamlessly for you. Render `CalendarDay` components within a `Calendar`, and the user can move between them with their keyboard. This includes sensible 2-d navigation, using Home and End for week navigation, and Page Up and Page Down for month navigation. It also automatically invokes changes to the `displayMonth` and `displayYear` when the user moves across month boundaries.

You can disable days, and selection will respect this. Users can still navigate along disabled days, but cannot select them. Range selection will prevent the user from selecting a range which includes a disabled day.

## Display state vs. selection state

This library separates state into 'display' and 'selection.' Display state is what determines which days the user sees. Selection state tracks the date or range of date's they've selected. If you're using this as a date picker, selection state is your `value`/`onChange` equivalent - but you still need to track display state.

There's not a whole lot to it though. Display state is `month` and `year` - and selection state is `value`. Those are the 3 values you need to track.

## Day element attributes

The `CalendarDay` component applies all kinds of data attributes to the rendered button, so you can do some heavy style customization.

Here's a list:

- `data-selected`: whether the day is selected
- `data-highlighted`: whether the user is highlighting the day (via focus or hover)
- `data-highlighted-inactive`: when the calendar doesn't have focus, this attribute is applied to the highlighted day instead of `data-highlighted`. It's best not to visually highlight the day while focus is not within the calendar, but you can still use this attribute to style it in a way that bookmarks where the 'cursor' is while the user is interacting elsewhere.
- `data-disabled`: if the day doesn't match true from your supplied `getDateEnabled` function, this attribute is applied to the day.
- `data-today`: whether the day is today
- `data-date-number`: The visual date number (1-31)
- `data-day-number`: The day of the week as an index (0-6)
- `data-day-first`: If this is the first day of the month
- `data-day-last`: If this is the last day of the month
- `data-different-month`: If a CalendarDay is rendered within a Calendar but its `displayMonth` and `displayYear` don't match the Calendar's `displayMonth` and `displayYear`, it will have this attribute. This occurs for days in the week prior to the first day of the month, for example - if a month starts on a Wednesday, it will be preceded by 3 days from the previous month. To hide these days, use a CSS rule which adds `visibility: hidden` to days with this attribute.
- `data-first-row`: If this day is in the first row on the calendar grid
- `data-last-row`: If this day is in the last row on the calendar grid
- `data-first-column`: If this day is in the first column on the calendar grid
- `data-last-column`: If this day is in the last column on the calendar grid
- `data-first-week`: If this day is in the first week of the month
- `data-last-week`: If this day is in the last week of the month
- `data-range-start`: If this day is the start of a range selection
- `data-range-end`: If this day is the end of a range selection
- `data-in-range`: If this day is in the range selection but not the start or end
- `data-weekend`: If this day is a weekend

## TODO

- [ ] Better docs
- [ ] Internationalization
- [ ] Helpers for rendering days which fall outside the current month

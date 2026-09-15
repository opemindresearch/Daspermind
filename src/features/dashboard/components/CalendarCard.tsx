import type { CalendarController } from '../hooks/useCalendar';
import type { DialogKind } from '../model/navigation';
export function CalendarCard({
  calendar,
  onOpen,
}: {
  calendar: CalendarController;
  onOpen: (kind: DialogKind) => void;
}) {
  return (
    <section className="panel calendar-panel" id="calendar-panel" aria-labelledby="calendar-month">
      <div className="calendar-toolbar">
        <button
          type="button"
          id="previous-month"
          aria-label={`Previous month, ${calendar.previousLabel} ${calendar.previousYear}`}
          onClick={calendar.previous}
        >
          {calendar.previousLabel}
        </button>
        <h2 id="calendar-month" aria-live="polite">
          {calendar.title}
        </h2>
        <button
          type="button"
          id="next-month"
          aria-label={`Next month, ${calendar.nextLabel} ${calendar.nextYear}`}
          onClick={calendar.next}
        >
          {calendar.nextLabel}
        </button>
      </div>
      <div
        className="calendar-scroll"
        tabIndex={0}
        role="region"
        aria-label="Weekly calendar. Scroll horizontally to see all days."
      >
        <div className="calendar-schedule">
          <div className="calendar-days" id="calendar-days">
            {calendar.days.map((day, index) => (
              <span
                key={day.day}
                className={calendar.offset === 0 && index === 2 ? 'selected-day' : undefined}
              >
                <span>{day.day}</span>
                <span>{day.date}</span>
              </span>
            ))}
          </div>
          <div className="calendar-hours">
            {['8:00 am', '9:00 am', '10:00 am', '11:00 am'].map((time) => (
              <span key={time}>{time}</span>
            ))}
          </div>
          <div className="calendar-lines" aria-hidden="true">
            {calendar.days.map((day) => (
              <i key={day.day} />
            ))}
          </div>
          <div id="calendar-events">
            {calendar.events.map((event) => (
              <button
                type="button"
                key={event.id}
                className={`calendar-event ${event.kind}-event`}
                data-dialog={`${event.kind}-event`}
                onClick={() => onOpen(event.kind === 'team' ? 'team-event' : 'onboarding-event')}
              >
                <span>
                  <strong>{event.title}</strong>
                  <span>{event.subtitle}</span>
                </span>
                <span className="avatar-group" aria-hidden="true">
                  {event.avatars.map((avatar) => (
                    <i key={avatar} className={`avatar avatar-${avatar}`} />
                  ))}
                </span>
              </button>
            ))}
          </div>
          <div className="calendar-empty" id="calendar-empty" hidden={calendar.events.length > 0}>
            <span>No events scheduled</span>
            <button type="button" id="back-to-september" onClick={calendar.reset}>
              Back to {calendar.referenceMonth}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

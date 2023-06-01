import React, {useState} from "react";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

interface Event {
    id: string,
    title: string,
    start: Date,
    end: Date,
    type: string,
    group: string,
    lecturer: string,
    room: string
}

const CustomEvent = ({ event }: { event: Event }) => (
    <div>
        <strong>{event.title}</strong>
        <div>{event.lecturer}</div>
        <div>{event.group}</div>
        <div>{event.room}</div>
    </div>
);
const CustomDayEventLayout = ({ event }: { event: Event }) => (
    <div>
        <div>{event.title} {event.lecturer} {event.group} {event.room}</div>
    </div>
);

export default function Home() {

    const [events, setEvents] = useState<Event[]>([
        {
            id: '123',
            title: 'History',
            start: new Date(2023, 5, 1, 16, 0),
            end: new Date(2023, 5, 1, 17, 30),
            type: 'lecture',
            group: '243a',
            lecturer: "Kārlis Ulmanis",
            room: "101"
        },
        {
            id: '1234',
            title: 'Math',
            start: new Date(2023, 5, 1, 18, 0),
            end: new Date(2023, 5, 1, 19, 30),
            type: 'lecture',
            group: '243a',
            lecturer: "Peteris Škile",
            room: "101"
        },
        {
            id: '1235',
            title: 'Geography',
            start: new Date(2023, 5, 2, 10, 0),
            end: new Date(2023, 5, 2, 11, 30),
            type: 'lecture',
            group: '243a',
            lecturer: "Artūrs Ligzdīņš",
            room: "101"
        },
    ]);
    const [eventOpen, setEventOpen] = useState<Event | null>(null)

    const handleEventClick = (event: Event) => {
        // Обработка клика на событие
        console.log('Клик на событие:', event);
        setEventOpen(event)
    };

    const handleSelectSlot = ({ start, end }: any) => {
        // Обработка выбора диапазона дат
        console.log('Выбран диапазон дат:', start, end);

        // Пример добавления нового события
        const newEvent: Event = {
            id: generateUniqueId(), // Генерация уникального идентификатора события
            title: 'Новое событие',
            start,
            end,
            type: "appointment",
            group: '',
            lecturer: '',
            room: ''
        };
        const updatedEvents = [...events, newEvent];
        setEvents(updatedEvents);
    };

    const handleDragStart = (event: Event, dragInfo: any) => {
        // Обработка начала перетаскивания события
        console.log('Начало перетаскивания события:', event, dragInfo);

        // Дополнительная логика, если необходимо подготовить данные для перетаскивания
    };

    const handleDragEnd = (event: Event, dragInfo: any) => {
        // Обработка окончания перетаскивания события
        console.log('Окончание перетаскивания события:', event, dragInfo);

        // Пример обновления даты и времени события
        const updatedEvent = { ...event, start: dragInfo.start, end: dragInfo.end };
        const updatedEvents = events.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev));
        setEvents(updatedEvents);
    };

    return (
        <>
            {eventOpen &&
                <div className={"eventModal"}>
                    <div className={"event"}>
                        <div className="close" onClick={() => setEventOpen(null)}>X</div>
                        <strong>{eventOpen.title}</strong>
                        <div>{eventOpen.lecturer}</div>
                        <div>{eventOpen.group}</div>
                        <div>{eventOpen.room}</div>
                        <div>{formatEventDate(eventOpen.start)} - {formatEventDate(eventOpen.end)}</div>
                    </div>
                </div>
            }
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                //@ts-ignore
                editable={true} // Включение возможности редактирования событий
                selectable={true} // Включение возможности выбора диапазона дат
                style={{ height: 500 }}
                //@ts-ignore
                onSelectEvent={handleEventClick}
                //@ts-ignore
                onSelectSlot={handleSelectSlot}
                //@ts-ignore
                onDragStart={handleDragStart}
                //@ts-ignore
                onDragEnd={handleDragEnd}
                //@ts-ignore
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CustomEvent,
                    day: {
                        event: CustomDayEventLayout,
                    },
                    week: {
                        event: CustomDayEventLayout
                    },
                }}
                defaultView={Views.MONTH}
            />
      </>
  )
}

const generateUniqueId = () => {
    // Генерация уникального идентификатора на основе текущего времени и случайного числа
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${timestamp}-${random}`;
};

const eventStyleGetter = (event: Event, start: Date, end: Date, isSelected: boolean) => {
    let backgroundColor = '';
    switch (event.type) {
        case 'lecture':
            backgroundColor = 'green';
            break;
        case 'appointment':
            backgroundColor = 'blue';
            break;
        case 'task':
            backgroundColor = 'red';
            break;
        default:
            backgroundColor = 'gray';
            break;
    }

    return {
        style: {
            backgroundColor,
        },
    };
};

const formatEventDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
};

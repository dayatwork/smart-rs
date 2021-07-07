import React, { useState, useRef } from 'react';
import { Box, useMediaQuery } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

import { CalendarToolbar } from './CalendarToolbar';

export const Calendar = ({ eventClick, events, eventContent, ...rest }) => {
  const [isMobile] = useMediaQuery('(max-width: 600px)');
  const [view, setView] = useState(isMobile ? 'listWeek' : 'dayGridMonth');
  const calendarRef = useRef(null);

  const handleChangeView = newView => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  return (
    <Box>
      <CalendarToolbar view={view} onChangeView={handleChangeView} />
      <FullCalendar
        ref={calendarRef}
        initialView={view}
        plugins={[listPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
        events={events}
        eventClick={eventClick}
        eventContent={eventContent && eventContent(view)}
        {...rest}
      />
    </Box>
  );
};

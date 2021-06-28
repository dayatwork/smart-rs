import * as React from 'react';
import { Flex } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import roundViewDay from '@iconify/icons-ic/round-view-day';
import roundViewWeek from '@iconify/icons-ic/round-view-week';
import roundViewAgenda from '@iconify/icons-ic/round-view-agenda';
import roundViewModule from '@iconify/icons-ic/round-view-module';

import { ToggleButtonGroup } from './ToggleButtonGroup';
import { ToggleButton } from './ToggleButton';

export const CalendarToolbar = ({ view, onChangeView }) => {
  return (
    <Flex justify="center" py="12">
      <ToggleButtonGroup
        size="lg"
        value={view}
        onChange={onChangeView}
        defaultValue="left"
        isAttached
        variant="outline"
        aria-label="Align text"
      >
        <ToggleButton
          value="dayGridMonth"
          aria-label="Month"
          icon={<Icon icon={roundViewModule} />}
        />
        <ToggleButton
          value="timeGridWeek"
          aria-label="Week"
          icon={<Icon icon={roundViewWeek} />}
        />
        <ToggleButton
          value="timeGridDay"
          aria-label="Day"
          icon={<Icon icon={roundViewDay} />}
        />
        <ToggleButton
          value="listWeek"
          aria-label="Agenda"
          icon={<Icon icon={roundViewAgenda} />}
        />
      </ToggleButtonGroup>
    </Flex>
  );
};

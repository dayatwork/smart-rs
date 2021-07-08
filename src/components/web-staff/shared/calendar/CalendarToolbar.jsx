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
    <Flex justify="center" py="4">
      <ToggleButtonGroup
        size="lg"
        value={view}
        onChange={onChangeView}
        defaultValue="dayGridMonth"
        isAttached
        variant="outline"
        aria-label="View"
      >
        <ToggleButton
          tooltip="Monthly"
          value="dayGridMonth"
          aria-label="Month"
          icon={<Icon icon={roundViewModule} />}
        />

        <ToggleButton
          tooltip="Weekly"
          value="timeGridWeek"
          aria-label="Week"
          icon={<Icon icon={roundViewWeek} />}
        />
        <ToggleButton
          tooltip="Daily"
          value="timeGridDay"
          aria-label="Day"
          icon={<Icon icon={roundViewDay} />}
        />
        <ToggleButton
          tooltip="Monthly List"
          value="listWeek"
          aria-label="Agenda"
          icon={<Icon icon={roundViewAgenda} />}
        />
      </ToggleButtonGroup>
    </Flex>
  );
};

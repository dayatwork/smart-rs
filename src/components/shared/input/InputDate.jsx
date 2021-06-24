/* eslint-disable jsx-a11y/no-onchange */
import React, { useState } from 'react';
import { Box, Select } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

function parseDate(str, format, locale) {
  const parsed = dateFnsParse(str, format, new Date(), { locale });
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
  return undefined;
}

function formatDate(date, format, locale) {
  return dateFnsFormat(date, format, { locale });
}

function getYears(startYear = 1900, endYear = new Date().getFullYear()) {
  if (startYear > endYear) return [];

  const years = [];
  while (startYear <= endYear) {
    years.push(endYear--);
  }
  return years;
}

function YearMonthForm({ date, localeUtils, onChange, startYear, endYear }) {
  const months = localeUtils.getMonths();
  const years = getYears(startYear, endYear);

  // const years = [];
  // for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
  //   years.push(i);
  // }

  // function handleChange(e) {
  //   const { year, month } = e.target.form;
  //   onChange(new Date(year.value, month.value));
  // }

  function handleChange(e) {
    if (e.target.name === 'year') {
      onChange(new Date(e.target.value, date.getMonth()));
    }
    if (e.target.name === 'month') {
      onChange(new Date(date.getFullYear(), e.target.value));
    }
  }

  return (
    <>
      <Box className="DayPicker-Caption">
        <Select
          mt="8"
          mb="2"
          name="month"
          onChange={handleChange}
          value={date.getMonth()}
        >
          {months.map((month, i) => (
            <option key={month} value={i}>
              {month}
            </option>
          ))}
        </Select>
        <Select name="year" onChange={handleChange} value={date.getFullYear()}>
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </Box>
    </>
  );
}

// const currentYear = new Date().getFullYear();
// const fromMonth = new Date(currentYear - 150, 0);
// const toMonth = new Date(currentYear + 10, 11);

export const InputDate = ({
  name,
  control,
  defaultValue,
  dayPickerProps,
  selectYearMode,
  startYear,
  endYear,
  ...rest
}) => {
  const fromMonth = new Date(startYear, 0);
  const toMonth = new Date(endYear, 11);
  const [month, setMonth] = useState(fromMonth);
  const FORMAT = 'dd/MM/yyyy';

  const captionElement = ({ date, localeUtils }) => (
    <YearMonthForm
      date={date}
      localeUtils={localeUtils}
      onChange={setMonth}
      startYear={startYear}
      endYear={endYear}
    />
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => {
        if (name === 'birth_date') {
          return (
            <DayPickerInput
              value={value}
              format={FORMAT}
              formatDate={formatDate}
              parseDate={parseDate}
              onDayChange={v => {
                onChange(v);
              }}
              dayPickerProps={{
                disabledDays: { after: new Date() },
                captionElement,
                month,
                fromMonth,
                toMonth,
                ...dayPickerProps,
              }}
              placeholder="dd/MM/yyyy"
            />
          );
        }
        if (selectYearMode) {
          return (
            <DayPickerInput
              value={value}
              format={FORMAT}
              formatDate={formatDate}
              parseDate={parseDate}
              onDayChange={v => {
                onChange(v);
              }}
              dayPickerProps={{
                captionElement,
                month,
                fromMonth,
                toMonth,
                ...dayPickerProps,
              }}
              placeholder="dd/MM/yyyy"
            />
          );
        }
        return (
          <DayPickerInput
            value={value}
            format={FORMAT}
            formatDate={formatDate}
            parseDate={parseDate}
            onDayChange={v => {
              onChange(v);
            }}
            placeholder="dd/MM/yyyy"
            dayPickerProps={dayPickerProps}
          />
        );
      }}
      defaultValue={defaultValue}
      {...rest}
    />
  );
};

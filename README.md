# obsidian-journal
Javascript template for Obsidian's Templater that automatically creates stubs for days,  month and years.

## Requirements
- [Templater](https://github.com/SilentVoid13/Templater)

## Year view

<img width="400" alt="year" src="https://github.com/barabasz/obsidian-journal/assets/1305786/5081f151-48f6-42a3-87e8-5d7f2c6589da">

## Month view

<img width="400" alt="month" src="https://github.com/barabasz/obsidian-journal/assets/1305786/ea143d2c-292b-40e2-b616-fe4712ce7c9e">

## Day view

<img width="400" alt="day" src="https://github.com/barabasz/obsidian-journal/assets/1305786/409fbd2f-5846-4433-b9b5-b72406a002fd">

## Properties

### For day-notes

- thisDay
- nextDay
- prevDay
- thisMonth
- thisYear

### For month-notes

- thisMonth
- nextMonth
- prevMonth
- thisYear

### For year-notes

- thisYear
- nextYear
- prevYear

### For day properties (thisDay, etc.)

- date
- year
- month
- day
- dayInt
- dow (day of week)
- doy (day of year)
- name
- nameEn
- fullName
- fullNameEn
- path
- link
- linkName
- lifedays

### For month properties (thisMonth, etc.)

- year
- month
- monthInt
- name
- nameEn
- nameGen
- fullName
- fullNameEn
- days
- firstDay
- firstDayDow
- lastDay
- lastDayDow
- path
- link
- linkGen

### For year properties (thisYear, etc.)

- year
- days
- isLeap
- path
- link


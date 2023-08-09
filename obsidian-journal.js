<%*
function dayTemplate() {
  j = {
    ...j,
    year: j.date.format("YYYY"),
    month: j.date.format("MM"),
    monthInt: j.date.format("M"),
    week: j.date.format("W"),
    day: j.date.format("DD"),
    dayInt: j.date.format("D"),
    doy: j.date.format("DDD"),
    prevDay: moment(j.date).subtract(1, "d").format("YYYY-MM-DD"),
    nextDay: moment(j.date).add(1, "d").format("YYYY-MM-DD"),
    dateName: j.date.format("D MMMM YYYY"),
    lifedays: j.date.diff(moment(j.birthday, "YYYY-MM-DD"), "days") + 1,
  };
  moment.locale(j.locale);
  j = {
    ...j,
    dateNamePl: moment(j.date.format()).format("LL"),
    dowPl: moment(j.date.format()).format("dddd"),
    prevDayName: moment(j.prevDay).format("dddd"),
    nextDayName: moment(j.nextDay).format("dddd"),
  };
  if (j.locale == 'en') j.dateNamePl = j.dateName;
  moment.locale("en");
  j = {
    ...j,
    prevDayYear: j.prevDay.split("-")[0],
    nextDayYear: j.nextDay.split("-")[0],
    prevDayMonth: j.prevDay.split("-")[1],
    nextDayMonth: j.nextDay.split("-")[1],
    monthNamePlGen: j.dateNamePl.split(" ")[1],
  };
  j = {
    ...j,
    yearLink: `[[Journal/${j.year}|${j.year}]]`,
    thisMonthLink: `[[Journal/${j.year}/${j.year}-${j.month}|${j.monthNamePlGen}]]`,
    prevDayLink: `[[Journal/${j.prevDayYear}/${j.prevDayMonth}/${j.prevDay}|← ${j.prevDayName}]]`,
    nextDayLink: `[[Journal/${j.nextDayYear}/${j.nextDayMonth}/${j.nextDay}|${j.nextDayName} →]]`,
  };

  tR += trimBlock(`---
    type: journal
    kind: day
    alias: ${j.dateName}, ${j.dateNamePl}
    year: ${j.year}
    month: ${parseInt(j.month)}
    week: ${j.week}
    day: ${parseInt(j.day)}
    dayofweek: ${j.dowPl}
    lifedays: ${j.lifedays}
    tag: journal/day
    uuid: ${j.uuid}
    created: ${j.now}
    summary:
    ---
    ## ${j.dowPl.cfl()}, ${j.dayInt} ${j.thisMonthLink} ${j.yearLink} ${j.yearGen}
    ${j.prevDayLink}  •  ${j.nextDayLink}

    ...
    
    ## ${j.onThatDay}
    \`\`\`dataview
    TABLE WITHOUT ID file.link as "day", summary
    FROM "Journal"
    WHERE month = ${j.monthInt} AND day = ${j.dayInt} AND year != ${j.year}
    SORT file.link ASC
    \`\`\`
  `);
}

function monthTemplate() {
  j = {
    ...j,
    year: j.date.format("YYYY"),
    month: j.date.format("MM"),
    monthInt: j.date.format("M"),
    monthName: j.date.format("MMMM"),
    prevMonth: moment(j.date).subtract(1, "M").format("YYYY-MM"),
    nextMonth: moment(j.date).add(1, "M").format("YYYY-MM"),
    days: parseInt(moment(j.date).daysInMonth()),
  };
  moment.locale(j.locale);
  j = {
    ...j,
    monthNamePl: moment(j.date.format("YYYY-MM")).format("MMMM"),
    prevMonthName: moment(j.prevMonth).format("MMMM"),
    nextMonthName: moment(j.nextMonth).format("MMMM"),
    firstDay: j.title + "-01",
    lastDay: j.title + "-" + j.days.toString(),
    calendar: '',
  };
  for (let i = 1; i < 8; i++) {
    let dow = moment().isoWeekday(i).format('ddd').cfl();
    if (i == 7) dow = '==' + dow + '== |';
    j.calendar += '| ' + dow + ' ';
  }
  moment.locale("en");
  j = {
    ...j,
    firstDayDoW: moment(j.firstDay).isoWeekday(),
    lastDayDoW: moment(j.lastDay).isoWeekday(),
    prevMonthLink: `[[Journal/${j.prevMonth.split("-")[0]}/${j.prevMonth.split("-")[0]}-${j.prevMonth.split("-")[1]}|← ${j.prevMonthName}]]`,
    nextMonthLink: `[[Journal/${j.nextMonth.split("-")[0]}/${j.nextMonth.split("-")[0]}-${j.nextMonth.split("-")[1]}|${j.nextMonthName} →]]`,
    yearLink: `[[Journal/${j.year}|${j.year}]]`,
  };
  

  
  j.calendar += nl + "|:---:|:---:|:---:|:---:|:---:|:---:|:---:|" + nl;
  for (let i = 1; i < j.firstDayDoW; i++) {
    j.calendar += "|  .  ";
  }
  let dow = j.firstDayDoW;
  for (let i = 1; i < j.days + 1; i++) {
    j.calendar += `| [[Journal/${j.year}/${j.month}/${j.title}-${i.toString().padStart(2, "0")}\\|${i}]] `;
    if (dow > 0 && dow % 7 === 0) {
      j.calendar += "|" + nl;
      dow = 1;
    } else {
      dow++;
    }
  }
  for (let i = j.lastDayDoW; i < 7; i++) {
    j.calendar += "|  .  ";
  }
  if (dow != 1) {
    j.calendar += "|";
  }

  tR += trimBlock(`---
    type: journal
    kind: month
    alias: ${j.monthName} ${j.year}, ${j.monthNamePl} ${j.year}
    year: ${j.year}
    month: ${j.monthInt}
    tag: journal/month"
    uuid: ${j.uuid}
    created: ${j.now}
    summary:
    ---
    ## ${j.monthNamePl.cfl()} ${j.yearLink}
    ${j.prevMonthLink}  •  ${j.nextMonthLink}
    
    ...
    
    ${j.calendar}
    
    ## ${j.summary}
    \`\`\`dataview
    TABLE WITHOUT ID file.link as "day", summary
    FROM "Journal/${j.year}/${j.month}"
    WHERE kind = "day"
    SORT file.link ASC
    \`\`\`
  `);
}

function yearTemplate() {
  j = {
    ...j,
    year: j.date.format("YYYY"),
    prevYear: moment(j.date).subtract(1, "Y").format("YYYY"),
    nextYear: moment(j.date).add(1, "Y").format("YYYY"),
    prevYearLink: `[[Journal/${j.prevYear}|← ${j.prevYear}]]`,
    nextYearLink: `[[Journal/${j.nextYear}|${j.nextYear} →]]`,
  };
  j = {
    ...j,
    prevYearLink: `[[Journal/${j.prevYear}|← ${j.prevYear}]]`,
    nextYearLink: `[[Journal/${j.nextYear}|${j.nextYear} →]]`,
  };

  j.calendar = "| Q1 | Q2  | Q3  | Q4 |" + nl;
  j.calendar += "|:---:|:---:|:---:|:---:|" + nl;
  moment.locale(j.locale);
  let m = 0;
  for (let q = 0; q < 3; q++) {
    for (let i = 1; i < 13; i = i + 3) {
      m = (i + q).toString().padStart(2, "0");
      j.calendar += `| [[Journal/${j.year}/${j.year}-${m}\\|${moment(m).format(
        "MMMM"
      )}]] `;
    }
    j.calendar += `|${nl}`;
  }
  moment.locale("en");
  
  tR += trimBlock(`---
    type: journal
    kind: year
    year: ${j.year}
    tag: journal/year
    uuid: ${j.uuid}
    created: ${j.now}
    summary: 
    ---
    ## ${j.yearNom.cfl()} ${j.year}
    ${j.prevYearLink}  •  ${j.nextYearLink}
    
    ...
    
    ${j.calendar}
    ## ${j.summary}
    \`\`\`dataview
    TABLE WITHOUT ID file.link as "month", summary
    FROM "Journal/${j.year}"
    WHERE kind = "month"
    SORT file.link ASC
    \`\`\`   
  `);  
  
}

function uuid() {
	var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
	var d0 = Math.random()*0xffffffff|0;
	var d1 = Math.random()*0xffffffff|0;
	var d2 = Math.random()*0xffffffff|0;
	var d3 = Math.random()*0xffffffff|0;
	return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
	lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
	lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
	lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
}

function trimBlock(str) {
  let lines = str.split("\n");
  let trimmedLines = lines.map((line) => line.trim());
  return trimmedLines.join("\n");
}

String.prototype.cfl = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

moment.locale('en');
const nl = "\n";
let j = {};

if (moment(tp.file.title).isValid()) {
  j = {
    ...j,
    title: tp.file.title,
    date: moment(tp.file.title),
    uuid: uuid(),
    locale: 'en',
    yearGen: '',
    yearNom: 'year',
    onThatDay: 'On that day...',
    summary: 'Summary',
    birthday: '1980-01-01',
    now: moment().local().format("YYYY-MM-DD HH:mm:ss"),
  };
  if (j.title.length == 10) {
    dayTemplate();
  } else if (j.title.length == 7) {
    monthTemplate();
  } else if (j.title.length == 4) {
    yearTemplate();
  } else {
    tR += "unsupported note title";
  }
} else {
  tR += "unsupported note title";
}
%>

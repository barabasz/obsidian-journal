String.prototype.cfl = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

class JournalYear {
    constructor(date) {
        this.obj = moment(date);
        this.year = parseInt(this.obj.format("YYYY"));
        this.days = moment(this.year + "-12-31").dayOfYear();
        this.isLeap = this.obj.isLeapYear();
        this.path = `${Journal.dir}/${this.year}`;
        this.link = `[[${this.path}|${this.year}]]`;
    }
}

class JournalMonth {
    constructor(date) {
        this.nameEn = moment(date).format("MMMM");
        moment.locale(Journal.locale);
        this.obj = moment(date);
        this.year = parseInt(this.obj.format("YYYY"));
        this.month = this.obj.format("MM");
        this.monthInt = parseInt(this.obj.format("M"));
        this.name = this.obj.format("MMMM");
        this.nameGen = moment(this.obj.format()).format("LL").split(" ")[1];
        this.fullName = `${this.name} ${this.year}`;
        this.fullNameEn = `${this.nameEn} ${this.year}`;
        this.days = parseInt(this.obj.daysInMonth());
        this.firstDay = this.obj.startOf("month").format("YYYY-MM-DD");
        this.firstDayDow = moment(this.firstDay).isoWeekday();
        this.lastDay = this.obj.endOf("month").format("YYYY-MM-DD");
        this.lastDayDow = moment(this.lastDay).isoWeekday();
        this.path = `${Journal.dir}/${this.year}/${this.month}`;
        this.link = `[[${this.path}|${this.name}]]`;
        this.linkGen = `[[${this.path}|${this.nameGen}]]`;
    }
}

class JournalDay {
    constructor(date) {
        this.nameEn = moment(date).format("dddd");
        this.fullNameEn = moment(date).format("D MMMM YYYY");
        moment.locale(Journal.locale);
        this.obj = moment(date);
        this.date = this.obj.format("YYYY-MM-DD");
        this.year = parseInt(this.obj.format("YYYY"));
        this.month = this.obj.format("MM");
        this.day = this.obj.format("DD");
        this.dayInt = parseInt(this.obj.format("D"));
        this.dow = parseInt(this.obj.format("E"));
        this.doy = this.obj.dayOfYear();
        this.name = moment(this.obj).format("dddd");
        this.fullName = moment(this.obj).format("LL");
        this.path = `${Journal.dir}/${this.year}/${this.month}/${this.date}`;
        this.link = `[[${this.path}|${this.date}]]`;
        this.linkName = `[[${this.path}|${this.name}]]`;
        this.lifedays = this.obj.diff(moment(Journal.birthday, "YYYY-MM-DD"), "days") + 1;
    }
}

class Journal {
    static birthday = '1979-06-14';
    static locale = 'pl';
    static dir = 'Journal';
    static formatDateTime = 'YYYY-MM-DD HH:mm';
    static formatDay = 'YYYY-MM-DD';
    static onThisDay = "On this day…";
    static summary = "Summary";
    static yearName = "Rok";
    navSeparator = "  •  ";
    arrowLeft = "← ";
    arrowRight = " →";

    constructor(filename) {
        moment.locale("en");
        this.filename = filename;
        this.date = moment(filename);
        this.kind = this.setKind();
        this.now = moment().local().format(this.formatDateTime);
        if (this.kind == "day") {
            this.setDay();
        } else if (this.kind == "month") {
            this.setMonth();
        } else if (this.kind == "year") {
            this.setYear();
        } else {
            console.log("unsupported note title");
            process.exit();
        }
        this.tags = `journal/${this.kind}`;
    }

    setKind() {
        if (this.filename.length == 10) {
            return "day";
        } else if (this.filename.length == 7) {
            return "month";
        } else if (this.filename.length == 4) {
            return "year";
        } else {
            return false;
        }
    }

    makeYearCalendar() {
        const nl = "\n";
        let calendar = "| Q1 | Q2  | Q3  | Q4 |" + nl;
        calendar += "|:---:|:---:|:---:|:---:|" + nl;
        moment.locale(Journal.locale);
        let m = 0;
        for (let q = 0; q < 3; q++) {
            for (let i = 1; i < 13; i = i + 3) {
              m = (i + q).toString().padStart(2, "0");
              calendar += `| [[${this.thisYear.path}/${this.thisYear.year}-${m}\\|${moment(m).format("MMMM")}]] `;
            }
            calendar += `|${nl}`;
        }
        return calendar;
    }
    
    makeMonthCalendar() {
        const nl = "\n";
        let calendar = "";
        for (let i = 1; i < 8; i++) {
            let dow = moment().isoWeekday(i).format("ddd").cfl();
            if (i == 7) dow = "==" + dow + "== |";
            calendar += "| " + dow + " ";
        }
        calendar += nl + "|:---:|:---:|:---:|:---:|:---:|:---:|:---:|" + nl;
        for (let i = 1; i < this.thisMonth.firstDayDow; i++) {
            calendar += "|  .  ";
        }
        let dow = this.thisMonth.firstDayDow;

        for (let i = 1; i < this.thisMonth.days + 1; i++) {
            calendar += `| [[${this.thisMonth.path}/${this.filename}-${i.toString().padStart(2, "0")}\\|${i}]] `;
            if (dow > 0 && dow % 7 === 0) {
                calendar += "|" + nl;
                dow = 1;
            } else {
                dow++;
            }
        }

        for (let i = this.thisMonth.lastDayDow; i < 7; i++) {
            calendar += "|  .  ";
        }
        if (dow != 1) {
            calendar += "|";
        }

        return calendar;
    }

    makeFrontmatter(obj) {
        let frontmatter = "";
        for (var key in obj) {
            frontmatter += key + ": " + obj[key] + "\n";
        }
        return frontmatter.trim();
    }

    setDay() {
        let thisDay = moment(this.date).format(this.formatDay);
        this.thisDay = new JournalDay(thisDay, this.locale);
        let prevDay = moment(this.date).subtract(1, "d").format(this.formatDay);
        this.prevDay = new JournalDay(prevDay, this.locale);
        let nextDay = moment(this.date).add(1, "d").format(this.formatDay);
        this.nextDay = new JournalDay(nextDay, this.locale);
        let thisMonth = moment(this.date).format("YYYY-MM");
        this.thisMonth = new JournalMonth(thisMonth, this.locale);
        let thisYear = moment(this.date).format("YYYY");
        this.thisYear = new JournalYear(thisYear, this.locale);
        let frontmatter = {
            year: this.thisYear.year,
            month: this.thisMonth.monthInt,
            day: this.thisDay.dayInt,
            lifedays: this.thisDay.lifedays,
        };
        this.frontmatter = this.makeFrontmatter(frontmatter);
        this.aliases = `[${this.thisDay.fullName}, ${this.thisDay.fullNameEn}]`;
        this.nav = `${this.arrowLeft}${this.prevDay.linkName}${this.navSeparator}${this.nextDay.linkName}${this.arrowRight}`;
        this.title = `${this.thisDay.dayInt} ${this.thisMonth.nameGen} ${this.thisYear.year}`;
        this.titleLink = `${this.thisDay.name.cfl()}, ${this.thisDay.dayInt} ${this.thisMonth.linkGen} ${this.thisYear.link}`;
        this.extra = "";
        this.dataviewTitle = Journal.onThisDay;
        this.dataview = "```dataview\n"
            + `TABLE WITHOUT ID file.link as "day", summary\n`
            + `FROM "${Journal.dir}"\n`
            + `WHERE month = ${this.thisMonth.monthInt} AND day = ${this.thisDay.dayInt} AND year != ${this.thisYear.year}\n`
            + `SORT file.link ASC\n`
            + "```";
    }

    setMonth() {
        let thisMonth = moment(this.date).format("YYYY-MM");
        this.thisMonth = new JournalMonth(thisMonth, this.locale);
        let prevMonth = moment(this.date).subtract(1, "M").format("YYYY-MM");
        this.prevMonth = new JournalMonth(prevMonth, this.locale);
        let nextMonth = moment(this.date).add(1, "M").format("YYYY-MM");
        this.nextMonth = new JournalMonth(nextMonth, this.locale);
        let thisYear = moment(this.date).format("YYYY");
        this.thisYear = new JournalYear(thisYear, this.locale);
        let frontmatter = {
            year: this.thisYear.year,
            month: this.thisMonth.monthInt,
        };
        this.frontmatter = this.makeFrontmatter(frontmatter);
        this.aliases = `[${this.thisMonth.fullName}, ${this.thisMonth.fullNameEn}]`;
        this.nav = `${this.arrowLeft}${this.prevMonth.link}${this.navSeparator}${this.nextMonth.link}${this.arrowRight}`;
        this.title = `${this.thisMonth.name.cfl()} ${this.thisYear.year}`;
        this.titleLink = `${this.thisMonth.name.cfl()} ${this.thisYear.link}`;
        this.extra = this.makeMonthCalendar();
        this.dataviewTitle = Journal.summary;
        this.dataview = "```dataview\n"
            + `TABLE WITHOUT ID file.link as "day", summary\n`
            + `FROM "${this.thisMonth.path}"\n`
            + `WHERE kind = "day"\n`
            + `SORT file.link ASC\n`
            + "```";
    }

    setYear() {
        let thisYear = moment(this.date).format("YYYY");
        this.thisYear = new JournalYear(thisYear, this.locale);
        let prevYear = moment(this.date).subtract(1, "Y").format("YYYY");
        this.prevYear = new JournalYear(prevYear, this.locale);
        let nextYear = moment(this.date).add(1, "Y").format("YYYY");
        this.nextYear = new JournalYear(nextYear, this.locale);
        let frontmatter = {
            year: this.thisYear.year,
            isleap: this.thisYear.isLeap,
        };
        this.frontmatter = this.makeFrontmatter(frontmatter);
        this.aliases = `${Journal.yearName.toLowerCase()} ${this.thisYear.year}`;
        this.nav = `${this.arrowLeft}${this.prevYear.link}${this.navSeparator}${this.nextYear.link}${this.arrowRight}`;
        this.title = `${Journal.yearName} ${this.thisYear.year}`;
        this.titleLink = this.title;
        this.extra = this.makeYearCalendar();
        this.dataviewTitle = Journal.summary;
        this.dataview = "```dataview\n"
            + `TABLE WITHOUT ID file.link as "month", summary\n`
            + `FROM "${this.thisYear.path}"\n`
            + `WHERE kind = "month"\n`
            + `SORT file.link ASC\n`
            + "```";
    }
}

function journal(filename) {
    return new Journal(filename);
}

module.exports = journal;

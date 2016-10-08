import { REPORT_TYPE_TOKEN, SECTION_TYPES, REPORT_TYPES } from '../constants/Constants';

function sortReportSections(sec1, sec2) {
  const sec1RowPos = sec1.layout.rowPos;
  const sec2RowPos = sec2.layout.rowPos;
  const sec1ColumnPos = sec1.layout.columnPos;
  const sec2ColumnPos = sec2.layout.columnPos;

  let result;
  if (sec1RowPos === sec2RowPos) {
    result = (sec1ColumnPos < sec2ColumnPos) ? -1 : (sec1ColumnPos > sec2ColumnPos) ? 1 : 0; // eslint-disable-line
  } else {
    result = (sec1RowPos < sec2RowPos) ? -1 : 1;
  }

  return result;
}

function filterSectionsAccordingToReportType(reportData, reportType) {
  return reportData.filter((section) => {
    let shouldShow = false;
    switch (reportType) {
      case REPORT_TYPES.csv:
        if (section.type === SECTION_TYPES.date ||
            section.type === SECTION_TYPES.header ||
            section.type === SECTION_TYPES.text ||
            section.type === SECTION_TYPES.table) {
          shouldShow = true;
        }
        break;
      default:
        shouldShow = true;
    }
    return shouldShow;
  });
}

export function prepareSections(reportData, reportType) {
  const rows = {};

  if (reportData) {
    reportData.sort(sortReportSections);
    const filteredData = filterSectionsAccordingToReportType(reportData, reportType);
    filteredData.forEach((section) => {
      if (rows[section.layout.rowPos]) {
        rows[section.layout.rowPos].push(section);
      } else {
        rows[section.layout.rowPos] = [section];
      }
    });
  }

  return rows;
}

export function getReportType(reportType) {
  let type = reportType;
  if (!type || type === REPORT_TYPE_TOKEN ||
      (type !== REPORT_TYPES.csv && type !== REPORT_TYPES.pdf)) {
    type = REPORT_TYPES.pdf;
  }
  return type;
}
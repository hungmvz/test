import moment from "moment";
import { useMemo } from "react";

const YYYYMMDD = "YYYY/MM/DD";
const MMDDYYYY = "MM/DD/YYYY";

const YYYY = /^(\d{0,4})(\/)?(\d{0,2})(\/)?(\d{0,2})/gm;

const dateFormat = {
  [YYYYMMDD]: /^(\d{0,4})(\/)?(\d{0,2})(\/)?(\d{0,2})/gm,
  [MMDDYYYY]: /^(\d{0,2})(\/)?(\d{0,2})(\/)?(\d{0,4})/gm
};

const DateInput2 = ({ value, format, placeholder, onValueChange }) => {
  const defaultValue = useMemo(() => value, [value]);

  const getDataByFormat = (input, format = YYYYMMDD) => {
    const regex = dateFormat[format];

    switch (format) {
      case MMDDYYYY: {
        const [
          _,
          month,
          monthSplash,
          day,
          daySplash,
          year,
          yearSplash
        ] = new RegExp(regex).exec(input);
        return {
          _,
          day,
          daySplash,
          month,
          monthSplash,
          year,
          yearSplash,
          full: input
        };
      }
      case YYYYMMDD:
      default: {
        const [
          _,
          year,
          yearSplash,
          month,
          monthSplash,
          day,
          daySplash
        ] = new RegExp(regex).exec(input);
        return {
          _,
          day,
          daySplash,
          month,
          monthSplash,
          year,
          yearSplash,
          full: input
        };
      }
    }
  };

  const handleChangeYear = (input = "", length, splashAllowed, splash) => {
    const result = [input];

    if (input.length === length && splashAllowed) {
      result.push(splash || "/");
    }

    return result.join("");
  };

  const handleChangeMonth = (input = "", splashAllowed, splash) => {
    if (!input) {
      return {};
    }
    // remove 00 or 0/ by 0 (prevent input double zero or splash after zero)
    const m = [input].join("").replace(/^00|^0\//gm, "0");

    const m1 = m[0];
    const m2 = m[1];

    const monthLength = m.length;

    if (monthLength === 1) {
      if (+m1 > 1) {
        return {
          month:
            String(m1).padStart(2, "0") + (splashAllowed ? splash || "/" : "")
        };
      } else {
        return {
          month: m1
        };
      }
    }

    if (monthLength === 2) {
      if (+m > 12) {
        return {
          month:
            String(m1).padStart(2, "0") + (splashAllowed ? splash || "/" : ""),
          remain: m2
        };
      } else {
        return {
          month: m + (splashAllowed ? splash || "/" : "")
        };
      }
    }
  };

  const handleChangeDay = (input = "", splashAllowed, splash) => {
    // remove double zero
    const d = [input].join("").replace(/^00/gm, "0");

    let firstDay = d[0];
    let secondDay = d[1];

    const result = [];
    result.push(firstDay || "");
    result.push(secondDay || "");

    if (result.join("").length === 2 && splashAllowed) {
      result.push(splash || "/");
    }
    return result.join("");
  };

  const onChange = event => {
    const { inputType } = event.nativeEvent;

    const value = event.target.value;

    // remove leading zero
    const removeLeadingZero = value.replace(/^\//gm, "");

    // remove double splash
    const removeDbSplash = removeLeadingZero.replace(/\/\//gm, "/");

    // remove character that are not number or splash
    const removeNotDigitOrSplash = removeDbSplash.replace(/[^0-9\/]/, "");

    const {
      day: dayInput,
      daySplash,
      month: monthInput,
      monthSplash,
      year: yearInput,
      yearSplash,
      _,
      full
    } =
      getDataByFormat(removeNotDigitOrSplash, format) || [];

    console.log({ dayInput, monthInput, yearInput });
    if (/^insert/gm.test(inputType)) {
      if (_) {
        const values = [];

        const order = format.match(/([YMD]{1,4})(\/?)/gm) || [];

        for (const item of order) {
          const [_, key, splash] = new RegExp(/([YMD]{1,4})(\/?)/gm).exec(item);

          const isAllowSplash = Boolean(splash);

          switch (key) {
            case "YYYY": {
              if (yearInput) {
                // push year value
                values.push(
                  handleChangeYear(yearInput, 4, isAllowSplash, yearSplash)
                );
              }
              break;
            }
            case "MM": {
              if (monthInput) {
                // push month value and calculate remain month (if available)
                const { month } = handleChangeMonth(
                  monthInput,
                  isAllowSplash,
                  monthSplash
                );
                values.push(month);
              }
              break;
            }
            case "DD": {
              if (dayInput) {
                // push day value
                values.push(
                  handleChangeDay(dayInput, isAllowSplash, daySplash)
                );
              }
              break;
            }
            default:
              break;
          }
        }

        const dateValue = values.join("");
        // if (dateValue.length === "YYYY/MM/DD".length) {
        //   const validDate = moment(dateValue, ["YYYY/MM/DD"], true).format(
        //     "YYYY/MM/DD"
        //   );

        //   event.target.value = validDate;

        //   onValueChange(validDate);

        //   return;
        // }

        event.target.value = dateValue;
        onValueChange(dateValue);
      }
      return;
    }

    if (!_) {
      event.target.value = full.replace(/[^0-9]/, "");
    } else {
      event.target.value = full.replace(/\/\//gm, "/");
    }
    onValueChange(event.target.value);
  };

  const onBlur = event => {
    // const { value } = event.target;
    // if (value) {
    //   const validDate = moment(
    //     value,
    //     ["YYYY/MM/D", "YYYY/MM/DD", "YYYY/M/D", "YYYY/M/DD"],
    //     true
    //   ).format("YYYY/MM/DD");
    //   event.target.value = validDate;
    //   onValueChange(validDate);
    // }
  };

  return (
    <div>
      <input
        value={defaultValue}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={format}
      />
    </div>
  );
};

export default DateInput2;

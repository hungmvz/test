import moment from "moment";
import { useMemo } from "react";

const dateFormat = /^(\d{0,4})(\/)?(\d{0,2})(\/)?(\d{0,2})/gm;

const DateInput = ({ value, placeholder, onValueChange }) => {
    const defaultValue = useMemo(() => value, [value]);

    const handleChangeYear = (input, length, separate) => {
        const result = [input];

        if (input.length === length) {
            result.push(separate || '/');
        }

        return result.join('');
    };

    const handleChangeMonth = (input, separate) => {
        if (!input) {
            return {};
        }
        // remove 00 or 0/ by 0 (prevent input double zero or splash after zero)
        const m = [input].join('').replace(/^00|^0\//gm, '0');

        const m1 = m[0];
        const m2 = m[1];

        const monthLength = m.length;

        if (monthLength === 1) {
            if (+m1 > 1) {
                return {
                    month: String(m1).padStart(2, '0') + (separate || '/'),
                }
            } else {
                return {
                    month: m1,
                }
            }
        }

        if (monthLength === 2) {
            if (+m > 12) {
                return {
                    month: String(m1).padStart(2, '0') + (separate || '/'),
                    remain: m2,
                }
            } else {
                return {
                    month: m + (separate || '/'),
                }
            }
        }
    }

    const handleChangeDay = (input = '', value, remainMonth) => {
        const date = moment(value, 'YYYY/MM');
        const numberOfDay = date.daysInMonth();

        // remove double zero
        const d = [input].join('').replace(/^00/gm, '0');

        let firstDay = remainMonth || d[0];
        let secondDay = d[1];

        if (+firstDay * 10 > numberOfDay) {
            secondDay = firstDay;
            firstDay = '0';
        }

        const result = [];
        result.push(firstDay || '');
        result.push(secondDay || '');

        return result.join('');
    }

    const onChange = (event) => {
        const { inputType } = event.nativeEvent;

        const value = event.target.value;

        // remove leading zero
        const removeLeadingZero = value.replace(/^0|^\//gm, '');

        // remove double splash
        const removeDbSplash = removeLeadingZero.replace(/\/\//gm, '/');

        // remove character that are not number or splash
        const removeNotDigitOrSplash = removeDbSplash.replace(/[^0-9\/]/, '');

        // prevent input over format
        const preventInputOver = (removeNotDigitOrSplash.match(dateFormat) || []).join('');

        const [_, yearInput, yearSplash, monthInput, monthSplash, dayInput] = new RegExp(dateFormat).exec(preventInputOver) || [];

        if (/^insert/gm.test(inputType)) {
            if (_) {
                const values = [];

                // push year value
                values.push(handleChangeYear(yearInput, 4, yearSplash));

                // push month value and calculate remain month (if available)
                const { month, remain } = handleChangeMonth(monthInput, monthSplash);
                values.push(month);

                // push day value
                values.push(handleChangeDay(dayInput, values.join(''), remain));

                const dateValue = values.join('');
                if (dateValue.length === 'YYYY/MM/DD'.length) {
                    const validDate = moment(dateValue, ['YYYY/MM/DD'], true).format('YYYY/MM/DD');

                    event.target.value = validDate;

                    onValueChange(validDate);

                    return;
                }

                event.target.value = dateValue;
                onValueChange(dateValue);
            }
            return;
        }

        if (!_) {
            event.target.value = preventInputOver.replace(/[^0-9]/, '');
        } else {
            event.target.value = preventInputOver.replace(/\/\//gm, '/');
        }
        onValueChange(event.target.value);
    }

    const onBlur = (event) => {
        const { value } = event.target;
        if (value) {
            const validDate = moment(value, ['YYYY/MM/D', 'YYYY/MM/DD', 'YYYY/M/D', 'YYYY/M/DD'], true).format('YYYY/MM/DD');

            event.target.value = validDate;

            onValueChange(validDate);
        }
    }

    return <div>
        <input value={defaultValue} onBlur={onBlur} onChange={onChange} placeholder={placeholder} />
    </div>
}

export default DateInput;

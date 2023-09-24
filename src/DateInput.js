import moment from "moment";
import { useMemo } from "react";

const dateFormat = /^(\d{0,4})(\/)?(\d{0,2})(\/)?(\d{0,2})/gm;

const DateInput = ({ value, placeholder, onValueChange }) => {
    const defaultValue = useMemo(() => value, [value]);

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

        const [_, year, yearSplash, month, monthSplash, day, day1, day2] = new RegExp(dateFormat).exec(preventInputOver) || [];

        // console.log({ year, yearSplash, month, monthSplash, day1, day2 })
        if (/^insert/gm.test(inputType)) {
            if (_) {
                const finalValue = [];

                if (year) {
                    finalValue.push(year);
                    if (year.length === 4) {
                        finalValue.push(yearSplash || '/');
                    }
                }

                let remainMonth = '';

                if (month) {
                    // remove 00 or 0/ by 0 (prevent input double zero or splash after zero)
                    const m = [month].join('').replace(/^00|^0\//gm, '0');

                    const m1 = m[0];
                    const m2 = m[1];

                    const monthLength = m.length;

                    if (monthLength === 1) {
                        if (+m1 > 1) {
                            finalValue.push(String(m1).padStart(2, '0'));
                            finalValue.push(monthSplash || '/');
                        } else {
                            finalValue.push(m1);
                        }
                    }

                    if (monthLength === 2) {
                        if (+m > 12) {
                            finalValue.push(String(m1).padStart(2, '0'));
                            finalValue.push(monthSplash || '/');
                            remainMonth = m2;
                        } else {
                            finalValue.push(m);
                            finalValue.push(monthSplash || '/');
                        }
                    }
                }

                if (remainMonth || day) {
                    const date = moment(finalValue.join(''), 'YYYY/MM');
                    const numberOfDay = date.daysInMonth();

                    // remove double zero
                    const d = [day].join('').replace(/^00/gm, '0');

                    let firstDay = remainMonth || d[0];
                    let secondDay = d[1];

                    if (+firstDay * 10 > numberOfDay) {
                        secondDay = firstDay;
                        firstDay = '0';
                    }

                    finalValue.push(firstDay || '');
                    finalValue.push(secondDay || '');

                    if (d.length === 2) {
                        const validDate = moment(finalValue.join(''), ['YYYY/MM/DD'], true).format('YYYY/MM/DD');

                        event.target.value = validDate;

                        onValueChange(validDate);

                        return;
                    }
                }

                event.target.value = finalValue.join('');
                onValueChange(finalValue.join(''));
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

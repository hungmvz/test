import moment from "moment";
import { useMemo } from "react";

const dateFormat = /^(\d{0,4})(\/)?((\d{1})(\d{1})?)?(\/)?((\d{1})(\d{1})?)?/gm;

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

        const [_, year, yearSplash, month, month1, month2, monthSplash, , day1, day2] = new RegExp(dateFormat).exec(preventInputOver) || [];

        if (/^insert/gm.test(inputType)) {
            if (_) {
                const finalValue = [];

                if (year) {
                    finalValue.push(year);
                    if (year.length === 4) {
                        finalValue.push(yearSplash || '/');
                    }

                    if (month) {
                        let firstDay = day1;
                        let secondDay = day2;

                        const monthLength = month.length;

                        if (monthLength === 1) {
                            if (month1 === '0' && monthSplash) {
                                finalValue.push(month1);
                                event.target.value = finalValue.join('');
                                onValueChange(finalValue.join(''));
                                return;
                            }
                            if (monthSplash || +month1 > 1) {
                                finalValue.push(String(month1).padStart(2, '0'));
                                finalValue.push(monthSplash || '/');
                            } else {
                                finalValue.push(month1);
                            }
                        }

                        if (monthLength === 2) {
                            if (month1 === '0' && month2 === '0') {
                                finalValue.push(month1);
                                event.target.value = finalValue.join('');
                                onValueChange(finalValue.join(''));
                                return;
                            }
                            if (+month > 12) {
                                finalValue.push(String(month1).padStart(2, '0'));
                                finalValue.push(monthSplash || '/');
                                firstDay = month2;
                            } else {
                                finalValue.push(month);
                                finalValue.push(monthSplash || '/');
                            }
                        }

                        if (firstDay) {
                            const date = moment(finalValue.join(''), 'YYYY/MM');
                            const numberOfDay = date.daysInMonth();

                            if (firstDay === '0' && day2 === '0') {
                                event.target.value = finalValue.join('');
                                onValueChange(finalValue.join(''));
                                return;
                            }

                            if (+firstDay * 10 > numberOfDay) {
                                finalValue.push(String(firstDay).padStart(2, '0'));
                                event.target.value = finalValue.join('');

                                firstDay = '0';
                                secondDay = firstDay;
                            } else {
                                finalValue.push(firstDay);
                            }

                            finalValue.push(day2 || '');

                            if (String(firstDay + secondDay).length === 2) {
                                const validDate = moment(finalValue.join(''), ['YYYY/M/DD'], true).format('YYYY/MM/DD');

                                event.target.value = validDate;

                                onValueChange(validDate);

                                return;
                            }
                        }
                    }
                }
                onValueChange(finalValue.join(''));
                event.target.value = finalValue.join('');
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
        const validDate = moment(value, ['YYYY/MM/D', 'YYYY/MM/DD', 'YYYY/M/D', 'YYYY/M/DD'], true).format('YYYY/MM/DD');

        event.target.value = validDate;

        onValueChange(validDate);
    }

    return <div>
        <input value={defaultValue} onBlur={onBlur} onChange={onChange} placeholder={placeholder} />
    </div>
}

export default DateInput;

import moment from "moment";

const dateFormat = /^(\d{0,4})(\/)?((\d{1})(\d{1})?)?(\/)?((\d{1})(\d{1})?)?/gm;
const dateExe = /^(\d{4})(\/)?((\d{1})(\d{1})?)?(\/)?((\d{1})(\d{1})?)?/gm;

const App = () => {
  const onChange = (event) => {
    const { data, inputType } = event.nativeEvent;

    console.log('data: ', data, inputType);
    const value = event.target.value;

    // remove leading zero
    const removeLeadingZero = value.replace(/^0|^\//gm, '');

    // remove double splash
    const removeDbSplash = removeLeadingZero.replace(/\/\//gm, '/');

    // remove character that are not number or splash
    const removeNotDigitOrSplash = removeDbSplash.replace(/[^0-9\/]/, '');

    // prevent input over format
    const preventInputOver = (removeNotDigitOrSplash.match(dateFormat) || []).join('');

    const [_, year, yearSplash, month, month1, month2, monthSplash, day, day1, day2] = new RegExp(dateFormat).exec(preventInputOver) || [];

    console.log({ _, year, yearSplash, month, month1, month2, monthSplash, day, day1, day2 });

    if (/^insert/gm.test(inputType)) {
      if (_) {
        const finalValue = [];

        if (year) {
          finalValue.push(year);
          if (year.length === 4) {
            finalValue.push(yearSplash || '/');
          }

          if (month) {
            if (month.length === 1) {
              if (month1 !== '0') {
                if (monthSplash) {
                  finalValue.push(String(month1).padStart(2, '0'));
                  finalValue.push(monthSplash);
                } else {
                  finalValue.push(month1);
                }
              } else {
                finalValue.push(month1);
                if (monthSplash) {
                  event.target.value = finalValue.join('');
                  return;
                }
              }
            }
            if (month.length === 2) {
              if (+month > 12) {
                finalValue.push(String(month1).padStart(2, '0'));
                finalValue.push('/');
                finalValue.push(month2);
              } else {
                finalValue.push(month);
                finalValue.push(monthSplash || '/');
              }
            }
          }
        }

        event.target.value = finalValue.join('');
      }
      return;
    }

    if (!_) {
      event.target.value = preventInputOver.replace(/[^0-9]/, '');
    } else {
      event.target.value = preventInputOver.replace(/\/\//gm, '/');
    }
  }

  return <div>
    <input onChange={onChange} />
  </div>
};

export default App;

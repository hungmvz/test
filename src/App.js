import { useState } from "react";
import DateInput from "./DateInput";
import DateInput2 from "./DateInput2";

const App = () => {
  const [value, setValue] = useState('');

  const handleDateInputValueChange = (value) => {
    setValue(value);
  }

  return <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh',
  }}>
    <DateInput2 value={value} format="YYYY/MM/DD" placeholder='YYYY/MM/DD' onValueChange={handleDateInputValueChange} />
    Date value: {value}

    <br></br>
    <button onClick={() => {
      setValue('invalid date');
    }}>Set value for date</button>
  </div>
};

export default App;

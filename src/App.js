import { useState } from "react";
import DateInput from "./DateInput";

const App = () => {
  const [value, setValue] = useState('');

  const handleDateInputValueChange = (value) => {
    setValue(value);
  }

  return <div>
    <DateInput value={value} placeholder='YYYY/MM/DD' onValueChange={handleDateInputValueChange} />
    Date value: {value}
  </div>
};

export default App;

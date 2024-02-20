import { useCallback, useMemo, useRef, useState } from "react";

const Input = (props) => {
  const {
    length = 4,
    initialValue = "",
    inputStyle,
    autoFocus,
    onChange
  } = useMemo(() => props, [props]);

  const [value, setValue] = useState(initialValue);

  // numeric value
  const numericValue = useRef(value);

  /**
   * handleChange
   * @param event React.ChangeEvent<HTMLInputElement>
   */
  const handleChange = useCallback(
    (event) => {
      const nextValue = event.target.value;
      if(nextValue?.length > 0) {
        if(new RegExp(/^\d+$|^\d+.$|^\d+(.{0,1}\d+)$/g).test(nextValue)) {
          numericValue.current = nextValue;
          setValue(nextValue);
          event.target.value = nextValue;
          event.currentTarget.value = nextValue;
          onChange?.(nextValue);
        } else {
          setValue(numericValue.current);
          event.target.value = numericValue.current;
          event.currentTarget.value = numericValue.current;
          onChange?.(numericValue.current);
        }

        return;
      }

      setValue(nextValue);
      event.target.value = nextValue;
      event.currentTarget.value = nextValue;
      onChange?.('');
    },
    [onChange]
  );

  /**
   * handleBeforeInput
   * @param event React.CompositionEvent<HTMLInputElement>
   */
  const handleBeforeInput = useCallback(
    (event) => {
      const str = event.currentTarget.value;
      const sub = event.data;

      /**
       * /^\d+$/gm: Check only number (0-9) can input
       */
      if (/^\d?(.{0,1}\d+)$/gm.test(sub) && str.length < length) {
        const value = `${str}${sub}`;
        numericValue.current = value;
      }
    },
    [length]
  );

  /**
   * handleKeyDown
   * @param event React.KeyboardEvent<HTMLInputElement>
   */
  const handleKeyDown = useCallback((event) => {
    if (["Backspace"].includes(event.key)) {
      const currentValue = numericValue.current;

      numericValue.current = currentValue.slice(0, -1);
    }
  }, []);

  return (
    <input
      type="tel"
      value={value}
      onChange={handleChange}
      // onBeforeInput={handleBeforeInput}
      // onKeyDown={handleKeyDown}
    />
  );
};

export default Input;

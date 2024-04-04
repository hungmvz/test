import clsx from "clsx";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import "./styles.scss";

/**
 * inputStyleCommon
 * @param props OTPInputItemProps
 * @returns CSSProperties
 */
export const inputStyleCommon = ({ focused }) => ({
  width: 30,
  border: "none",
  borderBottomWidth: 2,
  borderBottomStyle: "solid",
  borderRadius: 0,
  borderBottomColor: focused ? "#0068B7" : "#B3B7BA",
  marginLeft: 8,
  marginRight: 8,
  fontFamily: "Noto Sans JP",
  color: "#0068B7",
  fontSize: 24,
  fontWeight: 700
});

/**
 * FakeCursorPointer
 * @param props FakeCursorPointerProps
 * @returns React.JSX.Element
 */
const FakeCursorPointer = (props) => {
  const { isFocused, cursorStyle } = useMemo(() => props, [props]);
  return (
    <div
      id="OTPInput_fake_cursor_pointer"
      style={cursorStyle}
      className={clsx({ focused: isFocused })}
    />
  );
};

/**
 * OTPInput
 * @param props OTPInputProps
 * @returns React.JSX.Element
 */
const OTPInput = forwardRef((props, ref) => {
  const {
    length = 4,
    initialValue = "",
    inputStyle,
    autoFocus,
    onChange
  } = useMemo(() => props, [props]);

  const [value, setValue] = useState(initialValue);

  const focusedIndex = useMemo(
    () => Math.min(value?.length, length - 1),
    [length, value?.length]
  );

  // otp input ref
  const otpInputRef = useRef(null);

  // numeric value
  const numericValue = useRef(value);

  // focus on otp input
  const [isFocused, setFocused] = useState(false);

  /**
   * handleOTPInputFocus
   */
  const handleOTPInputFocus = useCallback(() => {
    setFocused(true);
  }, []);

  /**
   * handleOTPInputBlur
   */
  const handleOTPInputBlur = useCallback(() => {
    setFocused(false);
  }, []);
  const [state, setState] = useState();

  /**
   * handleOTPInputChange
   * @param event React.ChangeEvent<HTMLInputElement>
   */
  const handleOTPInputChange = useCallback(
    (event) => {
      const { inputType, data } = event.nativeEvent;
      const value = event.target.value;
      if (Boolean(inputType) === false && Boolean(data) === false && value) {
        numericValue.current = value;
      }
      const nextValue = numericValue.current;
      setValue(nextValue);
      event.target.value = nextValue;
      event.currentTarget.value = nextValue;
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
      if (/^\d+$/gm.test(sub) && str.length < length) {
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

  /**
   * renderOTPInputItem
   * @param index number
   */
  const renderOTPInputItem = useCallback(
    (index) => {
      const isFocusedItem = isFocused && focusedIndex === index;

      let style = undefined;
      if (typeof inputStyle === "object") {
        style = inputStyle;
      }
      if (typeof inputStyle === "function") {
        style = inputStyle?.({
          focused: isFocusedItem
        });
      }
      return (
        <div key={index} className={clsx("OTPInput__inputItem")} style={style}>
          {value[index]}
          <FakeCursorPointer isFocused={isFocusedItem} />
        </div>
      );
    },
    [focusedIndex, inputStyle, isFocused, value]
  );

  /**
   * handleClearOTPInput
   */
  const handleClearOTPInput = useCallback(() => {
    setValue("");
  }, []);

  /**
   * handleFocusOTPInput
   */
  const handleFocusOTPInput = useCallback(() => {
    otpInputRef?.current?.focus?.();
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        clear: handleClearOTPInput,
        focus: handleFocusOTPInput
      };
    },
    [handleClearOTPInput, handleFocusOTPInput]
  );

  useEffect(() => {
    // Detect feature support via OTPCredential availability
    if ("OTPCredential" in window) {
      const ac = new AbortController();
      navigator.credentials
      .get({
        otp: { transport: ["sms"] },
          signal: ac.signal
        })
        .then(otp => {
          setValue(otp.code);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div
      id="OTPInput_common_component_wrapper"
      className="d-flex align-items-center justify-content-center"
    >
      <div
        className="OTPInput justify-content-center d-flex flex-row flex-wrap"
        style={{
          position: "relative"
        }}
      >
        {Array.from({ length }, (v, i) => i).map(renderOTPInputItem)}
        <input
          ref={otpInputRef}
          maxLength={length}
          autoComplete="one-time-code"
          autoCapitalize="none"
          autoFocus={autoFocus}
          type="tel"
          className="OTPInput__hiddenInput"
          value={value}
          onFocus={handleOTPInputFocus}
          onBlur={handleOTPInputBlur}
          onChange={handleOTPInputChange}
          onBeforeInput={handleBeforeInput}
          onKeyDown={handleKeyDown}
        />
        <p>
          <span>{value}</span>
        </p>
      </div>
    </div>
  );
});

OTPInput.displayName = "OTPInput";

export default OTPInput;

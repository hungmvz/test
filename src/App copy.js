import { useState } from 'react';
import './App.css';

// regex check html tags
const htmlTags = /<(.*?)>/gm;

// regex check for the first time
const firstCheckRegex = /^<fcolor=(['|"])[a-z]+\1>(.*?)<\/fcolor>$|^<fsize=(['|"])[0-9]+\3>(.*?)<\/fsize>$|^<a>[^<(.*?)>]*<\/a>$/gm;

// regex check for the next time
const secondCheckRegex = /<fcolor=(['|"])[a-z]+\1>(.*?)<\/fcolor>|<fsize=(['|"])[0-9]+\3>(.*?)<\/fsize>|<a>[^<(.*?)>]*<\/a>/gm;

const newSecond = /<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)|<([a-z]*)\b[^>]*>|<\/([a-z]*)\b[^>]*>|<([a-z]*)\b[^>]*\/>/gm;

function App() {
  const [value, setValue] = useState('');

  /**
   * executeValidate
   * @param {RegExp} regex regex expression
   * @param {string} value text value
   * @returns Boolean
   */
  const executeValidate = (regex, value) => {
    // test value
    const isPassed = regex.test(value);

    // nextValue is the content inside first tag.
    const nextValue = value.replace(regex, (_, _1, fColor, _3, fSize, close) => {
      // console.log({ _1, fColor, fSize, close });
      return fColor || fSize;
    });

    console.log({ value, nextValue });
    // console.log({ value, nextValue });
    // if isPassed is true and nextValue is match with htmlTags regex
    if (isPassed && nextValue.match(htmlTags)) {
      // execute validate with nextValue
      return executeValidate(firstCheckRegex, nextValue);
    }
    // otherwise, return current value
    return isPassed
  }

  const executeValidate2 = (value) => {
    const matches = value.match(secondCheckRegex);

    console.log(matches);
  }

  /**
   * validateFn
   * @param {String} value 
   * @returns Boolean
   */
  const validateFn = (value) => {
    // execute validate with firstCheckRegex
    return executeValidate2((value.match(/<[^>]*>/gm) || []).join(''));
  }

  return (
    <div className="App">
      <header className="App-header">
        <textarea style={{
          width: '90%',
          height: 300,
        }} onChange={(e) => {
          setValue(e.target.value);
        }} />
        <span>{validateFn(value) ? 'valid' : 'invalid'}</span>
      </header>
    </div>
  );
}

export default App;

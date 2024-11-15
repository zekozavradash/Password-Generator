import { useState, useEffect, useRef } from 'react';
import copy from './assets/fa-regular_copy.png';
import './App.css';

function App() {
  const [password, setPassword] = useState('');
  const [charLength, setCharLength] = useState(10); // Default range set to 10
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [strength, setStrength] = useState('');

  const passwordRef = useRef<HTMLParagraphElement>(null);

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharLength(Number(e.target.value));
  };

  const handleCheckboxChange = (
    setCheckbox: React.Dispatch<React.SetStateAction<boolean>>,
    isChecked: boolean
  ) => {
    const checkedCount = [
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    ].filter(Boolean).length;

    if (checkedCount === 1 && isChecked) {
      return;
    }

    setCheckbox((prev) => !prev);
  };

  useEffect(() => {
    const checkedCount = [
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    ].filter(Boolean).length;

    if (checkedCount === 1) {
      setStrength('TOO WEAK!');
    } else if (checkedCount === 2) {
      setStrength('WEAK');
    } else if (checkedCount === 3) {
      setStrength('MEDIUM');
    } else if (checkedCount === 4) {
      setStrength('STRONG');
    } else {
      setStrength('');
    }
  }, [includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const generatePassword = () => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';
  
    let charSet = '';
    if (includeUppercase) charSet += uppercaseChars;
    if (includeLowercase) charSet += lowercaseChars;
    if (includeNumbers) charSet += numberChars;
    if (includeSymbols) charSet += symbolChars;
  
    if (!charSet) return '';
  
    let generatedPassword = '';
    for (let i = 0; i < charLength; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      generatedPassword += charSet[randomIndex];
    }
  
    // Trigger scrambling effect
    if (passwordRef.current) {
      const element = passwordRef.current;
      const value = generatedPassword;
      let iteration = 0;
  
      const interval = setInterval(() => {
        element.innerText = value
        .split('')
        .map((_, index) => {
          if (index < iteration) {
            return value[index];
          }
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join('');

  
        if (iteration >= value.length) {
          clearInterval(interval);
          setPassword(value); // Set the final password after animation
        }
  
        iteration += 1 / 3;
      }, 30);
    }
  };
  

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
    }
  };

  const getStrengthBarColor = (index: number) => {
    if (strength === 'TOO WEAK!' && index === 0) return '#F64A4A';
    if (strength === 'WEAK' && index < 2) return '#FB7C58';
    if (strength === 'MEDIUM' && index < 3) return '#F8CD65';
    if (strength === 'STRONG' && index < 4) return '#A4FFAF';
    return '#2a2a2a';
  };


  return (
    <>
      <div className="mainContainer">
        <div className="container">
          <p className="header">Password Generator</p>
          <div className="passwordDiv">
            <div className="innerPassworDiv">
              <p
                ref={passwordRef}
                className="password"
              >
                {password}
              </p>
              <button className="copyButton" onClick={copyToClipboard}>
                <img src={copy} alt="Copy icon" className="copyimg" />
              </button>
            </div>
          </div>
          <div className="customization">
            <div className="wholeRange">
              <div className="aboveRange">
                <p className="characterLength">Character Length</p>
                <p className="changeOnRange">{charLength}</p>
              </div>
              <input
                className="range"
                type="range"
                min="1"
                max="20"
                value={charLength}
                onChange={handleRangeChange}
                style={{
                  background: `linear-gradient(to right, #9aff9a ${
                    ((charLength - 1) / 19) * 100
                  }%, #2a2a2a ${((charLength - 1) / 19) * 100}%)`,
                }}
              />
            </div>
            <div className="checkboxes">
              <div className="checkboxDiv">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={() =>
                    handleCheckboxChange(setIncludeUppercase, includeUppercase)
                  }
                />
                <p className="checkboxTxt">Include Uppercase Letters</p>
              </div>
              <div className="checkboxDiv">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={() =>
                    handleCheckboxChange(setIncludeLowercase, includeLowercase)
                  }
                />
                <p className="checkboxTxt">Include Lowercase Letters</p>
              </div>
              <div className="checkboxDiv">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={() =>
                    handleCheckboxChange(setIncludeNumbers, includeNumbers)
                  }
                />
                <p className="checkboxTxt">Include Numbers</p>
              </div>
              <div className="checkboxDiv">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={() =>
                    handleCheckboxChange(setIncludeSymbols, includeSymbols)
                  }
                />
                <p className="checkboxTxt">Include Symbols</p>
              </div>
            </div>
            <div className="strength">
              <p className="strengthName">STRENGTH</p>
              <div className="strengthDiv">
                <p className="strengthShow">{strength}</p>
                <div className="strengthBarDiv">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="strengthBar"
                      style={{ backgroundColor: getStrengthBarColor(index) }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <button className="generateBtn" onClick={generatePassword}>
              GENERATE
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './extra.css';
import reportWebVitals from './reportWebVitals';


// base app functional component that we render and has state
function App() {
  const [myState, setMyState] = React.useState({input: '0', formula: ''});

  return (
    <div>
      {Display(myState.input, myState.formula)}
      {Calc(setMyState)}
    </div>
  )
}

// display section functional component
function Display(input, formula) {
  return (
    <div id="display-box">
      <h5
        id="display-formula">
        {formula}
      </h5>
      <h2 id="display">
        {input}
      </h2>
    </div>
  );
}

// calc section functional component
function Calc(setMyState) {
  return (
    <div id="keys">
      <div>
        {Key('AC', 'clear', setMyState)}
        {Key('/', 'divide', setMyState)}
      </div>
      <div>
        {Key('7', 'seven', setMyState)}
        {Key('8', 'eight', setMyState)}
        {Key('9', 'nine', setMyState)}
        {Key('x', 'multiply', setMyState)}
      </div>
      <div>
        {Key('4', 'four', setMyState)}
        {Key('5', 'five', setMyState)}
        {Key('6', 'six', setMyState)}
        {Key('-', 'subtract', setMyState)}
      </div>
      <div>
        {Key('1', 'one', setMyState)}
        {Key('2', 'two', setMyState)}
        {Key('3', 'three', setMyState)}
        {Key('+', 'add', setMyState)}
      </div>
      <div>
        {Key('0', 'zero', setMyState)}
        {Key('.', 'decimal', setMyState)}
        {Key('=', 'equals', setMyState)}
      </div>
    </div>
  )
}

// key section functional component called by calc to create keys
function Key(key, id, setMyState) {  
  return (
    <button
      onClick={(e) => {return clickHandler(e.target.innerText, setMyState)}}
      id={id}
      >
      {key}
    </button>
  )
}

// callback handler for onclick events from keys
function clickHandler(key, setMyState) {
  setMyState((prev) => {
    
    // setup our return object
    // init with previous values
    let ret_obj = {
      input: prev.input,
      formula: prev.formula
    }
    
    // handle no double zero on left side of decimal
    if (prev.input === '0' && key === '0') {
      return ret_obj;
    }
    
    // handle clear key
    else if (key === "AC") {
      ret_obj.input = "0";
      ret_obj.formula = "";
      return ret_obj;
    }
    
    // handle math operators
    else if (key.search(/[/x+-]/) >= 0) {
      
      // use correct multiply key for math using eval
      if (key === "x") {key = "*"}
      
      // if there is a complete formula in the formula display remove everything up to and including the equal operator leaving only the previous total
      // push operator into input and formula display
      let equal_index = ret_obj.formula.search("=")
      if (equal_index >= 0) {
        ret_obj.input = key;
        ret_obj.formula = ret_obj.formula.slice(equal_index + 1) + key;
        return ret_obj;
      }
      
      // subtract operator is immune from the repeated operator logic below
      // replace input display with operator and push operator into formula display
      if (key === "-") {
        ret_obj.input = key;
        ret_obj.formula += key;
        return ret_obj;
      }
      
      
      // while the last char in the formula is an operator (excluding subtract operator) remove all operators from end of formula
      // after breaking out of loop fall through to default option
      // replace input display with operator and push operator into formula display
      let last_form_char = ret_obj.formula.charAt(ret_obj.formula.length - 1)
      while (last_form_char.search(/[/x*+-]/) >= 0) {
        ret_obj.formula = ret_obj.formula.slice(0,-1);
        last_form_char = ret_obj.formula.charAt(ret_obj.formula.length - 1) 
      }
      
      // default option
      // replace input display with operator and push operator into formula display
      ret_obj.input = key;
      ret_obj.formula += key;
      return ret_obj;
    }
    
    // handle equals
    else if (key === "=") {
      // use eval() to perform math on the displayed formula and obtain total
      // replace input display with total and push = and total into formula display
      let total = eval(ret_obj.formula)
      ret_obj.input = total;
      ret_obj.formula += key + total;
      return ret_obj;
    }
    
    // handle decimal
    else if (key === '.') {
      
      // no more than one decimal
      if (prev.input.search(/\./) >= 0) {
        return ret_obj;
      }
      
      // if the display is at initial values
      // push . into input display
      // push 0. into formula display
      else if (prev.input === "0" && prev.formula === '') {
        ret_obj.input += key;
        ret_obj.formula += prev.input + key;
        return ret_obj;
      }
      
      // if input display has a math operator in it
      // set input display to 0.
      // push 0. into formula display
      else if (prev.input.search(/[/x+-]/) >= 0) {
        ret_obj.input = '0' + key;
        ret_obj.formula += '0' + key;
        return ret_obj;
      }
      
      // default option
      // push . into input display
      // push . into formula display
      ret_obj.input += key;
      ret_obj.formula += key;
      return ret_obj;
    }
    
    // handle 0-9
    else if (key.search(/[0-9]/) >= 0) {
      
      // if previous key is a single 0 or a math operator
      // set input display to key number
      if (prev.input === '0' || prev.input.search(/[/x*+-]/) >= 0) {
        ret_obj.input = key
      }
      
      // must be just another number in the input display
      // push key number into input display
      else {
        ret_obj.input += key;
      }
      
      // push key number into formula display
      ret_obj.formula += key;
      return ret_obj;
    }

  })
}




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

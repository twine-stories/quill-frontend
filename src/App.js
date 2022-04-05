import logo from './logo.svg';
import './App.css';

function App() {
    // const Http = new XMLHttpRequest();
    // const url='http://localhost:8080/greeting';
    // Http.open("GET", url);
    // Http.send();

    // Http.onreadystatechange = (e) => {
    //     console.log(Http.responseText)
    // }
    fetch('/api/greeting?name=Rithik')
        // .then(response => console.log(response));
        .then(response => response.json())
        .then(data => console.log(data));
    return (
        <div className="App">
            <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
                Learn React
            </a>
            </header>
        </div>
    );
}

export default App;

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
        <img id="header" src="twine.png" alt="Twine" />
        <div className='content'>
            <div className="left">
                <p>self-publishing platform for authors and illustrators to collab, profit-share & retain 90%+ of revenue</p>
                <a href="mailto:info@twinestories.com" id="wrapper">
                    <img id="mail" src="mail.png" alt="mail!" />
                    <div id="email" className="purple">info@twinestories.com</div>
                </a>
            </div>
            <div className="right">
                <img id="digging" src="digging.png" alt="coming soon!" />
                <p id="comingSoon" className="purple">coming soon!</p>
            </div>
        </div>
    </div>
  );
}

export default App;

import './App.css';

import { Map } from 'openlayers-react';
import React from 'react';

const App: React.FC = () => {
    React.useEffect(() => {
        console.log('mounted');
    }, []);
    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Edit <code>src/App.tsx</code> and save to reload
                </p>
                <Map />
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>
    );
};

export default App;

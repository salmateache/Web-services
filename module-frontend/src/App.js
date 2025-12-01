import React, { useState } from 'react';
import ModuleList from './components/ModuleList';
import NoteList from './components/NoteList';
import Bulletin from "./components/Bulletin";
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('modules');

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          {currentView === 'modules' ? 'Gestion des Modules' : 
           currentView === 'notes' ? 'Gestion des Notes' :
           'Bulletin'}
        </h1>

        <nav className="nav-menu">
          <button 
            className={currentView === 'modules' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('modules')}
          >
            Modules
          </button>

          <button 
            className={currentView === 'notes' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('notes')}
          >
            Notes
          </button>

          {/* ✅ NEW BUTTON FOR BULLETIN */}
          <button 
            className={currentView === 'bulletin' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('bulletin')}
          >
            Bulletin
          </button>
        </nav>
      </header>
      
      <div className="content">
        {currentView === 'modules' && <ModuleList />}
        {currentView === 'notes' && <NoteList />}
        
        {/* ✅ NEW SECTION: RENDER BULLETIN */}
        {currentView === 'bulletin' && <Bulletin />}
      </div>
    </div>
  );
}

export default App;

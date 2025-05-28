import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './index.css'; // Use Tailwind's CSS instead of App.css
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Footer />
        </div>
    );
}

export default App;

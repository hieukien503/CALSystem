import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './Home';
import CalApp from './CalApp';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import SignUp from './SignUp';
import ProfilePage from './ProfilePage';
import SearchResults from './SearchResults';
import './index.css'; // Use Tailwind's CSS instead of App.css
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <CalApp />

            {/*<ProfilePage />*/}
            {/*<SearchResults />*/}
            {/*<Home />*/}
            {/*<SignUp />*/}
            <Footer />
        </div>
    );
}

export default App;
                   
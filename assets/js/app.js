import React, { useState } from 'react';
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import AuthContext from '../js/contexts/AuthContext';
import DiaryPage from '../js/pages/DiaryPage';
import AuthAPI from '../js/services/authAPI';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import ClientsPage from './pages/ClientsPage';
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';



// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.css');

AuthAPI.setup();

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthAPI.isAuthenticated());

    const NavbarWithRouter = withRouter(Navbar);

    return (<AuthContext.Provider value={{
                isAuthenticated,
                setIsAuthenticated
            }}>
                <HashRouter> 
                    <NavbarWithRouter />

                    <main className="container pt-5">
                        <Switch>
                            <Route path="/login" component={LoginPage} /> 
                            <PrivateRoute path="/clients" component={ClientsPage} />
                            <PrivateRoute path="/diary" component={DiaryPage} />
                            <PrivateRoute path="/factures" component={InvoicesPage} />
                            <Route path="/" component={HomePage} />
                        </Switch>
                    </main>
                </HashRouter>
            </AuthContext.Provider>);
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);

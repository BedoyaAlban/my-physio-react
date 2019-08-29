import React, { useState } from 'react';
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import AuthContext from '../js/contexts/AuthContext';
import DiaryPage from '../js/pages/DiaryPage';
import AuthAPI from '../js/services/authAPI';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import ClientsPage from './pages/ClientsPage';
import ClientPage from './pages/ClientPage';
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPage';
import InvoicePage from './pages/InvoicePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyPhysio from './pages/MyPhysio';




// any CSS you require will output into a single css file (app.css in this case)
require('../css/bootstrap.css');
require('../css/app.css');
require('../scss/breakpoints.scss');
require('../scss/media.scss');

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
                            <Route path="/register" component={RegisterPage} />
                            <PrivateRoute path="/home" component={HomePage} />
                            <PrivateRoute path="/clients/:id" component={ClientPage} />
                            <PrivateRoute path="/clients" component={ClientsPage} />
                            <PrivateRoute path="/diary" component={DiaryPage} />
                            <PrivateRoute path="/factures/:id" component={InvoicePage} />
                            <PrivateRoute path="/factures" component={InvoicesPage} />
                            <Route path="/" component={MyPhysio} />
                        </Switch>
                    </main>
                </HashRouter>
                <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
            </AuthContext.Provider>);
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);

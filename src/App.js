import React from "react";
import { hot } from "react-hot-loader/root";
import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router";
import { IntlProvider } from "react-intl";

import Home from "./components/home/home";
import Footer from "./components/footer/footer";
import { GetUser } from "./store/selectors/auth";
import {
  GetIsSiteinited,
  GetSiteLanguageId,
  GetSiteLanguageMessages,
} from "./store/selectors/app-selector";
import SignIn from "./components/auth/sign-in/sign-in";
import SignUp from "./components/auth/sign-up/sign-up";
import Dialog from "./components/dialog/dialog";
import Settings from "./components/settings/settings";
import {
  GetIsSessionInProgress,
  GetIsSessionClosing,
} from "./store/selectors/session";

import "./App.scss";
import Gameplay from "./components/gameplay/gameplay";

const App = () => {
  const user = useSelector(GetUser);
  const isSiteinited = useSelector(GetIsSiteinited);
  const siteLanguageId = useSelector(GetSiteLanguageId);
  const siteLanguageMessages = useSelector(GetSiteLanguageMessages);
  const isSessionInProgress = useSelector(GetIsSessionInProgress);
  const isSessionClosing = useSelector(GetIsSessionClosing);

  const redirectToHome = () => (
    <Redirect
      to={{
        pathname: "/",
      }}
    />
  );

  const redirectToLogin = () => (
    <Redirect
      to={{
        pathname: "/sign-in",
      }}
    />
  );

  const redirectToSettingsHome = () => (
    <Redirect
      to={{
        pathname: "/settings/profile",
      }}
    />
  );

  return (
    <IntlProvider
      locale={siteLanguageId}
      messages={siteLanguageMessages}
      onError={() => {}}
    >
      <BrowserRouter basename="/">
        <div className={`AppLoader ${isSiteinited && "Loaded"}`}>
          loading...
        </div>
        {isSiteinited && (
          <div className="App">
            <Dialog />
            {isSessionInProgress || isSessionClosing ? (
              "session..."
            ) : (
              <>
                {/* <CourseState /> */}
                {user ? (
                  <>
                    <Switch>
                      <Route exact path="/" component={Home} />
                      <Route
                        exact
                        path="/settings"
                        render={redirectToSettingsHome}
                      />
                      <Route path="/settings" render={Settings} />
                      <Route path="/sign-in" render={redirectToHome} />
                      <Route path="/sign-up" render={redirectToHome} />
                    </Switch>
                    <Footer />
                  </>
                ) : (
                  <>
                    <Switch>
                      <Route exact path="/" component={Home} />
                      <Route path="/sign-in" component={SignIn} />
                      <Route path="/sign-up" component={SignUp} />
                      <Route path="/settings" render={redirectToLogin} />
                    </Switch>
                    <Footer />
                  </>
                )}
              </>
            )}
          </div>
        )}
        <Gameplay />
      </BrowserRouter>
    </IntlProvider>
  );
};

export default hot(App);

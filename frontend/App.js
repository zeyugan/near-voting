import "regenerator-runtime/runtime";
import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from './assets/logo.png';

import "bootstrap/dist/css/bootstrap.min.css";

import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import { Button, Card, Row } from "react-bootstrap";

//Components
import Home from "./Components/Home";
import NewPoll from "./Components/NewPoll";
import PollingStation from "./Components/PollingStation";
require("dotenv").config();

/***
 * App Component of main application
 * @param {isSignedIn} isSignedIn - boolean value to check if user is signed in
 * @param {contractId} contractId - contract account id to interact with the voting app
 * @param {wallet} wallet - user's wallet session to interact with the contract
 */
export default function App({ isSignedIn, contractId, wallet }) {
  const [promptList, changePromptList] = useState([]);

  const callMethod = async (methodName, args = {}) => {
    wallet.callMethod({
      contractId: contractId,
      method: methodName,
      args: args,
    });
  };

  const viewMethod = async (methodName, args = {}) => {
    return await wallet.viewMethod({
      contractId: contractId,
      method: methodName,
      args: args,
    });
  };

  const signInFun = () => {
    wallet.signIn();
  };

  const signOutFun = () => {
    wallet.signOut();
  };

  const getPrompts = async () => {
    return await viewMethod("getAllPrompts");
  };

  const displayHome = () => {
    // if user signed in, load main app Routes
    if (isSignedIn) {
      return (
        <Routes>
          <Route
            path="/"
            element={
              <Home
                wallet={wallet}
                callMethod={callMethod}
                viewMethod={viewMethod}
                changeCandidates={changeCandidatesFunction}
                getPrompts={getPrompts}
                promptList={promptList}
                changePromptList={changePromptList}
              />
            }
          ></Route>
          <Route
            path="/newpoll"
            element={
              <NewPoll
                wallet={wallet}
                callMethod={callMethod}
                viewMethod={viewMethod}
                getPrompts={getPrompts}
                promptList={promptList}
                changePromptList={changePromptList}
              />
            }
          ></Route>
          <Route
            path="/pollingstation"
            element={
              <PollingStation
                wallet={wallet}
                callMethod={callMethod}
                viewMethod={viewMethod}
              />
            }
          ></Route>
        </Routes>
      );
    } else {
      return (
        <Container>
          <Row className="justify-content-center d-flex">
            <Card style={{ marginTop: "5vh", width: "30vh" }}>
              <Container>
                <Row>Hey there bud! Please Sign in :D </Row>
                <Row className="justify-content-center d-flex">
                  <Button style={{ margin: "5vh" }} onClick={signInFun}>
                    Login
                  </Button>
                </Row>
              </Container>
            </Card>
          </Row>
        </Container>
      );
    }
  };

  const changeCandidatesFunction = async (prompt) => {
    console.log(prompt);
    let namePair = await viewMethod("getCandidatePair", { prompt: prompt });
    await localStorage.setItem("Candidate1", namePair[0]);
    await localStorage.setItem("Candidate2", namePair[1]);
    await localStorage.setItem("prompt", prompt);
    window.location.replace(window.location.href + "PollingStation");
  };

  return (
    <Router>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        {console.log("contract account is", isSignedIn)}
        <Container>
          <Navbar.Brand href="/">
            <img
                src={logo}
                alt="Logo"
                style={{
                  width: '128px',
                  height: '128px',
                  borderRadius: '50%'
                }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto"></Nav>
            <Nav>
              <Nav.Link disabled={!isSignedIn} href="/newpoll">
                New Poll
              </Nav.Link>
              <Nav.Link onClick={isSignedIn ? signOutFun : signInFun}>
                {isSignedIn ? wallet.accountId : "Login"}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {displayHome()}
    </Router>
  );
}

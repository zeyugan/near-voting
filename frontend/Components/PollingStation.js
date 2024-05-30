import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import candidate1 from '../assets/candidate1.png';
import candidate2 from '../assets/candidate2.png';
import title from '../assets/Title.png'

const PollingStation = (props) => {
  const [candidate1URL, changeCandidate1Url] = useState(
    "https://cdn2.iconfinder.com/data/icons/material-line-thin/1024/option-256.png"
  );
  const [candidate2URL, changeCandidate2Url] = useState(
    "https://cdn2.iconfinder.com/data/icons/material-line-thin/1024/option-256.png"
  );
  const [showResults, changeResultsDisplay] = useState(false);
  const [buttonStatus, changeButtonStatus] = useState(false);
  const [candidate1Votes, changeVote1] = useState(0);
  const [candidate2Votes, changeVote2] = useState(0);
  const [candidate1Name, changeCandidate1Name] = useState("");
  const [candidate2Name, changeCandidate2Name] = useState("");
  const [prompt, changePrompt] = useState("--");
  const [showModal, setShowModal] = useState(false);
  const [securityToken, setSecurityToken] = useState("");
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(null);

  const contractId = process.env.CONTRACT_NAME;

  useEffect(() => {
    const getInfo = async () => {
      let x = "localStorage";
      console.log("the prompt is", localStorage.prompt);

      let promptName = localStorage.prompt;

      let voteCount = await props.viewMethod("getVotes", {
        prompt: promptName,
      });

      console.log(voteCount);
      changeVote1(voteCount[0]);
      changeVote2(voteCount[1]);

      console.log(
        "url is ",
        await props.viewMethod("getUrl", {
          prompt: localStorage.getItem("prompt"),
          name: localStorage.getItem("Candidate1"),
        })
      );
      changeCandidate1Url(
        await props.viewMethod("getUrl", {
          prompt: localStorage.getItem("prompt"),
          name: localStorage.getItem("Candidate1"),
        })
      );
      changeCandidate2Url(
        await props.viewMethod("getUrl", {
          prompt: localStorage.getItem("prompt"),
          name: localStorage.getItem("Candidate2"),
        })
      );

      changeCandidate1Name(localStorage.getItem("Candidate1"));
      changeCandidate2Name(localStorage.getItem("Candidate2"));

      changePrompt(localStorage.getItem("prompt"));

      let didUserVote = await props.viewMethod("didParticipate", {
        prompt: localStorage.getItem("prompt"),
        user: props.wallet.accountId,
      });
      console.log("did user vote", didUserVote);

      await changeResultsDisplay(didUserVote);
      await changeButtonStatus(didUserVote);
    };

    getInfo();
  }, [showResults]);

  const verifyToken = (token) => {
    // Dummy token verification logic
    return token === "valid-token";
  };

  const handleVote = async () => {
    if (!verifyToken(securityToken)) {
      alert("Invalid security token. Please try again.");
      return;
    }

    changeButtonStatus(true);
    let receipt = await props
      .callMethod("addVote", {
        prompt: localStorage.getItem("prompt"),
        index: selectedCandidateIndex,
      })
      .then(async () => {
        console.log("recording a prompt", localStorage.getItem("prompt"));
        console.log("user Account is", props.wallet.accountId);
        await props.callMethod("recordUser", {
          prompt: localStorage.getItem("prompt"),
          user: props.wallet.accountId,
        });
      })
      .then(async () => {
        let voteCount = await props.viewMethod("getVotes", {
          prompt: localStorage.getItem("prompt"),
        });
        return voteCount;
      })
      .then((voteCount) => {
        changeVote1(voteCount[0]);
        changeVote2(voteCount[1]);
        console.log(voteCount);
      })
      .then(() => {
        alert("Thanks for voting!");
      });

    console.log(receipt);

    changeResultsDisplay(true);
    setShowModal(false);
  };

  const addVote = (index) => {
    setSelectedCandidateIndex(index);
    setShowModal(true);
  };

  return (
    <Container>
      <Row>
        <Col
          className="justify-content-center d-flex"
          style={{ width: "20vw" }}
        >
          <Container>
            <Row style={{ marginTop: "5vh", backgroundColor: "#0" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "4vw",
                }}
              >
                <img
                    src={candidate1URL ? candidate1URL : candidate1}
                    alt="Logo"
                    style={{
                      height: "40vh",
                      width: "20vw",
                      borderRadius: '50%'
                    }}
                ></img>
              </div>
            </Row>
            <Row className="justify-content-center d-flex">
              <div
                style={{
                  fontSize: "1.5vw",
                  fontWeight: "bold",
                  marginTop: "1vh",
                }}
              >
                {candidate1Name}
              </div>
            </Row>
            {showResults ? (
              <Row
                className="justify-content-center d-flex"
                style={{ marginTop: "5vh" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "8vw",
                    padding: "10px",
                    backgroundColor: "#c4c4c4",
                  }}
                >
                  {candidate1Votes}
                </div>
              </Row>
            ) : null}
            <Row
              style={{ marginTop: "5vh" }}
              className="justify-content-center d-flex"
            >
              <Button disabled={buttonStatus} onClick={() => addVote(0)}>
                Vote
              </Button>
            </Row>
          </Container>
        </Col>
        <Col
          className="justify-content-center d-flex align-items-center"
          style={{ width: "10vw" }}
        >
          <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#c0",
                height: "20vh",
                padding: "2vw",
                textAlign: "center",
              }}
          >
            <div style={{ marginBottom: "1vh",fontSize: "2rem",fontFamily: "'Arial Black', 'Arial Bold', 'Gadget', 'sans-serif'", }}>Prompt Title:</div>
            <div style={{ fontSize: "1.5rem",fontFamily: "'Arial Rounded MT Bold', 'Helvetica Rounded', 'Arial', sans-serif", }}>{prompt}</div>
            <img src={title} alt="描述" style={{ marginTop: "0vh",height: "40vh", width: "20vw", }} />
          </div>
        </Col>
        <Col
          className="justify-content-center d-flex"
          style={{ width: "20vw" }}
        >
          <Container>
            <Row style={{ marginTop: "5vh", backgroundColor: "#c4c4c4" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "4vw",
                }}
              >
                <img
                    src={candidate2URL ? candidate2URL : candidate2}
                    alt="Logo"
                    style={{
                      height: "40vh",
                      width: "20vw",
                      borderRadius: '50%'
                    }}
                ></img>
              </div>
            </Row>
            <Row className="justify-content-center d-flex">
              <div
                style={{
                  fontSize: "1.5vw",
                  fontWeight: "bold",
                  marginTop: "1vh",
                }}
              >
                {candidate2Name}
              </div>
            </Row>
            {showResults ? (
              <Row
                className="justify-content-center d-flex"
                style={{ marginTop: "5vh" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "8vw",
                    padding: "10px",
                    backgroundColor: "#0",
                  }}
                >
                  {candidate2Votes}
                </div>
              </Row>
            ) : null}
            <Row
              style={{ marginTop: "5vh" }}
              className="justify-content-center d-flex"
            >
              <Button disabled={buttonStatus} onClick={() => addVote(1)}>
                Vote
              </Button>
            </Row>
          </Container>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Vote</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSecurityToken">
              <Form.Label>Please enter your security token</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter security token"
                value={securityToken}
                onChange={(e) => setSecurityToken(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No
          </Button>
          <Button variant="primary" onClick={handleVote}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PollingStation;

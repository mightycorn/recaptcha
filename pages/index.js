import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";

import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export default function Home() {
  const [thing, setThing] = useState(null);
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [disable, setDisable] = useState(true);
  const [isRobot, setIsRobot] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [show, setShow] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [borders, setBorders] = useState(Array(9).fill(false));

  useEffect(() => {
    let things = ["bird", "lemon", "skateboard"];
    const index = Math.floor(Math.random() * things.length);
    let usedNumbers = [];
    let tempArr = [];

    setThing(things[index]);

    for (let i = 0; i < 3; ++i) {
      let number = Math.floor(1 + Math.random() * 5);
      while (tempArr.find((elem) => elem.includes(number.toString()))) {
        number = Math.floor(1 + Math.random() * 5);
      }

      usedNumbers.push(number);
      tempArr.push(`${things[index]}/${things[index]}${number}.jpg`);
    }

    things.splice(index, 1);

    for (let i = 0; i < 6; ++i) {
      let thingIndex = Math.floor(Math.random() * things.length);
      let fileNumber = Math.floor(1 + Math.random() * 5);
      let add = `${things[thingIndex]}/${things[thingIndex]}${fileNumber}.jpg`;

      while (tempArr.find((elem) => elem.includes(add))) {
        thingIndex = Math.floor(Math.random() * things.length);
        fileNumber = Math.floor(1 + Math.random() * 5);
        add = `${things[thingIndex]}/${things[thingIndex]}${fileNumber}.jpg`;
      }

      tempArr.push(add);
    }

    // Fisher-Yates Shuffle
    // Reference: https://stackoverflow.com/questions/64925666/how-can-i-sort-an-array-randomly-in-javascript
    for (let i = tempArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const k = tempArr[i];
      tempArr[i] = tempArr[j];
      tempArr[j] = k;
    }

    setImages(tempArr);
  }, [refresh]);

  useEffect(() => {
    if (selected.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [selected]);

  const click = (e, thing, num) => {
    e.stopPropagation();

    // We need to use a temporary variable and then set the new value to the
    // state value. See: https://react.dev/reference/react/useState#troubleshooting
    let tempArr = selected;

    if (!tempArr.includes(thing)) {
      tempArr.push(thing);
      setSelected([...tempArr]);
    } else {
      const index = tempArr.indexOf(thing);
      tempArr.splice(index, 1);
      setSelected([...tempArr]);
    }

    let newBorders = [...borders];
    newBorders[num] = !borders[num];
    setBorders(newBorders);
  };

  const verify = async (e) => {
    e.stopPropagation();
    setVerifying(true);

    const foo = await fetch("http://localhost:8080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        thing: thing,
        images: selected,
      }),
    });

    const result = await foo.json();
    setIsRobot(result.robot);
    setShow(true);
    setVerifying(false);
  };

  const handleClose = () => {
    setShow(false);
    setIsRobot(true);
    setSelected([]);
    setDisable(true);
    setBorders(Array(9).fill(false));
    setRefresh(!refresh);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Robot Checker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isRobot ? "beep boop you're a robot" : "hello there fellow human"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Card className={`${styles.centered} ${styles.card}`}>
        <Card.Header className="bg-primary text-white">
          Select all squares with <br></br>
          <div className={styles.thing}>{thing}</div>
          Click verify once there are none left
        </Card.Header>
        <Card.Body>
          {[0, 3, 6].map((startIndex, stackIndex) => (
            <Stack
              className={stackIndex > 0 ? styles.stack : ""}
              direction="horizontal"
              gap={1}
              key={startIndex}
            >
              {Array.from({ length: 3 }).map((_, offset) => {
                const index = startIndex + offset;
                return (
                  <Image
                    key={index}
                    className={
                      borders[index]
                        ? `img-thumbnail ${styles.border}`
                        : "img-thumbnail"
                    }
                    src={images[index]}
                    alt={`Image ${index + 1}`}
                    thumbnail
                    onClick={(e) => click(e, images[index], index)}
                  />
                );
              })}
            </Stack>
          ))}
        </Card.Body>
        <Card.Footer>
          <Button className="float-end" disabled={disable} onClick={verify}>
            {verifying ? <Spinner animation="border" size="sm" /> : "Verify"}
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
}

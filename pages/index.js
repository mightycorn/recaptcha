import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

import Modal from 'react-bootstrap/Modal'
import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'

export default function Home() {
  const [thing, setThing] = useState(null);
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [disable, setDisable] = useState(true);
  const [isRobot, setIsRobot] = useState(true);
  const [refresh, setRefresh] = useState(true);

  // This is not the cleanest solution but it works
  const [border0, setBorder0] = useState(false);
  const [border1, setBorder1] = useState(false);
  const [border2, setBorder2] = useState(false);
  const [border3, setBorder3] = useState(false);
  const [border4, setBorder4] = useState(false);
  const [border5, setBorder5] = useState(false);
  const [border6, setBorder6] = useState(false);
  const [border7, setBorder7] = useState(false);
  const [border8, setBorder8] = useState(false);

  const [show, setShow] = useState(false);

  useEffect(() => {
    let things = [ 'bird', 'lemon', 'skateboard' ];
    const index = Math.floor(Math.random() * things.length);
    let usedNumbers = [];
    let tempArr = [];

    setThing(things[index]);

    for (let i = 0; i < 3; ++i) {
      let number = Math.floor(1 + Math.random() * 5);
      while (tempArr.find(elem => elem.includes(number.toString()))) {
        number = Math.floor(1 + Math.random() * 5);
      } 

      usedNumbers.push(number);
      tempArr.push(`${things[index]}/${things[index]}${number}.jpg`);
    }
    
    things.splice(index, 1);   

    for (let i = 0; i < 6; ++i) {
      let thingIndex = Math.floor(Math.random() * things.length);
      let fileNumber = Math.floor(1 + Math.random() * 5);
      let add = `${things[thingIndex]}/${things[thingIndex]}${fileNumber}.jpg`

      while (tempArr.find(elem => elem.includes(add))) {
        thingIndex = Math.floor(Math.random() * things.length);
        fileNumber = Math.floor(1 + Math.random() * 5);
        add = `${things[thingIndex]}/${things[thingIndex]}${fileNumber}.jpg`
      }
      
      tempArr.push(add);
    }

    // Fisher-Yates Shuffle
    // Reference: https://stackoverflow.com/questions/64925666/how-can-i-sort-an-array-randomly-in-javascript
    for (let i = tempArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const k = tempArr[i]
      tempArr[i] = tempArr[j]
      tempArr[j] = k
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

    switch (num) {
      case 0:
        setBorder0(!border0);
        break;
      case 1:
        setBorder1(!border1);
        break;
      case 2:
        setBorder2(!border2);
        break;
      case 3:
        setBorder3(!border3);
        break;
      case 4:
        setBorder4(!border4);
        break;
      case 5:
        setBorder5(!border5);
        break;
      case 6:
        setBorder6(!border6);
        break;
      case 7:
        setBorder7(!border7);
        break;
      case 8:
        setBorder8(!border8);
        break;
    }
  }

  const verify = async (e) => {
    e.stopPropagation();
    const foo = await fetch('http://localhost:8080/', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        thing: thing, 
        images: selected
      })
    });

    const result = await foo.json();
    setIsRobot(result.robot);
    setShow(true);
  }

  const handleClose = () => {
    setShow(false);
    setIsRobot(true);
    setSelected([]);
    setDisable(true);
    setBorder0(false);
    setBorder1(false);
    setBorder2(false);
    setBorder3(false);
    setBorder4(false);
    setBorder5(false);
    setBorder6(false);
    setBorder7(false);
    setBorder8(false);
    setRefresh(!refresh);
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Robot Checker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { isRobot ? "beep boop you're a robot" : "hello there fellow human" }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Card className={`${styles.centered} ${styles.card}`}>
        <Card.Header className='bg-primary text-white'>
          Select all squares with <br></br>
          <div className={styles.thing}>{thing}</div>
          Click verify once there are none left
        </Card.Header>
        <Card.Body> 
          <Stack direction='horizontal' gap={1}>
            <Image
              className={ border0 ? `img-thumbnail ${styles.border}` : "img-thumbnail" } 
              src={images[0]} 
              alt='Image 1' 
              onClick={(e) => click(e, images[0], 0)}/>
            <Image 
              className={ border1 ? `img-thumbnail ${styles.border}` : "img-thumbnail" } 
              src={images[1]} 
              alt='Image 2' 
              thumbnail 
              onClick={(e) => click(e, images[1], 1)}/>
            <Image 
              className={ border2 ? `img-thumbnail ${styles.border}` : "img-thumbnail" } 
              src={images[2]} 
              alt='Image 3' 
              thumbnail 
              onClick={(e) => click(e, images[2], 2)}/>
          </Stack>
          <Stack className={styles.stack} direction='horizontal' gap={1}>
            <Image 
              className={ border3 ? `img-thumbnail ${styles.border}` : "img-thumbnail" } 
              src={images[3]} 
              alt='Image 4' 
              thumbnail
              onClick={(e) => click(e, images[3], 3)}/>
            <Image 
              className={ border4 ? `img-thumbnail ${styles.border}` : "img-thumbnail" } 
              src={images[4]} 
              alt='Image 5' 
              thumbnail 
              onClick={(e) => click(e, images[4], 4)}/>
            <Image 
              className={ border5 ? `img-thumbnail ${styles.border}` : "img-thumbnail" } 
              src={images[5]} 
              alt='Image 6' 
              thumbnail 
              onClick={(e) => click(e, images[5], 5)}/>
          </Stack>
          <Stack className={styles.stack} direction='horizontal' gap={1}>
            <Image 
              className={ border6 ? `img-thumbnail ${styles.border}` : "img-thumbnail" } 
              src={images[6]} 
              alt='Image 6' 
              thumbnail 
              onClick={(e) => click(e, images[6], 6)}/>
            <Image 
              className={ border7 ? `img-thumbnail ${styles.border}` : "img-thumbnail" } 
              src={images[7]} 
              alt='Image 8' 
              thumbnail 
              onClick={(e) => click(e, images[7], 7)}/>
            <Image 
              className={ border8 ? `img-thumbnail ${styles.border}` : "img-thumbnail" } 
              src={images[8]} 
              alt='Image 9' 
              thumbnail 
              onClick={(e) => click(e, images[8], 8)}/>
          </Stack>
        </Card.Body>
        <Card.Footer>
          <Button className='float-end' disabled={disable} onClick={verify}>Verify</Button>
        </Card.Footer>
      </Card>
    </>
  )
}

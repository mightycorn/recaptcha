import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react';

import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'

export default function Home() {
  const [thing, setThing] = useState(null);
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [disable, setDisable] = useState(true);

  const [class1, setClass1] = useState(false);

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

    tempArr.sort(() => Math.random() - 0.5);
    setImages(tempArr);
  }, []);

  const click = (e, thing) => {
    e.stopPropagation();
  }

  return (
    <>
        <Card className={`${styles.centered} ${styles.card}`}>
          <Card.Header className='bg-primary text-white'>
            Select all squares with <br></br>
            <div className={styles.thing}>{thing}</div>
            Click <strong>verify</strong> once there are none left
          </Card.Header>
          <Card.Body> 
            <Stack direction='horizontal' gap={1}>
              <Image src={images[1]} alt='Image 1' thumbnail onClick={(e) => click(e, images[0])}/>
              <Image src={images[1]} alt='Image 2' thumbnail onClick={(e) => click(e, images[1])}/>
              <Image src={images[2]} alt='Image 3' thumbnail onClick={(e) => click(e, images[2])}/>
            </Stack>
            <Stack className={styles.stack} direction='horizontal' gap={1}>
              <Image src={images[3]} alt='Image 4' thumbnail onClick={(e) => click(e, images[3])}/>
              <Image src={images[4]} alt='Image 5' thumbnail onClick={(e) => click(e, images[4])}/>
              <Image src={images[5]} alt='Image 6' thumbnail onClick={(e) => click(e, images[5])}/>
            </Stack>
            <Stack className={styles.stack} direction='horizontal' gap={1}>
              <Image src={images[6]} alt='Image 6' thumbnail onClick={(e) => click(e, images[6])}/>
              <Image src={images[7]} alt='Image 8' thumbnail onClick={(e) => click(e, images[7])}/>
              <Image src={images[8]} alt='Image 9' thumbnail onClick={(e) => click(e, images[8])}/>
            </Stack>
          </Card.Body>
          <Card.Footer>
            <Button className='float-end' disabled={disable}>Verify</Button>
          </Card.Footer>
        </Card>
    </>
  )
}

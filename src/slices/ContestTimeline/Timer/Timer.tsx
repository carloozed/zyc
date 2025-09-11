'use client';

import React from 'react';

import { useTimer } from 'react-timer-hook';

import styles from './Timer.module.css';

interface TimerProps {
  startDate: string;
}

export default function Timer({ startDate }: TimerProps) {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: new Date(startDate),
  });

  return (
    <h3
      className={styles.timer}
      style={{
        fontSize: 'calc(0.6vw + 0.5rem)',
      }}
    >
      {days}:{hours < 10 ? `0${hours}` : hours}:
      {minutes < 10 ? `0${minutes}` : minutes}:
      {seconds < 10 ? `0${seconds}` : seconds}
    </h3>
  );
}

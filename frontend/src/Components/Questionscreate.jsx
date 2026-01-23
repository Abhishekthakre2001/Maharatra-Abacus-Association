import React from 'react';
import CsvQuestionManager from '../Features/CsvQuestionManager';
import AppBar from '../UI/AppBar';

export default function Questionscreate() {
  return (
    <>
      <AppBar
        title="Question Management"
        subtitle="Create, organize, and manage all questions"
      />


      <CsvQuestionManager />
    </>
  )
}

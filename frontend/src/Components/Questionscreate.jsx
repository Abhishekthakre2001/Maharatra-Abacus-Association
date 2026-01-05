import React from 'react';
import CsvQuestionManager from '../Features/CsvQuestionManager';
import AppBar from '../UI/AppBar';

export default function Questionscreate() {
  return (
    <>
      <AppBar
        title="Student Management"
        subtitle="Manage and view all students"
        
      />

      <CsvQuestionManager />
    </>
  )
}

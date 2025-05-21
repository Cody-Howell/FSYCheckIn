import React from 'react';

type CSVImportProps = {
  auth: Auth,
  role: number
}

export class CSVImport extends React.Component<CSVImportProps, {lorem: string}> {
  render() {
    return (
      <div>
        <h1>CSV Import</h1>
        <p>First, select the week you want to import these people to. </p>
      </div>
    );
  }
}

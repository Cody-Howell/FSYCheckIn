import React, { ChangeEvent } from 'react';
import { addAllPeople, getAllWeeks } from '../api';

//#region Types
type CSVImportProps = {
  auth: Auth,
  role: number
}

type CSVImportState = {
  currentWeeks: Array<FSYWeek>,
  selectedWeek: FSYWeek | undefined,
  csvValue: string,
  information: Array<number | undefined>,
  error: string
}
//#endregion

export class CSVImport extends React.Component<CSVImportProps, CSVImportState> {
  constructor(props: CSVImportProps) {
    super(props);
    this.state = {
      currentWeeks: [],
      selectedWeek: undefined,
      csvValue: "",
      information: [undefined, undefined, undefined, undefined, undefined],
      error: ""
    }
  }

  //#region Functions
  async componentDidMount(): Promise<void> {
    const weeks = await getAllWeeks(this.props.auth);
    this.setState({ currentWeeks: weeks });
  }

  updateWeekSelection = (e: ChangeEvent<HTMLSelectElement>): void => {
    const name = e.target.value;
    if (name === undefined) {
      this.setState({ selectedWeek: name });
    } else {
      this.setState({ selectedWeek: this.state.currentWeeks.find((value) => value.weekName === name) });
    }
  }

  updateFileSelection = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = e.target.files;
    if (files !== null) {
      this.setState({ csvValue: await files[0].text() })
    }
  }

  updateTextarea = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ csvValue: e.target.value });
  }

  updateInformation = (e: ChangeEvent<HTMLSelectElement>, index: number): void => {
    let val: number | undefined = Number(e.target.value);
    if (isNaN(val)) val = undefined;
    const currentState = this.state.information;
    currentState[index] = val;

    this.setState({ information: currentState });
  }

  uploadAttendees = async (): Promise<void> => {
    const people: Array<FSYAttendee> = [];
    const csvInfo: Array<string> = this.state.csvValue.split('\n');
    const weekId = this.state.selectedWeek?.id;
    const info = this.state.information;
    if (weekId === undefined ||
      info[0] === undefined ||
      info[1] === undefined ||
      info[2] === undefined ||
      info[3] === undefined ||
      info[4] === undefined) {
      this.setState({ error: "Make sure all columns are defined." });
      return;
    }

    for (let i = 1; i < csvInfo.length; i++) {
      const line = csvInfo[i].split(',');
      people.push({
        fsyWeek: weekId,
        givenNames: line[info[0]].trim(),
        surnames: line[info[1]].trim(),
        apartmentComplex: line[info[2]].trim(),
        apartmentKey: line[info[3]].trim(),
        fsySession: line[info[4]].trim(),
      })
    }

    await addAllPeople(people, this.props.auth);

    const a = document.createElement('a');
    a.href = "/";
    a.click();
  }
  //#endregion

  render() {
    const headers = this.state.csvValue.split('\n')[0].split(',');
    const sampleInfo: Array<string> = this.state.csvValue.split('\n').slice(1, 6);

    let uniqueApts: Array<string> = [];
    const aptIndex: number | undefined = this.state.information[2];
    if (aptIndex !== undefined) {
      uniqueApts = [...new Set(this.state.csvValue.split('\n').map((v) => v.split(',')[aptIndex]))];
      uniqueApts.shift();
    }

    return (
      <div>
        <h1>CSV Import</h1>
        <p>First, select the week you want to import these people to. Then, copy and paste (or upload) your CSV file
          and select the columns to apply to each of the fields. Then submit at the bottom to upload it to the database.</p>
        <select onChange={this.updateWeekSelection}>
          <option value={undefined}>_</option>
          {this.state.currentWeeks.map((value) => (
            <option value={value.weekName}>{value.weekName}</option>
          ))}
        </select>
        <hr />

        {this.state.selectedWeek !== undefined && (
          <>
            <p>Upload a file or paste in a CSV file here.</p>
            <input type='file' accept='.csv,.txt' onChange={this.updateFileSelection} /> <br /> <br />
            <textarea value={this.state.csvValue} onChange={this.updateTextarea} /> <br />

            <label htmlFor='givenNames'>Given Names: </label>
            <select name='givenNames' onChange={(e) => this.updateInformation(e, 0)}>
              <option value={undefined}>_</option>
              {headers.map((value, i) => <option value={i} key={"gN" + i}>{value}</option>)}
            </select> <br />
            <label htmlFor='surname'>Surname: </label>
            <select name='surname' onChange={(e) => this.updateInformation(e, 1)}>
              <option value={undefined}>_</option>
              {headers.map((value, i) => <option value={i} key={"su" + i}>{value}</option>)}
            </select> <br />
            <label htmlFor='apartment'>Apartment: </label>
            <select name='apartment' onChange={(e) => this.updateInformation(e, 2)}>
              <option value={undefined}>_</option>
              {headers.map((value, i) => <option value={i} key={"a" + i}>{value}</option>)}
            </select> <br />
            <label htmlFor='aptKey'>Key: </label>
            <select name='aptKey' onChange={(e) => this.updateInformation(e, 3)}>
              <option value={undefined}>_</option>
              {headers.map((value, i) => <option value={i} key={"aK" + i}>{value}</option>)}
            </select> <br />
            <label htmlFor='session'>Session: </label>
            <select name='session' onChange={(e) => this.updateInformation(e, 4)}>
              <option value={undefined}>_</option>
              {headers.map((value, i) => <option value={i} key={"se" + i}>{value}</option>)}
            </select>

            <hr />

            <h2>Sample Info</h2>
            <p>Given your results from above, check that it's going to upload properly here. This takes the first 5 rows 
              from your table and shows you what information I'm reading from them.  </p>
            {uniqueApts.length > 0 && (<p>Unique Apartments found: {uniqueApts.join(',')}</p>)}
            {sampleInfo.map((value) => {
              const line: Array<string> = value.split(',');
              return (
                <div className='infoDisplay'>
                  <p>Given Names: {this.state.information[0] !== undefined && line[this.state.information[0]]}</p>
                  <p>Surnames: {this.state.information[1] !== undefined && line[this.state.information[1]]}</p>
                  <p>Apartment: {this.state.information[2] !== undefined && line[this.state.information[2]]}</p>
                  <p>Key: {this.state.information[3] !== undefined && line[this.state.information[3]]}</p>
                  <p>Session: {this.state.information[4] !== undefined && line[this.state.information[4]]}</p>
                </div>
              )
            })}

            {this.state.error !== "" && (<p style={{ color: "red" }}>{this.state.error}</p>)}
            <button onDoubleClick={this.uploadAttendees}>Submit (double-click)</button>
          </>
        )}
      </div>
    );
  }
}

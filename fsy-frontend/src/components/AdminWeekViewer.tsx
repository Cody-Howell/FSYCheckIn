import React, { FormEvent } from 'react';
import { getAllWeeks, getReport, postNewWeek } from '../api';

type AdminWeekViewerProps = {
  auth: Auth,
  role: number
}

export class AdminWeekViewer extends React.Component<AdminWeekViewerProps, { currentWeeks: Array<FSYWeek> }> {
  constructor(props: AdminWeekViewerProps) {
    super(props);
    this.state = {
      currentWeeks: []
    }
  }

  async componentDidMount(): Promise<void> {
    await this.queryCurrentWeeks();
  }

  queryCurrentWeeks = async (): Promise<void> => {
    const weeks = await getAllWeeks(this.props.auth);
    this.setState({ currentWeeks: weeks });
  }

  createWeek = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const weekName = (document.getElementById('fsy-create-week') as HTMLInputElement).value;

    (document.getElementById('fsy-create-week') as HTMLInputElement).value = "";

    await postNewWeek(weekName, this.props.auth);
    await this.queryCurrentWeeks();
  }

  downloadReport = async (path: string, id: number): Promise<void> => {
    const report = await getReport(path, id, this.props.auth);

    let filename;
    if (path.split('/').length === 3) {
      filename = `fsy-report-${id}.csv`;
    } else {
      filename = `fsy-logs-${id}.csv`;
    }
    downloadCsv(report, filename);
  }

  render() {
    return (
      <div>
        <h1>Weeks</h1>
        <p>Here, you can generate new weeks and get reports for prior ones. </p>
        <hr />

        <h2>Current Weeks</h2>
        <form onSubmit={this.createWeek}>
          <input type='text' id='fsy-create-week' />
          <button type='submit'>Submit</button>
        </form>

        {this.state.currentWeeks.map((value, index) => (
          <div className='weekViewerDisplay' key={index}>
            <p>Name: {value.weekName}</p>
            <button onDoubleClick={() => this.downloadReport("/week/report", value.id)}>Download CSV (double-click)</button>
            <button onDoubleClick={() => this.downloadReport("/week/report/logs", value.id)}>Download Logs (double-click)</button>
          </div>
        ))}
      </div>
    );
  }
}

function downloadCsv(csvText: string, filename = 'report.csv') {
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

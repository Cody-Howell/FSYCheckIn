import React, { ChangeEvent } from 'react';
import { changePerson, getAllWeeks, getWeek } from '../api';

type HomeProps = {
  auth: Auth,
  role: number
}

type HomeState = {
  people: Array<FSYAttendee>,
  weeks: Array<FSYWeek>,
  selectedWeek: number | undefined,
  filterString: string,
  apartmentList: Array<string>,
  chosenApartment: string | undefined,
  searchAllPeople: boolean
}

export class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      people: [],
      weeks: [],
      selectedWeek: undefined,
      filterString: "",
      apartmentList: [],
      chosenApartment: undefined,
      searchAllPeople: false
    }
  }

  async componentDidMount(): Promise<void> {
    this.setState({ weeks: await getAllWeeks(this.props.auth) })
  }

  updateWeekSelector = (e: ChangeEvent<HTMLSelectElement>): void => {
    if (e.target.value === undefined) {
      this.setState({ selectedWeek: undefined, people: [] });
      return;
    }

    this.setState({ selectedWeek: Number(e.target.value) }, () => {
      this.queryPeople();
    });
  }

  updateAptSelection = (e: ChangeEvent<HTMLSelectElement>): void => {
    if (e.target.value === undefined) {
      this.setState({ chosenApartment: undefined });
      return;
    }

    this.setState({ chosenApartment: e.target.value });
  }

  queryPeople = async (): Promise<void> => {
    if (this.state.selectedWeek === undefined) return;

    const people = await getWeek(this.state.selectedWeek, this.props.auth);

    // Get unique apts
    const uniqueApts = [...new Set(people.map((v) => v.apartmentComplex))];

    this.setState({ people: people, apartmentList: uniqueApts });
  }

  updateCheckInStatus = async (id: number, to: boolean): Promise<void> => {
    await changePerson(id, to, this.props.auth);

    const people = this.state.people;
    const pIndex = people.findIndex((v) => v.id === id);

    if (pIndex === -1) throw new Error("Should never get here.");

    people[pIndex].checkedIn = to;
    this.setState({people: people});
  }

  toggleSearch = (): void => {
    this.setState({searchAllPeople: !this.state.searchAllPeople});
  }

  updateFilter = (e: string): void => {
    this.setState({filterString: e});
  }

  render() {
    let people = this.state.people;
  
    // Filter by apartment
    if (!this.state.searchAllPeople && this.state.chosenApartment !== undefined) {
      people = people.filter((v) => v.apartmentComplex === this.state.chosenApartment);
    }

    const count = people.filter((v) => v.checkedIn).length;
    const totalPercent = Math.round(count / people.length * 100);

    // Filter by string
    people = people.filter((v) => v.givenNames.toLowerCase().includes(this.state.filterString.toLowerCase()) || 
      v.surnames.toLowerCase().includes(this.state.filterString.toLowerCase()));

    
    return (
      <div>
        <h1>Home</h1>
        <label htmlFor='weekSelector'>Select Week</label>
        <select name='weekSelector' onChange={this.updateWeekSelector}>
          <option value={undefined}>_</option>
          {this.state.weeks.map((value) => (
            <option value={value.id}>{value.weekName}</option>
          ))}
        </select>
        <hr />

        <button onDoubleClick={this.queryPeople}>Refresh (double-click)</button> 
        <br/>
        <p>Total percent checked in: {totalPercent}%</p>
        <label htmlFor='searchFilter'>Search</label>
        <input type='text' name='searchFilter' onChange={(e) => this.updateFilter(e.target.value)} value={this.state.filterString}/>
        <button onClick={() => this.updateFilter("")}>Clear</button>
        <br/>
        <label htmlFor='aptSelection'>Apartment Selection: </label>
        <select name='aptSelection' onChange={this.updateAptSelection}>
          <option value={undefined}>_</option>
          {this.state.apartmentList.map((value) => (
            <option value={value}>{value}</option>
          ))}
        </select> 
        <br/>
        <label htmlFor='searchToggle'>Search all apartments: </label>
        <input type='checkbox' name='searchToggle' onChange={this.toggleSearch}/>
        <br />
        <br />

        <div id='allAttendees'>
          {people.map((value, index) => (
            <div className='attendeeDisplay' key={"aD" + index}>
              <p>{value.surnames}, {value.givenNames}</p>
              <p>{value.apartmentComplex} - {value.apartmentKey}</p>
              <p className='signinButton' onDoubleClick={() => this.updateCheckInStatus(Number(value.id), !value.checkedIn)}>{value.checkedIn ? "Check Out" : "Check In"}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

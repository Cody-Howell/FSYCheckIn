type Auth = {
  name: string, 
  key: string
}

type AccountType = {
  id: number,
  accountName: string, 
  email: string | null,
  displayName: string | null,
  role: number
};

type FSYWeek = {
  id: number,
  weekName: string
};

type FSYAttendee = {
  id?: number,
  fsyWeek: number,
  givenNames: string,
  surnames: string,
  apartmentComplex: string,
  apartmentKey: string,
  fsySession: string,
  checkedIn?: boolean
};
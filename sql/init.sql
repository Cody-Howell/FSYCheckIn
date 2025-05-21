CREATE TABLE "HowlDev.User" (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  accountName varchar(200) UNIQUE NOT NULL, 
  passHash varchar(200) NOT NULL, 
  email varchar(200) NULL, 
  displayName varchar(80) NULL,
  role int NOT NULL
);

CREATE TABLE "HowlDev.Key" (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  accountId varchar(200) references "HowlDev.User" (accountName) NOT NULL, 
  apiKey varchar(20) NOT NULL,
  validatedOn timestamp NOT NULL
);

CREATE TABLE fsy_week (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  weekName varchar(20) NOT NULL
);

CREATE TABLE fsy_attendee (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  fsyWeek int references fsy_week (id) NOT NULL,
  givenNames varchar(100) NOT NULL, 
  surnames varchar(100) NOT NULL, 
  apartmentComplex varchar(40) NOT NULL, 
  apartmentKey varchar(10) NOT NULL, 
  fsySession varchar(10) NULL, 
  checkedIn boolean NOT NULL
);

CREATE TABLE fsy_log (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  attendeeId int references fsy_attendee (id) NOT NULL,
  logDescription varchar(200) NOT NULL, 
  timeTaken timestamp NOT NULL
);

insert into "HowlDev.User" (accountName, passHash, displayName, role)
 values ('admin', 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=', 'admin', 1); -- Default "password" hash


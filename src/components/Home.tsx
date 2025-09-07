import React, { useEffect, useState } from 'react';
import { getBirthdays } from '../api/birthdayApi';

const Home: React.FC = () => {
  const [upcomingBirthday, setUpcomingBirthday] = useState<any>(null);

  useEffect(() => {
    const fetchUpcomingBirthday = async () => {
      const birthdays = await getBirthdays();
      const sorted = birthdays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setUpcomingBirthday(sorted[0]);
    };
    fetchUpcomingBirthday();
  }, []);

  return (
    <div>
      <h2>Upcoming Birthday</h2>
      {upcomingBirthday ? (
        <p>
          <strong>{upcomingBirthday.name}</strong> - {upcomingBirthday.date}
        </p>
      ) : (
        <p>No upcoming birthdays</p>
      )}
    </div>
  );
};

export default Home;
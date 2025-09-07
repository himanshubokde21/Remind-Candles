import React, { useEffect, useState } from 'react';
import { getBirthdays, updateBirthday, deleteBirthday } from '../api/birthdayApi';

interface Birthday {
  id: string;
  name: string;
  date: string;
}

const BirthdayList: React.FC = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const data = await getBirthdays();
        setBirthdays(data);
      } catch (error) {
        console.error('Error fetching birthdays:', error);
      }
    };
    fetchBirthdays();
  }, []);

  const handleUpdate = async (id: string, updatedData: Partial<Birthday>) => {
    try {
      await updateBirthday(id, updatedData);
      setBirthdays((prev) => prev.map((b) => (b.id === id ? { ...b, ...updatedData } : b)));
    } catch (error) {
      console.error('Error updating birthday:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBirthday(id);
      setBirthdays((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Error deleting birthday:', error);
    }
  };

  return (
    <div>
      <h2>All Birthdays</h2>
      <ul>
        {birthdays.map((birthday) => (
          <li key={birthday.id}>
            <p>
              <strong>{birthday.name}</strong> - {birthday.date}
            </p>
            <button onClick={() => handleUpdate(birthday.id, { name: 'Updated Name' })}>
              Update
            </button>
            <button onClick={() => handleDelete(birthday.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BirthdayList;
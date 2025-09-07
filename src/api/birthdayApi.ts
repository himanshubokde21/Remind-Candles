export interface Birthday {
  id: string;
  name: string;
  date: string;
}

const mockBirthdays: Birthday[] = [
  { id: '1', name: 'Alice', date: '2025-09-10' },
  { id: '2', name: 'Bob', date: '2025-09-15' },
  { id: '3', name: 'Charlie', date: '2025-09-20' },
];

// Fetch all birthdays
export const getBirthdays = async (): Promise<Birthday[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockBirthdays), 500); // Simulate API delay
  });
};

// Update a birthday
export const updateBirthday = async (id: string, updatedData: Partial<Birthday>): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockBirthdays.findIndex((b) => b.id === id);
      if (index !== -1) {
        mockBirthdays[index] = { ...mockBirthdays[index], ...updatedData };
      }
      resolve();
    }, 500);
  });
};

// Delete a birthday
export const deleteBirthday = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockBirthdays.findIndex((b) => b.id === id);
      if (index !== -1) {
        mockBirthdays.splice(index, 1);
      }
      resolve();
    }, 500);
  });
};
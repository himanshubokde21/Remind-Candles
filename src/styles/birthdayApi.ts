// birthdayApi.ts

export interface Birthday {
  name: string;
  date: string;
}

export async function getBirthdays(): Promise<Birthday[]> {
  // Example mock data; replace with actual API call if needed
  return [
    { name: 'Alice', date: '2024-07-01' },
    { name: 'Bob', date: '2024-08-15'} 
    ]
}
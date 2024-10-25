
export async function fetchData() {
    try {
      const data = await fetch('https://jsonplaceholder.typicode.com/posts');
      return data.json();
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetchdata.');
    }
  }
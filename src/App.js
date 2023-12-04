import './App.css';
import {useEffect, useState} from 'react';

const App = () => {
  
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Creates an IndexedDB called SampleDB with an object store 'SampleStore'
    const openDB = () => {
      return new Promise((resolve, reject) => {
        // Indexed DB open code
        const request = window.indexedDB.open('SampleDB', 1);
        request.onerror = (event) => {
          console.error('Error opening databse', event.target.error);
          reject(event.target.error);
        };
        request.onsuccess = (event) => {
          const db = event.target.result;
          resolve(db);
        };
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          const objectStore = db.createObjectStore('SampleStore', {
            keyPath: 'id',
            autoIncrement: true
          });
        };
      });
    };

    // Inserts dummy data ito SampleStore
    const insertData = async (db) => {
      console.log('DB from insert Data:', db);
      const transaction = db.transaction(['SampleStore'], 'readwrite');
      const store = transaction.objectStore('SampleStore');
      const data = [
        { name: 'Item 1', description: 'Description for Item 1'},
        { name: 'Item 2', description: 'Description for Item 2'}
      ];
      data.forEach((item) => store.add(item));
      fetchData(db); // Fetch data again after inserting
    };

    // Fetches all data from SampleStore and stores into state variable 'data'
    const fetchData = async (db) => {
      console.log('DB from fetch Data:', db);
      const transaction = db.transaction(['SampleStore'], 'readonly');
      const store = transaction.objectStore('SampleStore');
      const request = store.getAll();
      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result.length === 0) {
          insertData(db);
        } else {
          setData(result);
        }
      };
      request.onerror = (event) => {
        console.error('Error fetching data:', event.target.error);
      };
    };

    // Opens a DB, inserts data, fetches and stores them into 'data' 
    openDB()
      .then((db) => fetchData(db))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div className='container'>
      <h1>IndexedDB Example</h1>
      <div className='card-list'>
        {
          data.map((item) => { return (
            <div className='card' key={item.id}> 
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          )})
        }
      </div>
    </div>
  );

}

export default App;

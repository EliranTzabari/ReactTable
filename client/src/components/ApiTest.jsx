import React, {useState, useEffect} from 'react'
import axios from 'axios'


function ApiTest() {

    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api');
            setData(response.data);
          } catch (error) {
            console.log(error.message);
          } 
        };
        fetchData();
  }, []);
   const newData = JSON.stringify(data,null,2)

  return (
    <div>
      <pre>{newData}</pre>
    </div>
  )
}

export default ApiTest

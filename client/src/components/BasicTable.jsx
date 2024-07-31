import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';



const BasicTable = () => {

    const [data, setData] = useState('');

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

    //should be memoized or stable
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name', //access nested data with dot notation
                header: 'Name',
                size: 150,
            },
            {
                accessorKey: 'location',
                header: 'Location',
                size: 150,
            },
            {
                accessorKey: 'rack', //normal accessorKey
                header: 'Rack',
                size: 200,
            },
            {
                accessorKey: 'simul',
                header: 'Simul',
                size: 150,
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    });

    return <MaterialReactTable table={table} />;
};

export default BasicTable;

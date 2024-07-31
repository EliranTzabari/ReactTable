import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const racks = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3']


const Example = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getCats');
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableEditing: false,
        width: 100,
        Edit: () => null, //Exclud the id column from the edit an create windows
      },
      {
        accessorKey: 'name',
        header: 'Name',
        enableEditing: true,
        width: 200,
      },
      {
        accessorKey: 'location',
        header: 'Location',
        enableEditing: true,
        width: 100,
      },
      {
        accessorKey: 'rack',
        header: 'Rack',
        enableEditing: true,
        editSelectOptions: racks,
        muiEditTextFieldProps: {
          select: true,
        },
        width: 100,
      },
      {
        accessorKey: 'mark',
        header: 'Mark',
        enableEditing: true,
        width: 100,
      },
    ],
    [],
  );

  // CREATE action
  const handleCreateCat = async ({ values, table }) => {
    try {
      // Post values to server
      const response = await axios.post('http://localhost:3001/addCat', values);
      setData(response.data.rows);
      table.setCreatingRow(null); // Exit creating mode
    } catch (error) {
      console.error('Error creating Cat:', error);
    }
  };

  // UPDATE action
  const handleSaveCat = async ({ values, table }) => {
    const rowId = values.id;
    try {
      // Post values to server
      const response = await axios.put(`http://localhost:3001/updateCat/${rowId}`, values);
      setData(response.data.rows);
      table.setEditingRow(null); // Exit editing mode
    } catch (error) {
      console.error('Error updating cat:', error);
    }
  };

  // DELETE action
  const openDeleteConfirmModal = async (row) => {
    const rowId = row.original.id;
    if (window.confirm('Are you sure you want to delete this cat?')) {
      try {
        const response = await axios.delete(`http://localhost:3001/deleteCat/${rowId}`);
        setData(response.data.rows);
      } catch (error) {
        console.error('Error deleting cat:', error);
      }
    }
  };

  const table = useMaterialReactTable({
    columns,
    data,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    enableColumnDragging: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    muiTableHeadCellProps: {
      sx: {
        '& .Mui-TableHeadCell-Content': {
          justifyContent: 'center',
        },
      },
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Actions', //change header text
        size: 200, //make actions column wider
      },
    },
    positionActionsColumn: 'last',
    // enableRowSelection: true,
    getRowId: (row) => row.id,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowSave: handleCreateCat,
    onEditingRowSave: handleSaveCat,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h4">Create New Cat</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h4">Edit Cat</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Create New Cat
      </Button>
    ),
    muiTableBodyProps: {
      sx: {
        //stripe the rows, make odd rows a darker color
        '& tr:nth-of-type(odd) > td': {
          backgroundColor: '#E7E8D8',
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        borderRight: '2px solid #021526', //add a border between columns
      },
    },
    initialState: {
      columnVisibility: {
        id: false,
      },
      sorting: [
        {
          id: 'id',
          desc: false,
        },
      ],
    },

  });

  return <MaterialReactTable table={table} />;
};

export default Example;

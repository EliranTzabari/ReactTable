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

const Example = () => {
  const [data, setData] = useState([]);

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

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableEditing: false,
        width: 80,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        enableEditing: true,
        width: 80,
      },
      {
        accessorKey: 'location',
        header: 'Location',
        enableEditing: true,
        width: 80,
      },
      {
        accessorKey: 'rack',
        header: 'Rack',
        enableEditing: true,
        width: 80,
      },
      {
        accessorKey: 'mark',
        header: 'Mark',
        enableEditing: true,
        width: 80,
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
      console.error('Error creating user:', error);
    }
  };

  // UPDATE action
  const handleSaveUser = async ({ values, table }) => {
    const rowId = values.id;
    try {
      // Post values to server
      const response = await axios.put(`http://localhost:3001/updateCat/${rowId}`, values);
      setData(response.data.rows);
      table.setEditingRow(null); // Exit editing mode
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // DELETE action
  const openDeleteConfirmModal = async (row) => {
    const rowId = row.original.id;
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await axios.delete(`http://localhost:3001/deleteCat/${rowId}`);
        setData(response.data.rows);
      } catch (error) {
        console.error('Error deleting user:', error);
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

    // enableRowSelection: true,
    getRowId: (row) => row.id,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowSave: handleCreateCat,
    onEditingRowSave: handleSaveUser,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h4">Create New User</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {internalEditComponents.filter(component => component.key !== `mrt-row-create_id`)} {/* Exclude ID field */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h4">Edit User</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {internalEditComponents.filter(component => component.key !== `${row.id}_id`)} {/* Exclude ID field */}
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
        Create New User
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

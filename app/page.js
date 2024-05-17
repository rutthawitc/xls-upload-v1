'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

import MUIDataTable from 'mui-datatables';
import Link from 'next/link';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { createTheme, ThemeProvider } from '@mui/material';

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/paylist');
      setData(response.data);
    } catch (error) {
      setError(error.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const callFunction = fetchData();
    toast.promise(callFunction, {
      pending: 'Loading...',
      success: 'Get data successfully....',
      error: 'Error to get data',
    });
  }, []);

  //MUI DataTable

  const getMuiTheme = () =>
    createTheme({
      typography: {
        fontFamily: ['Athiti', 'sans-serif'].join(','),
      },
      components: {
        MuiTableCell: {
          styleOverrides: {
            head: {
              backgroundColor: '#f5f5f3',
              fontSize: '18px',
            },
            root: {
              fontSize: '16px',
              fontFamily: 'inherit',
              '&:nth-child(1)': {
                width: '12%',
                align: 'right',
                paddingLeft: '2rem',
              },
              '&:nth-child(2)': { width: '10%', align: 'center' },
              '&:nth-child(3)': {
                width: '15%',
                align: 'center',
                paddingLeft: '2rem',
              },
              '&:nth-child(4)': {
                width: '35%',
                align: 'center',
                paddingLeft: '2rem',
              },
              '&:nth-child(5)': {
                width: '15%',
                align: 'left',
                paddingRight: '3rem',
              },
            },
          },
        },
      },
    });

  const columns = [
    {
      name: 'doc_no',
      label: 'หมายเลข เอกสาร',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            // minWidth: '85px',
            // maxWidth: '85px',
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            textAlign: 'center',
          },
        }),
      },
    },
    {
      name: 'trans_type',
      label: 'ชนิดการโอน',
      options: {
        filter: true,
        sort: true,

        setCellProps: () => ({
          style: {
            // minWidth: '100px',
            // maxWidth: '100px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            // textAlign: 'left',
          },
        }),
      },
    },
    {
      name: 'due_date',
      label: 'วันที่กำหนดจ่าย',
      options: {
        filter: true,
        sort: true,
        sortDescFirst: false,
        setCellProps: () => ({
          style: {
            // minWidth: '90px',
            // maxWidth: '90px',
            textAlign: 'center',
          },
        }),
      },
    },
    {
      name: 'recipient',
      label: 'ผู้รับ',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            // minWidth: '250px',
            // maxWidth: '250px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            textAlign: 'left',
          },
        }),
      },
    },
    {
      name: 'amount',
      label: 'จํานวนเงิน (บาท)',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({
          style: {
            // minWidth: '150px',
            // maxWidth: '150px',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            // textAlign: 'center',
          },
        }),
        setCellHeaderProps: () => ({
          style: {
            textAlign: 'center',
          },
        }),
      },
    },
  ];
  const options = {
    selectableRows: 'none',
    searchAlwaysOpen: true,
    rowsPerPage: 25,
    rowsPerPageOptions: [25, 50, 100, 150, 200],
    filter: true,
    filterType: 'dropdown',
    responsive: 'standard',
    searchPlaceholder: 'ป้อนคำเพื่อค้นหา...',
    print: true,
    fixedHeader: true,
    tableBodyHeight: 'auto',
    resizeableColumns: true,
    customSearch: (searchQuery, currentRow, columns) => {
      let isFound = false;
      currentRow.forEach((col) => {
        if (col.toString().indexOf(searchQuery) >= 0) {
          isFound = true;
        }
      });
      return isFound;
    },
    customSort: (data, colIndex, order, meta) => {
      return data.sort((a, b) => {
        return (
          (a.data[colIndex].length < b.data[colIndex].length ? -1 : 1) *
          (order === 'desc' ? 1 : -1)
        );
      });
    },

    //Download option
    downloadOptions: {
      filename: 'รายการจ่ายเงิน.csv',
      separator: ',',
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true,
      },
      textLabels: {
        body: {
          noMatch: 'ไม่พบข้อมูล',
          toolTip: 'Sort',
          columnHeaderTooltip: (column) => `Sort for ${column.label}`,
        },
      },
    },

    onDownload: (buildHead, buildBody, columns, rows) => {
      return '\uFEFF' + buildHead(columns) + buildBody(rows);
    },
  };

  const rowsData = data.map((row) => [
    row.doc_no,
    row.trans_type,
    row.due_date,
    row.recipient,
    row.amount,
  ]);

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <div className='flex flex-col'>
        <div className='flex flex-1 items-baseline justify-between bg-slate-400 rounded-md mt-4 ml-3 mr-3'>
          <h1 className='text-xl font-bold ml-3 text-grey-800'>
            รายการจ่ายเงิน
          </h1>
          <Link href={'/login'}>
            {' '}
            <button className='m-3 p-3 bg-slate-800 rounded-md text-indigo-50 font-semibold items-end hover:bg-slate-600'>
              {' '}
              Login for Upload
            </button>
          </Link>
        </div>

        <div className='m-3'>
          <div className='bg-rose-400 p-3 mt-3 w-full rounded-md align-baseline text-left'>
            <span className='text-xl font-bold text-slate-800'>
              ใช้ปุ่มแว่นขยายเพื่อค้นหาข้อมูล
            </span>
          </div>

          {rowsData.length > 0 && (
            <MUIDataTable
              title={'ตารางการจ่ายเงิน'}
              data={rowsData}
              columns={columns}
              options={options}
              className='mt-3'
            />
          )}
          {rowsData.length == 0 && (
            <div className='flex flex-col'>
              <div className='bg-slate-400 p-3 mt-3 w-full rounded-md align-baseline justify-center'>
                <span className='text-xl font-bold text-slate-800'>
                  ไม่พบข้อมูล
                </span>
              </div>
            </div>
          )}
        </div>
        <ToastContainer
          position='top-right'
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='colored'
        />
      </div>
    </ThemeProvider>
  );
};

export default Page;

'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

import MUIDataTable from 'mui-datatables';
import Link from 'next/link';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const columns = [
    {
      name: 'doc_no',
      label: 'หมายเลข เอกสาร',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'trans_type',
      label: 'ชนิดการโอน',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'due_date',
      label: 'วันที่กำหนดจ่าย',
      options: {
        filter: true,
        sort: true,
        sortDescFirst: false,
      },
    },
    {
      name: 'recipient',
      label: 'ผู้รับ',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'amount',
      label: 'จํานวนเงิน (บาท)',
      options: {
        filter: true,
        sort: true,
      },
    },
  ];
  const options = {
    selectableRows: 'none',
    rowsPerPage: 25,
    rowsPerPageOptions: [25, 50, 100, 150, 200],
    filter: true,
    filterType: 'dropdown',
    responsive: 'vertical',
    searchPlaceholder: 'ป้อนคำเพื่อค้นหา...',
    print: false,
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
  };

  const rowsData = data.map((row) => [
    row.doc_no,
    row.trans_type,
    row.due_date,
    row.recipient,
    row.amount,
  ]);

  return (
    <div className='flex flex-col'>
      <div className='flex flex-1 items-baseline justify-between bg-slate-400 rounded-md mt-4 ml-3 mr-3'>
        <h1 className='text-xl font-bold ml-3 text-grey-800'>รายการจ่ายเงิน</h1>
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
  );
};

export default Page;

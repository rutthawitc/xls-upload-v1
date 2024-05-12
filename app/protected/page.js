'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import MUIDataTable from 'mui-datatables';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [xceldata, setXcelData] = useState([]);
  const [error, setError] = useState(null);

  //Session Check
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  //Disable Send Line Button
  const [isButtonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleFileChange = (e) => {
    // console.log('file is:', e.target.files[0]);
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      console.log('no file selected');
    }
  };

  //Line Notify
  const notifyHandler = async () => {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear() + 543;
    let currentDate = `${day}/${month}/${year}`;

    const message =
      'แจ้งเตือนการจ่ายเงิน กปภ.ข.๖ ประจำวันที่ ' +
      currentDate +
      ' มีจำนวน ' +
      rowsJsonData.length +
      ' รายการ \n' +
      stringData +
      '\n กรุณาตรวจสอบในระบบ http://110.76.155.100:10002/';

    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) {
      throw new Error('Failed to send notify');
    } else {
      toast.success('แจ้งเตือนทาง LINE สำเร็จ!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return res.json();
    }
  };

  function excelSerialNumberToDate(serialNumber) {
    // Convert the serial number to milliseconds since January 1, 1970
    const milliseconds = (serialNumber - 25569) * 86400 * 1000;
    // Create a new Date object
    const date = new Date(milliseconds);
    // Get day, month, and year
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543;
    // Return the date in Thai date format (DD/MM/YYYY)
    return `${day}/${month}/${year}`;
  }

  function convertToThaiBaht(number) {
    // Convert number to string and split into integer and decimal parts
    const [integerPart, decimalPart] = number.toFixed(2).toString().split('.');
    // Add commas for thousands separators
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ','
    );
    // Return formatted string with Thai Baht symbol
    return `${formattedIntegerPart}.${decimalPart}`;
  }

  const handleFileUpload = () => {
    if (!file) {
      toast.warn('โปรดเลือกไฟล์เพื่อตรวจสอบข้อมูล', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      //console.log(jsonData);
      setXcelData(jsonData);
    };
    reader.readAsArrayBuffer(file);
    toast.info('โปรดตรวจสอบข้อมุล!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  //MUI DataTable
  const columns = [
    'หมายเลข เอกสาร',
    'ชนิดการโอน',
    'วันที่กำหนดจ่าย',
    'ผู้รับ',
    'จํานวนเงิน (บาท)',
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
  };

  const rowsData = xceldata.map((row) => [
    row[0],
    row[2],
    excelSerialNumberToDate(row[3]),
    row[5],
    convertToThaiBaht(row[6]),
  ]);

  // console.log(rowsData);

  // Convert array to JSON format
  const rowsJsonData = rowsData.map((data) => {
    return {
      doc_no: data[0]?.toString(), // convert to string if it's a number
      trans_type: data[1],
      due_date: data[2],
      recipient: data[3],
      amount: data[4]?.toString(),
    };
  });

  //console.log(rowsJsonData);

  // Prepare rows data for Line Notify
  const dataForLine = rowsData.map((data) => {
    return {
      //doc_no: data[0]?.toString(), // convert to string if it's a number
      //trans_type: data[1],
      due_date: data[2],
      recipient: data[3],
      amount: data[4]?.toString(),
    };
  });

  //console.log(dataForLine);

  // Sort JSON data by recipient, due date, and amount
  dataForLine.sort((a, b) => {
    if (a.recipient !== b.recipient) {
      return a.recipient.localeCompare(b.recipient);
    }
    if (a.due_date !== b.due_date) {
      return new Date(a.due_date) - new Date(b.due_date);
    }
    return (
      parseFloat(a.amount.replace(/,/g, '')) -
      parseFloat(b.amount.replace(/,/g, ''))
    );
  });

  // Convert sorted JSON data to a string with new lines
  const stringData = dataForLine
    .map((item) => {
      return `ผู้รับ: ${item.recipient}, วันที่: ${item.due_date}, จํานวน: ${item.amount}`;
    })
    .join('\n');

  console.log(stringData);
  //console.log(rowsJsonData.length);

  // Convert array of objects to JSON string
  //const jsonString = JSON.stringify(rowsJsonData, null, 2); // Use null and 2 for pretty printing

  //Insert Rows Data to SQLite.
  const handleSubmit = async () => {
    if (rowsJsonData.length == 0) {
      toast.warn('ไม่พบข้อมูล', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }
    try {
      await axios.post('/api/paylist/', rowsJsonData);
      toast.warn('กำลังอัพโหลดข้อมูล!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      setButtonDisabled(false);
    } catch (error) {
      console.log(error);
      toast.error(error, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  return (
    status == 'authenticated' &&
    session.user && (
      <div className='mb-10 p-3 mt-5 '>
        <label
          className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          htmlFor='file_input'>
          Upload file
        </label>
        <input
          id='file_input'
          type='file'
          accept='.xlsx, .xls'
          required
          onChange={handleFileChange}
          className='block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
        />
        <p className='mt-1 mb-3 text-sm text-slate-900' id='file_input_help'>
          <span className='font-medium'>เฉพาะไฟล์ .xlsx และ .xls เท่านั้น</span>
        </p>
        <div className='flex flex-row items-center gap-x-32'>
          <button
            onClick={handleFileUpload}
            className='flex-none bg-red-700 text-white p-4 rounded-md focus:shadow-outline hover:bg-red-600'>
            <span>ตรวจสอบข้อมูล</span>
          </button>
          <button
            onClick={handleSubmit}
            className='flex-none bg-blue-400 text-white p-4 rounded-md focus:shadow-outline hover:bg-blue-600'>
            <span>บันทึกข้อมูล</span>
          </button>

          <button
            disabled={isButtonDisabled}
            onClick={notifyHandler}
            className='sendline-btn'>
            <span>ส่งแจ้งเตือนทาง Line</span>
          </button>

          {/* <button
            // onClick={importFromSAP}
            className='flex-none bg-cyan-500 text-white p-4 rounded-md focus:shadow-outline hover:bg-cyan-700'>
            <span>นำเข้าจาก SAP</span>
          </button> */}

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className='flex-none bg-rose-400 text-white p-4 rounded-md focus:shadow-outline hover:bg-rose-500'>
            <span>ออกจากระบบ</span>
          </button>

          <ToastContainer />
        </div>

        {error && (
          <div className='text-red-500 w-10/12 h-10 bg-rose-200 font-normal rounded-sm text-center p-4 m-2'>
            {error}
          </div>
        )}

        {rowsData.length > 0 && (
          <MUIDataTable
            title={'โปรดตรวจสอบข้อมุล'}
            data={rowsData}
            columns={columns}
            options={options}
            className='mt-3'
          />
        )}
      </div>
    )
  );
};

export default UploadPage;

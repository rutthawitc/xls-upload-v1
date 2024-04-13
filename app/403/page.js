export default function ForbiddenPage() {
  return (
    <div className='flex flex-col items-center mt-10 w-full'>
      <div className='bg-slate-500 p-5 rounded-md items-center'>
        <h1 className='text-2xl text-rose-700'>403 Forbidden</h1>
      </div>
      <div className='bg-slate-500 p-5 rounded-md items-center mt-5'>
        <p>
          You are not authorized to access this page. ไม่มีสิทธิ์ในการเข้าถึง
        </p>
      </div>
    </div>
  );
}

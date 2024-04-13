import axios from 'axios';
export async function POST(request, response) {
  const body = await request.json();
  const url = 'https://notify-api.line.me/api/notify';
  const token = process.env.LINE_NOTIFY_TOKEN;
  const message = body.message;

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
  };
  const data = `message=${message}`;

  try {
    const response = await axios.post(url, data, config);
    return Response.json({ message: 'Send Line successfully' });
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}

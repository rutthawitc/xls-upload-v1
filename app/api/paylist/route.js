import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  return Response.json(await prisma.payList.findMany());
}

export async function POST(request) {
  try {
    const body = await request.json();
    //console.log('body data :', body);
    const newData = await prisma.payList.createMany({
      data: body,
    });
    return Response.json({ message: 'Data inserted successfully' });
  } catch (error) {
    return Response.json(error);
  } finally {
    await prisma.$disconnect();
  }
}

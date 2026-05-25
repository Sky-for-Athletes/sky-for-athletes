export async function handler(event: any) {
  console.log("Lambda triggered at", new Date().toISOString());
  console.log("Event:", JSON.stringify(event, null, 2));
  return { statusCode: 200, body: JSON.stringify({ message: "OK" }) };
}

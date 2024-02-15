import { NextRequest, NextResponse } from "next/server";
// import { useRouter } from "next/navigation";

//localhost:3000/api/weather
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const latitude = searchParams.get("lat");
  const longitude = searchParams.get("lon");
  let url = "";
  if (address) {
    url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      address +
      "&appid=" +
      "a20ffba384c46fea418b6393badbc7fa";
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=a20ffba384c46fea418b6393badbc7fa`;
  }
  //console.log(url);
  const res = await fetch(url);

  const data = await res.json();
  console.log(data);
  return NextResponse.json({ data });
}

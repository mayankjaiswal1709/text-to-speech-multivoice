import fs from "fs";
import path from "path";


export async function POST(request) {
  const { message, voice } = await request.json();

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: "POST",
        headers: {
          accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: message,
          voice_settings: {
            stability: 0,
            similarity_boost: 0,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const file = Math.random().toString(36).substring(7);

    fs.writeFile(path.join("public", "audio", `${file}.mp3`), buffer, () => {
      console.log("audio File written successfully");
    });

    return new Response(JSON.stringify({ file: `${file}.mp3` }));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }));
  }
}
// ------------------------------------------------------

// export async function post(request) {

//   const { image, voice } = await request.json();
//   try {
//     const requestData = {
//       source_url: "https://myhost.com/image.jpg",
//       script: {
//         type: "audio",
//         audio_url: `${response}`,
//       },
//     };

//     const vResponse = await fetch(
//       "https://api.d-id.com/talks",
//       {
//         method: "POST",
//         headers: {
//           accept: "video/mpeg",
//           "Content-Type": "application/json",
//           "xi-api-key": process.env.DID_API_KEY,
//         },
//         body: JSON.stringify(requestData),
//       }
//     );

//     if (!vResponse.ok) {
//       throw new Error("Something went wrong");
//     }
//     const arrayBuffer = await vResponse.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const vfile = Math.random().toString(36).substring(7);

//     fs.writeFile(path.join("public", "video", `${vfile}.mp4`), buffer, () => {
//       console.log("video File written successfully");
//     });

//     return new Response(JSON.stringify({ file: `${vfile}.mp4` }));
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: `An error occurred: ${error.message}`,
//     });
//   }
// }

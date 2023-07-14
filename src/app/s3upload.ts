export default async function AddImageToS3(
  file: Blob | File,
  title: string,
  type: string
) {
  const getPreSignedResponse = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/s3/getPreSignedURL`,
    {
      method: "POST",
      body: JSON.stringify({
        type: type,
        title: title,
        filename: file.name,
      }),
    }
  );

  const { uploadURL, key } =
    (await getPreSignedResponse.json()) as getPreSignedResponseData;

  // Update server with image URL
  await fetch(uploadURL, {
    method: "PUT",
    body: file as File,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    })
    .catch((err) => {
      console.log(err);
    });

  return key;
}

interface getPreSignedResponseData {
  uploadURL: string;
  key: string;
}

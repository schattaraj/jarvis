export default async function handler(req, res) {
    const { file } = req.query;
    if (!file) {
      return res.status(400).json({ error: "Missing file parameter" });
    }
  
    // Construct the backend file URL
    const backendUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${file}`; // Adjust as needed
  
    try {
      const response = await fetch(backendUrl);
      if (!response.ok) {
        return res.status(response.status).json({ error: "File not found" });
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
  
      // Set headers for download
      res.setHeader("Content-Disposition", `attachment; filename="${file.split('/').pop()}"`);
      res.setHeader("Content-Type", response.headers.get("content-type") || "application/octet-stream");
  
      // Send the file
      res.status(200).send(buffer);
    } catch (error) {
      res.status(500).json({ error: "Failed to download file" });
      console.log("Error",error)
    }
  }
export default async function handler(req, res) {

    const reqBody = req?.body;
    const query = req?.query
    const headers = req?.headers

    try {
         // Validate the base URL
         const baseUrlString = `${process.env.NEXT_PUBLIC_BASE_URL}${query.api}`;
        
         if (!query.api) {
             return res.status(400).json({ message: "Missing 'api' parameter in query." });
         }
        const baseUrl = new URL(baseUrlString);
        // Append query parameters to the URL
        Object.keys(query).forEach(key => {
            if (key !== 'api') { // Exclude the 'api' key from being added to the query
                baseUrl.searchParams.append(key, query[key]);
            }
        });
        const fetchOptions = {
            method: req.method,
            headers: headers,
        };

        // Include the body only for POST requests
        if (req.method === 'POST') {
            fetchOptions.body = JSON.stringify(reqBody);
        }

        const response = await fetch(baseUrl.toString(),fetchOptions);
        if (response.status === 403) {
            return res.status(403).json({ message: "403 Forbidden" });
        }
        // Check if the response is OK
        if (!response.ok) {
            const errorText = await response.text(); // Get error response as text
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }
         // Check if the response is empty
         if (response.status === 204) {
            return res.status(204).json({ message: 'No content' });
        }
        // Attempt to parse JSON if the response is not empty
        const contentType = response.headers.get("content-type");
        let data;

        if (contentType && contentType.includes("application/json")) {
            data = await response.json(); // Parse as JSON
        } else {
            const text = await response.text(); // Fallback to text
            data = { message: text }; // Wrap in a JSON object
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

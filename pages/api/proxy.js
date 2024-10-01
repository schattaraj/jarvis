export default async function handler(req, res) {

    const loginDetails = req?.body;
    const query = req?.query
    const headers = req?.headers

    try {
        const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL+query?.api}`;
        const response = await fetch(baseUrl, {
            method: 'GET',
            headers: headers,
        });

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

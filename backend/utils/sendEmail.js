const sendEmail = async (options) => {
	try {
		const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();
		const SENDER_EMAIL = process.env.SENDER_EMAIL?.trim();
		if (!BREVO_API_KEY) {
			console.error("❌ BREVO_API_KEY is missing from your .env file!");
			throw new Error("Missing Email API key");
		}

		if (!SENDER_EMAIL) {
            console.error("❌ SENDER_EMAIL is missing from environment variables!");
            throw new Error("Missing Sender Email address");
        }

        if (!options.email) {
            throw new Error("Recipient email (options.email) is required");
        }

		const data = {
			sender: {
				name: "Real Estate Platform",
				email: SENDER_EMAIL,
			},
			to: [{ email: options.email.trim() }],
			subject: options.subject,
			htmlContent: options.message,
		};

		const response = await fetch("https://api.brevo.com/v3/smtp/email", {
			method: "POST",
			headers: {
				"api-key": BREVO_API_KEY,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();

		if (!response.ok) {
            console.error("❌ Brevo API Response Error:", result);
            const errorMessage = result.message || result.code || "Failed to send email via Brevo";
            throw new Error(errorMessage);
        }

        console.log("✅ Email sent successfully via Brevo. MessageId:", result.messageId);
        return result;

	} catch (error) {
		console.error("Brevo Email error: ", error.message);
		throw new Error(error.message || "Could not send email via BREVO");
	}
};

export default sendEmail
const sendEmail = async (options) => {
	try {
		const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();
		if (!BREVO_API_KEY) {
			console.error("❌ BREVO_API_KEY is missing from your .env file!");
			throw new Error("Missing Email API key");
		}

		const data = {
			sender: {
				name: "Real Estate Platform",
				email: "process.env.SENDER_EMAIL",
			},
			to: [{ email: options.email }],
			subject: options.subject,
			htmlContent: options.message,
		};

		const response = await fetch("https://api.brevo.com/v3/smtp/email", {
			method: "POST",
			headers: {
				"api-key": process.env.BREVO_API_KEY,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();

		if (response.ok) {
			console.log("Email sent successfully via Brevo: ", result);
		} else {
			console.error("Brevo API key error: ", result);
			throw new Error(result.message || "Could not send email via BREVO");
		}
	} catch (error) {
		console.error("Brevo Email error: ", error.message);
		throw new Error(result.message || "Could not send email via BREVO");
	}
};

export default sendEmail
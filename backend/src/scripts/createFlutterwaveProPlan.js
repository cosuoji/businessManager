import dotenv from "dotenv";

dotenv.config();

const createFlutterwaveProPlan =
    async () => {
        try {
            const response =
                await fetch(
                    "https://api.flutterwave.com/v3/payment-plans",
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,

                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            amount: 7000,

                            name:
                                "BizFlow Pro",

                            interval:
                                "monthly",
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                console.error(
                    "Flutterwave error:",
                    data
                );

                process.exit(1);
            }

            console.log(
                "Flutterwave Pro plan created:"
            );

            console.log(
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );
        } catch (error) {
            console.error(
                "Failed to create Flutterwave plan:",
                error
            );

            process.exit(1);
        }
    };

createFlutterwaveProPlan();

(function () {

    const SUPABASE_URL =
        "https://zpwmwaanlqrjpaynkpbn.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_waqQ29I8lrQsCczVPuKfdg_rqZY0igd";

    const ACCESS_KEY = "deeptech_thesis_access_v1";
    const VISITOR_ID_KEY = "deeptech_thesis_visitor_id_v1";


    /*
     * We deliberately do not store the email itself
     * inside localStorage.
     *
     * Instead we create a stable SHA-256 identifier.
     */
    async function createVisitorId(email) {

        const normalizedEmail =
            email.trim().toLowerCase();

        const encoded =
            new TextEncoder().encode(normalizedEmail);

        const hashBuffer =
            await crypto.subtle.digest(
                "SHA-256",
                encoded
            );

        const hashArray =
            Array.from(
                new Uint8Array(hashBuffer)
            );

        return hashArray
            .map(
                byte =>
                    byte
                        .toString(16)
                        .padStart(2, "0")
            )
            .join("");
    }


    /*
     * If the visitor has already entered their email
     * on this device, do not show the gate again.
     *
     * Re-identify them to PostHog using the stable
     * hashed ID.
     */
    function restoreExistingVisitor() {

        const accessGranted =
            localStorage.getItem(ACCESS_KEY);

        const visitorId =
            localStorage.getItem(VISITOR_ID_KEY);

        if (
            accessGranted === "true" &&
            visitorId
        ) {

            if (window.posthog) {

                posthog.identify(visitorId);

            }

            return true;
        }

        return false;
    }


    function injectStyles() {

        const style =
            document.createElement("style");

        style.textContent = `

            #thesis-email-gate {
                position: fixed;
                inset: 0;
                z-index: 999999;
                background:
                    radial-gradient(
                        circle at 85% 15%,
                        rgba(100, 75, 255, 0.18),
                        transparent 34%
                    ),
                    #07070a;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;
            }

            .thesis-gate-card {
                width: 100%;
                max-width: 520px;
                background: #111116;
                border: 1px solid #292933;
                border-radius: 14px;
                padding: 38px;
                box-shadow:
                    0 30px 90px
                    rgba(0,0,0,0.55);
                color: #ffffff;
            }

            .thesis-gate-brand {
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 0.02em;
                margin-bottom: 34px;
            }

            .thesis-gate-brand span {
                color: #8a78ff;
                margin: 0 7px;
            }

            .thesis-gate-eyebrow {
                color: #8a78ff;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.16em;
                text-transform: uppercase;
                margin-bottom: 13px;
            }

            .thesis-gate-card h1 {
                margin: 0 0 14px;
                font-size: 34px;
                line-height: 1.12;
                letter-spacing: -0.03em;
            }

            .thesis-gate-description {
                margin: 0 0 28px;
                color: #b9b9c3;
                line-height: 1.6;
                font-size: 15px;
            }

            .thesis-gate-card input {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid #393943;
                background: #09090c;
                color: white;
                border-radius: 8px;
                padding: 15px 16px;
                font-size: 15px;
                outline: none;
                margin-bottom: 12px;
            }

            .thesis-gate-card input:focus {
                border-color: #7d6cff;
            }

            .thesis-gate-card button {
                width: 100%;
                border: 0;
                border-radius: 8px;
                padding: 15px 18px;
                background: #ffffff;
                color: #08080b;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
            }

            .thesis-gate-card button:hover {
                opacity: 0.9;
            }

            .thesis-gate-card button:disabled {
                cursor: wait;
                opacity: 0.65;
            }

            .thesis-gate-privacy {
                margin: 16px 0 0;
                color: #777782;
                line-height: 1.5;
                font-size: 11px;
            }

            .thesis-gate-error {
                min-height: 18px;
                margin-top: 10px;
                color: #ff8787;
                font-size: 12px;
            }

            @media (max-width: 600px) {

                .thesis-gate-card {
                    padding: 28px 22px;
                }

                .thesis-gate-card h1 {
                    font-size: 28px;
                }

            }

        `;

        document.head.appendChild(style);
    }


    function createGate() {

        injectStyles();

        const gate =
            document.createElement("div");

        gate.id = "thesis-email-gate";

        gate.innerHTML = `

            <div class="thesis-gate-card">

                <div class="thesis-gate-brand">
                    Varun Nankani
                    <span>|</span>
                    DeepTech Thesis
                </div>

                <div class="thesis-gate-eyebrow">
                    Investment Thesis
                </div>

                <h1>
                    Physical systems.
                    Recurring intelligence.
                </h1>

                <p class="thesis-gate-description">
                    Enter your email to view the
                    DeepTech investment thesis on
                    physical intelligence, Octobotics
                    and PierSight.
                </p>

                <form id="thesis-email-form">

                    <input
                        id="thesis-email-input"
                        type="email"
                        placeholder="Email address"
                        autocomplete="email"
                        required
                    >

                    <button
                        id="thesis-email-button"
                        type="submit"
                    >
                        View thesis
                    </button>

                    <div
                        id="thesis-email-error"
                        class="thesis-gate-error"
                    ></div>

                </form>

                <p class="thesis-gate-privacy">
                    Your email and site interactions
                    are used only to understand
                    readership of this thesis.
                </p>

            </div>

        `;

        document.body.appendChild(gate);

        document.body.style.overflow =
            "hidden";


        if (window.posthog) {

            posthog.capture(
                "thesis_email_gate_viewed",
                {
                    page:
                        window.location.pathname
                }
            );

        }


        const form =
            document.getElementById(
                "thesis-email-form"
            );

        const input =
            document.getElementById(
                "thesis-email-input"
            );

        const button =
            document.getElementById(
                "thesis-email-button"
            );

        const errorBox =
            document.getElementById(
                "thesis-email-error"
            );


        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                errorBox.textContent = "";

                if (!input.checkValidity()) {

                    input.reportValidity();

                    return;
                }


                const email =
                    input.value
                        .trim()
                        .toLowerCase();


                button.disabled = true;

                button.textContent =
                    "Opening thesis...";


                try {

                    /*
                     * Store email in Supabase
                     */
                    const response =
                        await fetch(
                            SUPABASE_URL +
                            "/rest/v1/thesis_visitors",
                            {
                                method: "POST",

                                headers: {

                                    "apikey":
                                        SUPABASE_PUBLISHABLE_KEY,

                                    "Content-Type":
                                        "application/json",

                                    "Prefer":
                                        "return=minimal"
                                },

                                body:
                                    JSON.stringify({
                                        email: email,

                                        source_page:
                                            window
                                                .location
                                                .pathname,

                                        referrer:
                                            document
                                                .referrer ||
                                            null
                                    })
                            }
                        );


                    if (!response.ok) {

                        const message =
                            await response.text();

                        throw new Error(message);

                    }


                    /*
                     * Create stable pseudonymous
                     * identifier for PostHog.
                     */
                    const visitorId =
                        await createVisitorId(
                            email
                        );


                    /*
                     * Identify the anonymous visitor.
                     * PostHog associates prior
                     * anonymous events with this
                     * identified profile.
                     */
                    if (window.posthog) {

                        posthog.identify(
                            visitorId,
                            {
                                email: email
                            }
                        );

                        posthog.capture(
                            "thesis_email_submitted",
                            {
                                page:
                                    window
                                        .location
                                        .pathname
                            }
                        );

                    }


                    /*
                     * Remember access without storing
                     * the raw email in localStorage.
                     */
                    localStorage.setItem(
                        ACCESS_KEY,
                        "true"
                    );

                    localStorage.setItem(
                        VISITOR_ID_KEY,
                        visitorId
                    );


                    document.body.style.overflow =
                        "";

                    gate.remove();


                } catch (error) {

                    console.error(
                        "Email submission failed:",
                        error
                    );

                    errorBox.textContent =
                        "Unable to continue. Please try again.";

                    button.disabled = false;

                    button.textContent =
                        "View thesis";

                }

            }
        );
    }


    function initialize() {

        /*
         * Existing visitor.
         */
        if (restoreExistingVisitor()) {
            return;
        }

        /*
         * New visitor.
         */
        createGate();
    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }

})();

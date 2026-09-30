/* =========================================================
   CTC CALCULATOR
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =================================================
           STATE
        ================================================= */

        let period = "yearly";

        let reportGenerated = false;

        let latestCalculation = null;



        /* =================================================
           ELEMENTS
        ================================================= */

        const ctcInput =
            document.getElementById("ctc");

        const ctcLabel =
            document.getElementById("ctcLabel");

        const monthlyBtn =
            document.getElementById("monthlyBtn");

        const yearlyBtn =
            document.getElementById("yearlyBtn");

        const generateBtn =
            document.getElementById("generateBtn");

        const resetBtn =
            document.getElementById("resetBtn");

        const pfMode =
            document.getElementById("pfMode");

        const customPFField =
            document.getElementById("customPFField");

        const taxRegime =
            document.getElementById("taxRegime");

        const resultPlaceholder =
            document.getElementById("resultPlaceholder");

        const results =
            document.getElementById("results");

        const pdfBtn =
            document.getElementById("pdfBtn");

        const excelBtn =
            document.getElementById("excelBtn");

        const shareBtn =
            document.getElementById("shareBtn");



        /* =================================================
           HELPER
        ================================================= */

        function number(id) {

            const element =
                document.getElementById(id);

            if (!element) {
                return 0;
            }

            const value =
                parseFloat(element.value);

            return Number.isFinite(value)
                ? value
                : 0;

        }


        function formatIndianNumber(value) {
            if (value === null || value === undefined || isNaN(value)) {
                return "0";
            }
            const rounded = Math.round(Number(value));
            const isNegative = rounded < 0;
            const absStr = Math.abs(rounded).toString();

            if (absStr.length <= 3) {
                return (isNegative ? "-" : "") + absStr;
            }

            const lastThree = absStr.substring(absStr.length - 3);
            const otherNumbers = absStr.substring(0, absStr.length - 3);
            const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
            return (isNegative ? "-" : "") + formattedOther + "," + lastThree;
        }

        function money(value) {
            return "₹" + formatIndianNumber(value);
        }

        function pdfMoney(value) {
            return "Rs " + formatIndianNumber(value);
        }


        function setText(
            id,
            value
        ) {

            const element =
                document.getElementById(id);

            if (element) {

                element.textContent =
                    value;

            }

        }



        /* =================================================
           PERIOD UI
        ================================================= */

        function updatePeriodUI() {

            if (
                period === "monthly"
            ) {

                ctcLabel.textContent =
                    "Monthly CTC";

                monthlyBtn.classList.add(
                    "active"
                );

                yearlyBtn.classList.remove(
                    "active"
                );

            }

            else {

                ctcLabel.textContent =
                    "Annual CTC";

                yearlyBtn.classList.add(
                    "active"
                );

                monthlyBtn.classList.remove(
                    "active"
                );

            }

        }



        /* =================================================
           MONTHLY BUTTON
        ================================================= */

        monthlyBtn.addEventListener(
            "click",
            function () {

                if (
                    period === "monthly"
                ) {

                    return;

                }


                const annual =
                    parseFloat(
                        ctcInput.value
                    ) || 0;


                if (annual > 0) {

                    ctcInput.value =
                        (annual / 12)
                            .toFixed(2);

                }


                period = "monthly";


                updatePeriodUI();


                if (reportGenerated) {

                    calculate();

                }

            }
        );



        /* =================================================
           YEARLY BUTTON
        ================================================= */

        yearlyBtn.addEventListener(
            "click",
            function () {

                if (
                    period === "yearly"
                ) {

                    return;

                }


                const monthly =
                    parseFloat(
                        ctcInput.value
                    ) || 0;


                if (monthly > 0) {

                    ctcInput.value =
                        Math.round(
                            monthly * 12
                        );

                }


                period = "yearly";


                updatePeriodUI();


                if (reportGenerated) {

                    calculate();

                }

            }
        );



        /* =================================================
           CUSTOM PF
        ================================================= */

        function updateCustomPF() {

            if (
                pfMode.value ===
                "custom"
            ) {

                customPFField.classList.add(
                    "show"
                );

            }

            else {

                customPFField.classList.remove(
                    "show"
                );

            }

        }


        pfMode.addEventListener(
            "change",
            function () {

                updateCustomPF();


                if (reportGenerated) {

                    calculate();

                }

            }
        );



        /* =================================================
           NEW TAX REGIME
           FY 2026-27
        ================================================= */

        function newRegimeTax(
            taxableIncome
        ) {

            taxableIncome =
                Math.max(
                    0,
                    taxableIncome
                );


            if (
                taxableIncome <=
                1200000
            ) {

                return 0;

            }


            let tax = 0;


            if (
                taxableIncome > 400000
            ) {

                tax +=
                    Math.min(
                        taxableIncome -
                        400000,

                        400000

                    ) * 0.05;

            }


            if (
                taxableIncome > 800000
            ) {

                tax +=
                    Math.min(
                        taxableIncome -
                        800000,

                        400000

                    ) * 0.10;

            }


            if (
                taxableIncome > 1200000
            ) {

                tax +=
                    Math.min(
                        taxableIncome -
                        1200000,

                        400000

                    ) * 0.15;

            }


            if (
                taxableIncome > 1600000
            ) {

                tax +=
                    Math.min(
                        taxableIncome -
                        1600000,

                        400000

                    ) * 0.20;

            }


            if (
                taxableIncome > 2000000
            ) {

                tax +=
                    Math.min(
                        taxableIncome -
                        2000000,

                        400000

                    ) * 0.25;

            }


            if (
                taxableIncome > 2400000
            ) {

                tax +=
                    (
                        taxableIncome -
                        2400000
                    ) * 0.30;

            }


            /*
               Marginal relief around
               the ₹12 lakh threshold.
            */

            const excess =
                taxableIncome -
                1200000;


            if (
                tax > excess
            ) {

                tax = excess;

            }


            return Math.max(
                0,
                tax
            );

        }



        /* =================================================
           OLD TAX REGIME
           FY 2026-27
        ================================================= */

        function oldRegimeTax(
            taxableIncome
        ) {

            taxableIncome =
                Math.max(
                    0,
                    taxableIncome
                );


            let tax = 0;


            if (
                taxableIncome <=
                250000
            ) {

                tax = 0;

            }

            else if (
                taxableIncome <=
                500000
            ) {

                tax =
                    (
                        taxableIncome -
                        250000
                    ) * 0.05;

            }

            else if (
                taxableIncome <=
                1000000
            ) {

                tax =
                    12500 +
                    (
                        taxableIncome -
                        500000
                    ) * 0.20;

            }

            else {

                tax =
                    112500 +
                    (
                        taxableIncome -
                        1000000
                    ) * 0.30;

            }


            /*
               87A rebate.
            */

            if (
                taxableIncome <=
                500000
            ) {

                tax = 0;

            }


            return Math.max(
                0,
                tax
            );

        }



        /* =================================================
           TAX CALCULATION
        ================================================= */

        function calculateIncomeTax(
            grossSalary
        ) {

            const regime =
                taxRegime.value;


            const standardDeduction =
                regime === "new"
                    ? 75000
                    : 50000;


            const taxableIncome =
                Math.max(
                    0,

                    grossSalary -
                    standardDeduction
                );


            let tax;


            if (
                regime === "new"
            ) {

                tax =
                    newRegimeTax(
                        taxableIncome
                    );

            }

            else {

                tax =
                    oldRegimeTax(
                        taxableIncome
                    );

            }


            /*
               4% cess.
            */

            tax *= 1.04;


            return tax;

        }



        /* =================================================
           MAIN CALCULATION
        ================================================= */

        function calculate() {


            let enteredCTC =
                parseFloat(
                    ctcInput.value
                ) || 0;


            enteredCTC =
                Math.max(
                    0,
                    enteredCTC
                );


            let annualCTC;


            if (
                period === "monthly"
            ) {

                annualCTC =
                    enteredCTC * 12;

            }

            else {

                annualCTC =
                    enteredCTC;

            }



            /* ---------------------------------------------
               SETTINGS
            --------------------------------------------- */

            const basicPercent =
                number(
                    "basicPercent"
                );

            const hraPercent =
                number(
                    "hraPercent"
                );

            const bonus =
                number(
                    "bonus"
                );

            const employerPFRate =
                number(
                    "employerPF"
                );

            const employeePFRate =
                number(
                    "employeePF"
                );

            const gratuityRate =
                number(
                    "gratuity"
                );

            const professionalTax =
                number(
                    "professionalTax"
                );



            /* ---------------------------------------------
               BASIC
            --------------------------------------------- */

            const basic =
                annualCTC *
                basicPercent /
                100;



            /* ---------------------------------------------
               HRA
            --------------------------------------------- */

            const hra =
                basic *
                hraPercent /
                100;



            /* ---------------------------------------------
               PF WAGE
            --------------------------------------------- */

            let pfMonthlyWage = 0;


            if (
                pfMode.value ===
                "actual"
            ) {

                pfMonthlyWage =
                    basic / 12;

            }

            else if (
                pfMode.value ===
                "ceiling"
            ) {

                pfMonthlyWage =
                    Math.min(
                        basic / 12,
                        15000
                    );

            }

            else if (
                pfMode.value ===
                "custom"
            ) {

                const customPF =
                    number(
                        "customPF"
                    );


                pfMonthlyWage =
                    Math.min(
                        Math.max(
                            0,
                            customPF
                        ),
                        basic / 12
                    );

            }



            /* ---------------------------------------------
               EMPLOYER PF
            --------------------------------------------- */

            const employerPF =
                pfMonthlyWage *
                employerPFRate /
                100 *
                12;



            /* ---------------------------------------------
               EMPLOYEE PF
            --------------------------------------------- */

            const employeePF =
                pfMonthlyWage *
                employeePFRate /
                100 *
                12;



            /* ---------------------------------------------
               GRATUITY
            --------------------------------------------- */

            const gratuity =
                basic *
                gratuityRate /
                100;



            /* ---------------------------------------------
               GROSS
            --------------------------------------------- */

            const grossSalary =
                Math.max(
                    0,

                    annualCTC -
                    employerPF -
                    gratuity
                );



            /* ---------------------------------------------
               FIXED GROSS
            --------------------------------------------- */

            const fixedGross =
                Math.max(
                    0,

                    grossSalary -
                    bonus
                );



            /* ---------------------------------------------
               SPECIAL ALLOWANCE
            --------------------------------------------- */

            const specialAllowance =
                Math.max(
                    0,

                    fixedGross -
                    basic -
                    hra
                );



            /* ---------------------------------------------
               TAX
            --------------------------------------------- */

            const incomeTax =
                calculateIncomeTax(
                    grossSalary
                );



            /* ---------------------------------------------
               ANNUAL TAKE HOME
            --------------------------------------------- */

            const annualTakeHome =
                Math.max(
                    0,

                    grossSalary -
                    employeePF -
                    professionalTax -
                    incomeTax
                );



            /* ---------------------------------------------
               MONTHLY
            --------------------------------------------- */

            const monthlyGross =
                grossSalary / 12;

            const monthlyEmployeePF =
                employeePF / 12;

            const monthlyPT =
                professionalTax / 12;

            const monthlyTax =
                incomeTax / 12;

            const monthlyInHand =
                annualTakeHome / 12;



            /* ---------------------------------------------
               SAVE DATA
            --------------------------------------------- */

            latestCalculation = {

                annualCTC,

                fixedGross,

                basic,

                hra,

                specialAllowance,

                bonus,

                employerPF,

                gratuity,

                grossSalary,

                employeePF,

                professionalTax,

                incomeTax,

                annualTakeHome,

                monthlyGross,

                monthlyEmployeePF,

                monthlyPT,

                monthlyTax,

                monthlyInHand,

                taxRegime:
                    taxRegime.value

            };



            /* ---------------------------------------------
               UPDATE UI
            --------------------------------------------- */

            setText(
                "monthlyInHand",
                money(monthlyInHand)
            );

            setText(
                "monthlyInHand2",
                money(monthlyInHand)
            );

            setText(
                "annualTakeHome",
                "Annual take-home: " +
                money(annualTakeHome)
            );

            setText(
                "annualCTC",
                money(annualCTC)
            );

            setText(
                "fixedGross",
                money(fixedGross)
            );

            setText(
                "basic",
                money(basic)
            );

            setText(
                "hra",
                money(hra)
            );

            setText(
                "specialAllowance",
                money(specialAllowance)
            );

            setText(
                "variablePay",
                money(bonus)
            );

            setText(
                "employerPFValue",
                money(employerPF)
            );

            setText(
                "gratuityValue",
                money(gratuity)
            );

            setText(
                "grossSalary",
                money(grossSalary)
            );

            setText(
                "employeePFValue",
                money(employeePF)
            );

            setText(
                "professionalTaxValue",
                money(professionalTax)
            );

            setText(
                "incomeTax",
                money(incomeTax)
            );

            setText(
                "monthlyGross",
                money(monthlyGross)
            );

            setText(
                "monthlyEmployeePF",
                money(monthlyEmployeePF)
            );

            setText(
                "monthlyPT",
                money(monthlyPT)
            );

            setText(
                "monthlyTax",
                money(monthlyTax)
            );

        }



        /* =================================================
           GENERATE REPORT
        ================================================= */

        generateBtn.addEventListener(
            "click",
            function () {


                const value =
                    parseFloat(
                        ctcInput.value
                    ) || 0;


                if (
                    value <= 0
                ) {

                    alert(
                        "Please enter your CTC first."
                    );

                    ctcInput.focus();

                    return;

                }


                calculate();


                reportGenerated = true;


                resultPlaceholder.style.display =
                    "none";


                results.classList.add(
                    "show"
                );


                pdfBtn.disabled = false;

                excelBtn.disabled = false;

                shareBtn.disabled = false;


                if (
                    window.innerWidth <=
                    800
                ) {

                    results.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );



        /* =================================================
           LIVE UPDATE
        ================================================= */

        const liveFields = [

            "ctc",

            "basicPercent",

            "hraPercent",

            "bonus",

            "customPF",

            "employerPF",

            "employeePF",

            "gratuity",

            "professionalTax",

            "taxRegime"

        ];


        liveFields.forEach(
            function (id) {


                const element =
                    document.getElementById(
                        id
                    );


                if (!element) {
                    return;
                }


                element.addEventListener(
                    "input",
                    function () {

                        if (
                            reportGenerated
                        ) {

                            calculate();

                        }

                    }
                );


                element.addEventListener(
                    "change",
                    function () {

                        if (
                            reportGenerated
                        ) {

                            calculate();

                        }

                    }
                );

            }
        );



        /* =================================================
           RESET
        ================================================= */

        resetBtn.addEventListener(
            "click",
            function () {


                ctcInput.value = "";


                document.getElementById(
                    "basicPercent"
                ).value = 40;


                document.getElementById(
                    "hraPercent"
                ).value = 40;


                document.getElementById(
                    "bonus"
                ).value = 0;


                pfMode.value =
                    "actual";


                document.getElementById(
                    "customPF"
                ).value = 15000;


                document.getElementById(
                    "employerPF"
                ).value = "0";


                document.getElementById(
                    "employeePF"
                ).value = "12";


                document.getElementById(
                    "gratuity"
                ).value = "4.81";


                document.getElementById(
                    "professionalTax"
                ).value = 0;


                taxRegime.value =
                    "new";


                period =
                    "yearly";


                reportGenerated =
                    false;


                latestCalculation =
                    null;


                updatePeriodUI();

                updateCustomPF();


                resultPlaceholder.style.display =
                    "flex";


                results.classList.remove(
                    "show"
                );


                pdfBtn.disabled =
                    true;


                excelBtn.disabled =
                    true;


                shareBtn.disabled =
                    true;

            }
        );



        /* =================================================
           DIRECT PDF EXECUTION FROM PRESERVED DATA
        ================================================= */

        function generatePdfFromData(d) {

            if (!d) {
                d = latestCalculation;
            }

            if (!d) {
                alert("Please generate the report first.");
                return;
            }

            if (typeof window.jspdf === "undefined") {
                alert("PDF generator could not be loaded. Please refresh the page and try again.");
                return;
            }

            const { jsPDF } = window.jspdf;

            const doc = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            const MARGIN_LEFT = 20;
            const MARGIN_RIGHT = 190;
            const CONTENT_WIDTH = MARGIN_RIGHT - MARGIN_LEFT;

            /* =========================================================
               1. WATERMARK
            ========================================================= */

            doc.saveGraphicsState();

            if (typeof doc.GState === "function") {
                try {
                    doc.setGState(new doc.GState({ opacity: 0.12 }));
                    doc.setTextColor(170, 182, 202);
                } catch (e) {
                    doc.setTextColor(240, 242, 246);
                }
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(42);
            doc.text(
                "CTC CALCULATOR",
                pageWidth / 2,
                pageHeight / 2,
                {
                    align: "center",
                    angle: 40
                }
            );

            doc.restoreGraphicsState();

            /* =========================================================
               2. HEADER
            ========================================================= */

            doc.setTextColor(15, 23, 42);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.text("CTC Salary Report", MARGIN_LEFT, 23);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(100, 116, 139);

            const regimeText =
                d.taxRegime === "new"
                    ? "New Tax Regime"
                    : "Old Tax Regime";

            doc.text(
                "FY 2026-27  |  India  |  " + regimeText,
                MARGIN_LEFT,
                29.5
            );

            // Header blue divider rule
            doc.setDrawColor(37, 99, 235);
            doc.setLineWidth(0.65);
            doc.line(MARGIN_LEFT, 34, MARGIN_RIGHT, 34);

            /* =========================================================
               3. SUMMARY CARD (In-Hand & Annual Take-Home)
            ========================================================= */

            const cardY = 40;
            const cardHeight = 28;

            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.35);
            doc.roundedRect(
                MARGIN_LEFT,
                cardY,
                CONTENT_WIDTH,
                cardHeight,
                3,
                3,
                "FD"
            );

            // Left Side: Monthly In-Hand
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text("ESTIMATED MONTHLY IN-HAND", MARGIN_LEFT + 6, cardY + 9);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(19);
            doc.setTextColor(37, 99, 235);
            doc.text(pdfMoney(d.monthlyInHand), MARGIN_LEFT + 6, cardY + 20);

            // Subtle vertical separator
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.3);
            doc.line(MARGIN_LEFT + 95, cardY + 5, MARGIN_LEFT + 95, cardY + 23);

            // Right Side: Annual Take-Home
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text("ANNUAL TAKE-HOME", MARGIN_RIGHT - 6, cardY + 9, { align: "right" });

            doc.setFont("helvetica", "bold");
            doc.setFontSize(15);
            doc.setTextColor(15, 23, 42);
            doc.text(pdfMoney(d.annualTakeHome), MARGIN_RIGHT - 6, cardY + 20, { align: "right" });

            /* =========================================================
               4. STRUCTURED BREAKUP TABLES
            ========================================================= */

            let y = 76;

            function sectionTitle(title) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10.5);
                doc.setTextColor(15, 23, 42);
                doc.text(title, MARGIN_LEFT, y);

                doc.setDrawColor(203, 213, 225);
                doc.setLineWidth(0.35);
                doc.line(MARGIN_LEFT, y + 2.2, MARGIN_RIGHT, y + 2.2);

                y += 7.2;
            }

            function row(label, value, isTotal = false) {
                if (isTotal) {
                    doc.setFillColor(248, 250, 252);
                    doc.rect(MARGIN_LEFT, y - 4.4, CONTENT_WIDTH, 6.4, "F");

                    doc.setDrawColor(203, 213, 225);
                    doc.setLineWidth(0.3);
                    doc.line(MARGIN_LEFT, y - 4.4, MARGIN_RIGHT, y - 4.4);
                    doc.line(MARGIN_LEFT, y + 2, MARGIN_RIGHT, y + 2);

                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(8.8);
                    doc.setTextColor(15, 23, 42);
                    doc.text(label, MARGIN_LEFT + 2, y);
                    doc.text(value, MARGIN_RIGHT - 2, y, { align: "right" });
                } else {
                    doc.setDrawColor(241, 245, 249);
                    doc.setLineWidth(0.2);
                    doc.line(MARGIN_LEFT, y + 2, MARGIN_RIGHT, y + 2);

                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8.6);
                    doc.setTextColor(71, 85, 105);
                    doc.text(label, MARGIN_LEFT + 2, y);

                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(15, 23, 42);
                    doc.text(value, MARGIN_RIGHT - 2, y, { align: "right" });
                }

                y += 6.5;
            }

            /* Section 1: Annual Salary Breakup */
            sectionTitle("Annual Salary Breakup");

            row("Annual CTC", pdfMoney(d.annualCTC), true);
            row("Fixed Gross Salary", pdfMoney(d.fixedGross));
            row("Basic Salary", pdfMoney(d.basic));
            row("House Rent Allowance (HRA)", pdfMoney(d.hra));
            row("Special Allowance", pdfMoney(d.specialAllowance));
            row("Variable Pay / Bonus", pdfMoney(d.bonus));
            row("Employer PF Contribution", pdfMoney(d.employerPF));
            row("Gratuity Provision", pdfMoney(d.gratuity));
            row("Gross Salary (Annual)", pdfMoney(d.grossSalary), true);

            /* Section 2: Annual Deductions */
            y += 3.5;
            sectionTitle("Annual Deductions");

            row("Employee PF (EPF)", pdfMoney(d.employeePF));
            row("Professional Tax", pdfMoney(d.professionalTax));
            row("Income Tax / TDS", pdfMoney(d.incomeTax));
            row("Annual Take-Home", pdfMoney(d.annualTakeHome), true);

            /* Section 3: Monthly Salary Estimate */
            y += 3.5;
            sectionTitle("Monthly Salary Estimate");

            row("Monthly Gross Salary", pdfMoney(d.monthlyGross));
            row("Monthly Employee PF", pdfMoney(d.monthlyEmployeePF));
            row("Monthly Professional Tax", pdfMoney(d.monthlyPT));
            row("Monthly Income Tax (TDS)", pdfMoney(d.monthlyTax));
            row("Estimated Monthly In-Hand", pdfMoney(d.monthlyInHand), true);

            /* =========================================================
               5. FOOTER
            ========================================================= */

            const footerY = pageHeight - 16;

            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.3);
            doc.line(MARGIN_LEFT, footerY - 5, MARGIN_RIGHT, footerY - 5);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(37, 99, 235);
            doc.text("CTC Calculator", MARGIN_LEFT, footerY);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(
                "CTC Salary Calculator · FY 2026-27",
                MARGIN_RIGHT,
                footerY,
                { align: "right" }
            );

            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184);
            doc.text(
                "Estimated calculation. Actual salary, tax deductions, and provident fund may vary based on employer policies.",
                MARGIN_LEFT,
                footerY + 5.5
            );

            /* Direct download */
            doc.save("ctc-salary-report.pdf");
        }



        function generateExcelFromData(d) {

            if (!d) {
                d = latestCalculation;
            }

            if (!d) {
                alert("Please generate the report first.");
                return;
            }

            const rows = [
                [ "CTC Salary Report", "" ],
                [ "Financial Year", "FY 2026-27" ],
                [ "Tax Regime", d.taxRegime === "new" ? "New Regime" : "Old Regime" ],
                [ "Annual CTC", pdfMoney(d.annualCTC) ],
                [ "Fixed Gross Salary", pdfMoney(d.fixedGross) ],
                [ "Basic Salary", pdfMoney(d.basic) ],
                [ "HRA", pdfMoney(d.hra) ],
                [ "Special Allowance", pdfMoney(d.specialAllowance) ],
                [ "Variable Pay / Bonus", pdfMoney(d.bonus) ],
                [ "Employer PF", pdfMoney(d.employerPF) ],
                [ "Gratuity", pdfMoney(d.gratuity) ],
                [ "Gross Salary", pdfMoney(d.grossSalary) ],
                [ "Employee PF", pdfMoney(d.employeePF) ],
                [ "Professional Tax", pdfMoney(d.professionalTax) ],
                [ "Income Tax / TDS", pdfMoney(d.incomeTax) ],
                [ "Annual Take-Home", pdfMoney(d.annualTakeHome) ],
                [ "Monthly Gross", pdfMoney(d.monthlyGross) ],
                [ "Monthly Employee PF", pdfMoney(d.monthlyEmployeePF) ],
                [ "Monthly Professional Tax", pdfMoney(d.monthlyPT) ],
                [ "Monthly Income Tax", pdfMoney(d.monthlyTax) ],
                [ "Monthly In-Hand", pdfMoney(d.monthlyInHand) ]
            ];

            const csv = rows
                .map(function (row) {
                    return row
                        .map(function (value) {
                            return '"' + String(value).replace(/"/g, '""') + '"';
                        })
                        .join(",");
                })
                .join("\r\n");

            const blob = new Blob(
                [ "\uFEFF", csv ],
                { type: "text/csv;charset=utf-8;" }
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "ctc-salary-report.csv";
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(function () {
                URL.revokeObjectURL(url);
            }, 1000);
        }



        /* =================================================
           DOWNLOAD BUTTON COUNTDOWN WITH PRESERVED DATA
        ================================================= */

        let pdfCountdownTimer = null;
        let excelCountdownTimer = null;
        let preservedPdfData = null;
        let preservedExcelData = null;

        const originalPdfHtml = pdfBtn.innerHTML;
        const originalExcelHtml = excelBtn.innerHTML;

        function clearPdfCountdown() {
            if (pdfCountdownTimer) {
                clearInterval(pdfCountdownTimer);
                pdfCountdownTimer = null;
            }
            pdfBtn.disabled = false;
            pdfBtn.innerHTML = originalPdfHtml;
            preservedPdfData = null;
        }

        function clearExcelCountdown() {
            if (excelCountdownTimer) {
                clearInterval(excelCountdownTimer);
                excelCountdownTimer = null;
            }
            excelBtn.disabled = false;
            excelBtn.innerHTML = originalExcelHtml;
            preservedExcelData = null;
        }

        function renderPdfCountdown(text) {
            pdfBtn.innerHTML =
                '<svg viewBox="0 0 24 24" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" fill="none" stroke-dasharray="14 38"></circle></svg> ' +
                text;
        }

        function renderExcelCountdown(text) {
            excelBtn.innerHTML =
                '<svg viewBox="0 0 24 24" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" fill="none" stroke-dasharray="14 38"></circle></svg> ' +
                text;
        }

        /* PDF Click Event with 15s Countdown & Preserved Snapshot */
        pdfBtn.addEventListener(
            "click",
            function () {
                if (!reportGenerated || !latestCalculation) {
                    alert("Please generate the report first.");
                    return;
                }

                if (pdfCountdownTimer) {
                    return;
                }

                /* 1. Preserve snapshot of current report data */
                preservedPdfData = JSON.parse(JSON.stringify(latestCalculation));

                /* 2. Disable button & start 15s countdown */
                let secondsLeft = 15;
                pdfBtn.disabled = true;
                renderPdfCountdown("Downloading in " + secondsLeft + "s");

                /* 3. Dynamic countdown every second */
                pdfCountdownTimer = setInterval(function () {
                    secondsLeft--;
                    if (secondsLeft > 0) {
                        renderPdfCountdown("Downloading in " + secondsLeft + "s");
                    } else if (secondsLeft === 0) {
                        renderPdfCountdown("Preparing Download...");
                    } else {
                        clearInterval(pdfCountdownTimer);
                        pdfCountdownTimer = null;

                        /* 4. After 15 seconds, generate PDF from PRESERVED data & download */
                        setTimeout(function () {
                            try {
                                generatePdfFromData(preservedPdfData);
                            } catch (err) {
                                console.error("PDF generation failed:", err);
                            } finally {
                                clearPdfCountdown();
                            }
                        }, 300);
                    }
                }, 1000);
            }
        );

        /* Excel Click Event with 15s Countdown & Preserved Snapshot */
        excelBtn.addEventListener(
            "click",
            function () {
                if (!reportGenerated || !latestCalculation) {
                    alert("Please generate the report first.");
                    return;
                }

                if (excelCountdownTimer) {
                    return;
                }

                /* 1. Preserve snapshot of current report data */
                preservedExcelData = JSON.parse(JSON.stringify(latestCalculation));

                /* 2. Disable button & start 15s countdown */
                let secondsLeft = 15;
                excelBtn.disabled = true;
                renderExcelCountdown("Downloading in " + secondsLeft + "s");

                /* 3. Dynamic countdown every second */
                excelCountdownTimer = setInterval(function () {
                    secondsLeft--;
                    if (secondsLeft > 0) {
                        renderExcelCountdown("Downloading in " + secondsLeft + "s");
                    } else if (secondsLeft === 0) {
                        renderExcelCountdown("Preparing Download...");
                    } else {
                        clearInterval(excelCountdownTimer);
                        excelCountdownTimer = null;

                        /* 4. After 15 seconds, generate CSV/Excel from PRESERVED data & download */
                        setTimeout(function () {
                            try {
                                generateExcelFromData(preservedExcelData);
                            } catch (err) {
                                console.error("Excel generation failed:", err);
                            } finally {
                                clearExcelCountdown();
                            }
                        }, 300);
                    }
                }, 1000);
            }
        );



        shareBtn.addEventListener(
            "click",
            async function () {


                if (
                    !latestCalculation
                ) {

                    alert(
                        "Please generate the report first."
                    );

                    return;

                }


                const params =
                    new URLSearchParams();


                params.set(
                    "ctc",
                    ctcInput.value
                );


                params.set(
                    "period",
                    period
                );


                params.set(
                    "basic",
                    document.getElementById(
                        "basicPercent"
                    ).value
                );


                params.set(
                    "hra",
                    document.getElementById(
                        "hraPercent"
                    ).value
                );


                params.set(
                    "bonus",
                    document.getElementById(
                        "bonus"
                    ).value
                );


                params.set(
                    "pf",
                    pfMode.value
                );


                params.set(
                    "custompf",
                    document.getElementById(
                        "customPF"
                    ).value
                );


                params.set(
                    "employerpf",
                    document.getElementById(
                        "employerPF"
                    ).value
                );


                params.set(
                    "employeepf",
                    document.getElementById(
                        "employeePF"
                    ).value
                );


                params.set(
                    "gratuity",
                    document.getElementById(
                        "gratuity"
                    ).value
                );


                params.set(
                    "pt",
                    document.getElementById(
                        "professionalTax"
                    ).value
                );


                params.set(
                    "regime",
                    taxRegime.value
                );


                const shareURL =
                    window.location.origin +
                    window.location.pathname +
                    "?" +
                    params.toString();


                const shareData = {

                    title:
                        "CTC Calculator",

                    text:
                        "Check this CTC salary calculation.",

                    url:
                        shareURL

                };


                /* Native share */

                if (
                    navigator.share
                ) {

                    try {

                        await navigator.share(
                            shareData
                        );

                        return;

                    }

                    catch (error) {

                        if (
                            error.name ===
                            "AbortError"
                        ) {

                            return;

                        }

                    }

                }


                /* Clipboard */

                try {

                    await navigator.clipboard.writeText(
                        shareURL
                    );


                    alert(
                        "Share link copied to clipboard."
                    );


                    return;

                }

                catch (error) {

                    /* Continue */

                }


                /* Old browser */

                const textarea =
                    document.createElement(
                        "textarea"
                    );


                textarea.value =
                    shareURL;


                textarea.style.position =
                    "fixed";


                textarea.style.left =
                    "-9999px";


                document.body.appendChild(
                    textarea
                );


                textarea.select();


                document.execCommand(
                    "copy"
                );


                document.body.removeChild(
                    textarea
                );


                alert(
                    "Share link copied to clipboard."
                );

            }
        );



        /* =================================================
           INITIALIZE
        ================================================= */

        updatePeriodUI();

        updateCustomPF();


    }
);

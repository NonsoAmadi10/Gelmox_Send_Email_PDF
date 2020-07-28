import express from "express";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import cors from "cors";
import pdfConverter from "html-pdf";
import sendMail from "./utils/sendEmail"
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({
    "message": "Hello there! Send an Order to gelmox logistics! Contact Nonso Amadi for guide"
  })
})

app.post("/api/send-pdf", async (req, res) => {

  try {
    const { customer_name, billing_address, products, customer_email, phone_number } = req.body;
    const { who } = req.query;
    if (!who) {
      return res.status(403).send({
        error: "You are forbidden from doing this",
        success: false
      })
    }

    const invoiceHtml = `
    <html lang="en">

<div style="width: 100%; 
    font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: white;
    padding: 0px;
">
    <div style="background: #000; color: #fff; text-align: center; padding: 10px; font-size: larger;">
        Payment Invoice
    </div>

    <div id="page-header" style="padding: 20px;">
        <div style="float: left">
            <p> ${customer_name}</p>
            <p> ${billing_address}</p>
            <p> Phone Number: ${phone_number} </p>
            <p> Email: ${customer_email} </p>
        </div>

        <img class="logo" src="https://shrotonu.sirv.com/Images/logo.png" width="200px" style="float: right;">

    </div>
</div>



<div style="padding: 30px; margin-top: 3rem!important;">
    <table border="1" width=100 height="200" style="margin: auto;
    font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 90%;
    ">
        <thead style="text-align: center; border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;">
            <th colspan="4">Order ID: ${Math.random().toString(36).substr(2, 8)}</th>
        </thead>
        <thead style="border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;">
            <tr>
                <th syle=" border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;">Items </th>
                <th style="border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;">Quantity (pcs) </th>

                <th colspan="2" style="border: 1px solid #dddddd;
                text-align: center;
                padding: 8px;">Price (NGN) </th>
            </tr>
        </thead>
        <tbody>

        ${products.map((product) =>

      ` <tr>
        <td style="border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;">${product.name}</td>
        <td style="border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;">${product.qty}</td>
        <td colspan="2" style="border: 1px solid #dddddd;
                text-align: center;
                padding: 8px;">${product.price} </td>

      </tr>
          `

    )}
            
        </tbody>
        <tfoot>
            <tr>
                <td colspan="" style="border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;"> <strong>Total: </strong> </td>

                <td colspan="" style="border: 1px solid #dddddd;
text-align: left;
padding: 8px;"> <strong> ${products.reduce((a, b) => a.qty + b.qty)}pcs </strong> </td>

                <td colspan="2" style="border: 1px solid #dddddd;
                text-align: center;
                padding: 8px;"> <strong>NGN ${products.reduce((a, b) => a.price + b.price)} </strong> </td>
            </tr>
            <tr>
                <td colspan="3" style="border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;"> <strong>Paid </strong> </td>
                <td style="border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;"> <strong style="color: green;"> Yes </strong> </td>
            </tr>
            <tr style="border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;">

                <td colspan="3" style="border: 1px solid #dddddd;
            text-align: left;
            font-weight: bolder;
            padding: 8px;"> Shipping Address :</td>
                <td style="border: 1px solid #dddddd;
             text-align: left;
             padding: 8px;"> ${billing_address} </td>
            </tr>
        </tfoot>

    </table>
</div>


</div>

<div style="text-align: center; padding: 30px; margin: 3rem 0;">
    <h2> Thank You For Your Patronage! </h2>
    <p style="color:rgb(241, 6, 6);"> Have you heard about our referral program? Go on to our website
        https://gelmoxgroup.com to find out about more
    </p>
</div>

</html>
    
    
    `
    //const pathToHtml = path.join(__dirname, "test.html");
    const newPdf = path.join(__dirname, `newOrder.pdf`);

    fs.openSync(newPdf, 'w')

    var options = { format: "Letter" };

    const customer_mail = `
    <html> 
    
    <div
    font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: white;
    padding: 0px;
    text-align: center;
    padding: 30px;
    >
    <img class="logo" src="https://shrotonu.sirv.com/Images/logo.png" width="200px" style="float: right;">
    <h3> Thank You For Shopping with us today </h3>
    <p> Your Gelmox Order has been received and is being packaged. Attached to this mail is your payment invoice. </p>
    <p> Please Do not reply to this mail as this is an auto-generated mail </p>

    <h3> Cheers!! </h3>
    
    </div>
    
    <html>
    `


    pdfConverter.create(invoiceHtml, options).toFile(newPdf, async (err, success) => {

      const pathtoNewPdf = fs.readFileSync(success.filename).toString("base64");

      sendMail.sendOrderEmail('<h2>Dear Dispatch, there is a new order to be shipped </h2>', pathtoNewPdf);
      sendMail.sendOrderEmail(customer_mail, pathtoNewPdf, customer_email)
      fs.unlinkSync(newPdf);

    });

    return res.status(200).send({
      success: true,
      message: "Invoice Sent!"
    })

  } catch (err) {
    if (err) {
      console.log(err)
      res.status(400).send({
        message: "error sending invoice",
        "success": false
      })
    }
  }
})

app.listen(
  process.env.PORT,
  () => console.log(`Server is Running on ${process.env.PORT}`),
);

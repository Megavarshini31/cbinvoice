const mongoose = require('mongoose')
const express = require("express")
const app = express()

// Body parser.
app.use(express.json())

const dbURL = "mongodb+srv://megagk:megagk@cluster0.lieila3.mongodb.net/codebuilders"

// Mongo database connection
mongoose.connect(dbURL).then(() => {console.log("Connected")}).catch(() => {console.log("Something wrong")});

// Database Schema
const invoiceSchema = mongoose.Schema({

    // Payment detail
    paymentStatus: {type: String},
    invoiceNumber: {type: String},
    date: {type: Date},
    nextDueDate: {type: Date},
    createdBy: {type: String},
    billingAddress: {type: String},

    // Description
    description: {type: String},
    rate: {type: Number},
    qty: {type: Number},
    total: {type: Number},

    // Notes
    notes: {type: String},
})

// Database Collection/Model
const InvoiceModel = mongoose.model("invoices",invoiceSchema);

// Create a invoice
app.post("/invoice/add", (req,res) => {

    // Destructive Method.
    const {paymentStatus, invoiceNumber, date, nextDueDate, createdBy, billingAddress, description, rate, qty, notes } = req.body;

    const newInvoice = new InvoiceModel({
        paymentStatus: paymentStatus,
        invoiceNumber: invoiceNumber,
        date: date,
        nextDueDate: nextDueDate,
        createdBy: createdBy,
        billingAddress: billingAddress,
        description: description,
        rate: rate,
        qty: qty,
        total: rate*qty,
        notes: notes,
    })

    newInvoice.save()
    .then(() => {
        return res.json({status:"Create a new invoice"})
    })
    .catch(() => {
        return res.json({status:"Something wrong"})
    })

})

// Get a particular invoice
app.get("/invoice/:invoiceID", async (req,res) => {
    const invoiceID = req.params.invoiceID;

    const existInvoice = await InvoiceModel.findOne({_id:invoiceID});
    if(existInvoice) {
        return res.json({invoice:existInvoice})
    }
    else {
        return res.json({invoice:"Not found."})
    }
})

// Get all invoice
app.get("/invoice", async (req,res) => {
    const invoices = await InvoiceModel.find();
    if(invoices) {
        return res.json({invoices:invoices})
    }
    else {
        return res.json({invoices:"No invoices."})
    }
})

// Server
app.listen(8080, () => {
    console.log("Server started");
})
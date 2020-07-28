# Gelmox_Send_Email_PDF
A simple API service for gelmox group that sends order invoices in pdf format to the customer and Logistics department


## Documentation

### Prerequisites

- The URL is hosted on heroku on [https://gelmox-invoice.herokuapp.com/?who=gelmox](https://gelmox-invoice.herokuapp.com/?who=gelmox)

##### Parameters

- Query --- The Query object takes a `who` property which must be equal to gelmox or gelmox1

- Body - The Request Body is of JSON content type and it takes the following parameters 
```
{
    "customer_name": String,
    "billing_address": String,
	"customer_email": String,
	"phone_number": Number,
	"products": Array of Objects
 }
 ```
 ---

- ###### Demo Request Body

    - Pass the following demo Request Body to see the API in action 
```
{    
    "customer_name": "nonso",
	"billing_address": "37, Onasanya, street, surulere",
	"customer_email": "nonnypyg@gmail.com",
	"phone_number": 80789009,
	"products": [
		{
			"name": "Jollof  Mix",
			"qty": 35,
			"price": 4000
		},
		{
			"name": "Soup Thickener",
			"qty": 40,
			"price": 500
		}
	]
}
```
 --- 

#### Response Object 

- On Success
```
{
    "success": true,
    "message": "Order Received"
}
```
--- 

- On Error

```
{
        message: "error sending invoice",
        "success": false
}

```


#### Important notes

- The Quantity Total is calculated by the API

- The Total Price is calculated automaticalling and added to the pdf

- The Mail takes 8 minutes Max to reach the customer's mail box

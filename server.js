const express = require('express');
const connectDb = require("./config/db");
const { usersFunction, visitorFunction} = require("./routes/index");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(express.json());

const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'Visitor Management System',
			version: '1.0.0',
			description: "A REST API built with Express and MongoDB.",
		},
		components: {
			securitySchemes: {
				jwtToken: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		// security: [
		// {
		// 	jwtToken: [],
		// },
		// ],
	},
		apis: ["./routes/users.js", "./routes/visitor.js"],
};
  

app.use('/users', usersFunction)
app.use('/visitor', visitorFunction)

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



async function run(){
	try {
		await connectDb();
		app.use(express.json());
		app.listen(process.env.PORT || 5000, () => console.log('ITS ALIVE!!'));
	}catch(err){
		console.log(err);
	}
};

run();
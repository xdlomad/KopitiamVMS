const express = require('express');
const connectDb = require("./config/db");
const { usersFunction } = require("./routes/index");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
connectDb();

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
		apis: ["./routes/users.js"],
};
  

app.use('/users', usersFunction)

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));




app.listen(process.env.PORT || 5000, () => console.log('ITS ALIVE!!'));
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import apiRoutes from './routes/index.mjs';
import { StatusCodes } from 'http-status-codes';

const app = express();
const port = process.env.PORT || 4500;

// Getting data in json format
app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// Setting up cors
const corsOpts = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOpts));
// Using Helmet for security
app.use(helmet());
// Using Morgan for logging
app.use(logger('common'));
// Using imported Routes
app.use('/api/v1/', apiRoutes);


// To check if server is running
app.get('/', (req, res) => res.sendStatus(StatusCodes.OK));

// Listening on port 4500 or Port set in environment
app.listen(port, () => console.info(`Server is running on port ${port}`));

// https://medium.com/geekculture/how-to-make-a-scalable-otp-service-3df8300941ba

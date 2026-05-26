import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import {userRouter} from "./routes/Users.route"
import { appointmentRouter } from "./routes/Appointments.route";
import { serviceRouter } from "./routes/Services.route";

import { AppDataSource } from './app-data-source'

const app = express();

app.use(cors())
app.use(userRouter)
app.use(appointmentRouter)
app.use(serviceRouter)

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source iniciado!')

    app.listen(process.env.PORT || 3000, () => {
      console.log('Aplicação rodando na porta 3000')
    })
  })
  .catch((error: any) => {
    console.error('Error durante a inicialização', error)
  })

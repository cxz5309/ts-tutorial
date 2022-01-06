import * as express from 'express';
import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import {User} from "./entity/User";
import {Task} from "./entity/Task";
import * as morgan from 'morgan';

const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

const port: number = 3000;

createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "digh1223",
  database: "typeormtest",
  entities: [
      __dirname + "/entity/*.ts"
  ],
  synchronize: true,
}).catch(error => console.log(error));

app.get('/', (request:express.Request, response:express.Response)=>{
  response.send('hello');
})


app.get('/createUser', async (request:express.Request, response:express.Response)=>{
    let user = new User();
    user = {...request.body};
    const userRepository = getRepository(User);
  
    await userRepository.save(user);
    response.send(user);
})

app.get('/getUser', async (request:express.Request, response:express.Response)=>{
  try{
    let user = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tasks', 'task')
      .where('task.id = 1')
      .getMany();
    response.send(user);
  }
  catch(err){
    response.send(err);
  }
})

app.get('/createTask', async (request:express.Request, response:express.Response)=>{
  let task = new Task();
  task = {...request.body};
  let nowDate = new Date();
  let addDate = new Date();
  addDate.setDate(nowDate.getDate() + 3);
  task.start = nowDate;
  task.end = addDate;

  const taskRepository = getRepository(Task);

  await taskRepository.save(task);
  response.send(task);
});


app.listen(port, ()=>{console.log(port)})

const express = require('express')
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser')
const routes = require('./routes')
const cors = require('cors')


dotenv.config()

const app = express();
const port = process.env.PORT || 3001

app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

routes(app);

mongoose.connect(`${process.env.MONGO_DB}`).then(
    ()=>{
        console.log("connect db success");
    }
).catch(
    (err)=>{
        console.log(err);
    }
)


app.get('/', (req, res) => {
    res.send('hello toan den tu hai duong')
})

app.listen(port, ()=>{
    console.log(`server starting with port ${port}`)
})
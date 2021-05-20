const mongoose = require('mongoose');

const user = 'new-user-0';
const pass = 'FlJAtzTKQ5yUVHe6';
const dbname = 'Test1';
const uri = `mongodb+srv://${user}:${pass}@cluster0.zezwk.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(uri,
     {useCreateIndex: true, 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify:false
    }
     )
     .then(() => console.log('Base de datos conectada'))
     .catch(e => console.error(e));
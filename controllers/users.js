const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
//Now we import S3 Constructor function 
// import S3 from 'aws-sdk/clients/s3'
// UUID is used to generate unique IDs
const {v4: uuidv4} = require('uuid');
const S3 = require('aws-sdk/clients/s3')

const s3 = new S3();

const BUCKET_NAME = process.env.BUCKET_NAME;



module.exports = {
  signup,
  login
};

async function signup(req, res) {
  // const user = new User(req.body);
  console.log(req.body, "REQ.BODY and Content of the Form");
  console.log(req.file, "<--- REQ.FILE")
  
  if(!req.file) return res.status(400).json({error:"Please submit a Photo"})
  
  //This is where we will store our image on aws S3 bucket
  
  const filePath = `pupstagram-ga/${uuidv4()}-${req.file.originalname}`
  //req.file.buffer is from our from to the server
  const params = {Bucket: BUCKET_NAME, Key: filePath, Body: req.file.buffer} 
  // s3.upload is now making the request to AWS S3
  s3.upload(params, async function(err,data){
    if(err){
      console.log('===================');
      console.log(err,'<- error from aws. Check what it says');
      console.log('====================');
      res.status(400).json({error: 'error from aws, check your terminal'})
    }
    //Works
    
    req.body.photoUrl = data.Location
    // data.Location is what we get back from aws of where Our file is stored
    const user = new User(req.body);
    console.log(user, " <--USER")
    try {
      await user.save();
      const token = createJWT(user);
      res.json({token});
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
      
    }
    // const user = new User({...req.body, photoUrl: data.Location}); 
  })
}
  


async function login(req, res) {
 
  try {
    // finding the user by there email
  
    const user = await User.findOne({email: req.body.email});
    console.log(user, " <-- USER Logging in ")
   
    if (!user) return res.status(401).json({err: 'bad credentials'});
    // check the users password
    user.comparePassword(req.body.password, (err, isMatch) => {
      
      if (isMatch) {
        // if the password is good, create our jwt
        // and send it back to the client
        const token = createJWT(user);
        res.json({token});
      } else {
        return res.status(401).json({err: 'bad credentials'});
      }
    });
  } catch (err) {
    return res.status(401).json(err);
  }
}

/*----- Helper Functions -----*/

function createJWT(user) {
  return jwt.sign(
    {user}, // data payload
    SECRET,
    {expiresIn: '24h'}
  );
}

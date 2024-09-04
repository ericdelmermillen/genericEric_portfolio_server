
// needs to be async to query db
// const createUser = async () => {
const createUser = (req, res) => {
  const { email, password } = req.body;

  return res.json(`user created: email: ${email}, password: ${password}`);
};


// needs to be async to query db
// const loginUser = async (req, res) => {
const loginUser = (req, res) => {
  const { email, password } = req.body;

  return res.json(`user logged in: email: ${email}, password: ${password}`);
};


// generate refresh token: receives expored jwt and generates new refresh token
const refreshToken = (req, res, next) => {

  return res.json("Here's your goddamned refresh token")
};


// calls aws to get a temporary signed url for posting to s3 bucket/deleting from s3 bucket
const getSignedurl = (req, res, next) => {

  return res.json("Here's that god dammned signed url")
}

const logoutUser = async (req, res) => {
  const { email, password } = req.body;

  return res.json(`user logged out: email: ${email}, password: ${password}`);
}


export {
  createUser,
  loginUser,
  refreshToken,
  getSignedurl,
  logoutUser
};

// needs to be async to query db
// const createUser = async () => {
const createUser = (req, res) => {
  const { email, password } = req.body;

  res.json(`user created: email: ${email}, password: ${password}`);
};


// needs to be async to query db
// const loginUser = async (req, res) => {
const loginUser = (req, res) => {
  const { email, password } = req.body;

  res.json(`user logged in: email: ${email}, password: ${password}`);
};


const logoutUser = async (req, res) => {
  const { email, password } = req.body;

  res.json(`user logged out: email: ${email}, password: ${password}`);
}


export {
  createUser,
  loginUser,
  logoutUser
};
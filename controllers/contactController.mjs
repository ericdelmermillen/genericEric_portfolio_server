const sendContactForm = (req, res) => {
  console.log(req.body)
  return res.json("Contact form submitted");
};

export {
  sendContactForm
};
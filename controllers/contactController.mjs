const sendContactForm = (req, res) => {
  console.log("sendContactForm")
  return res.json("Contact form submitted");
};

export {
  sendContactForm
};
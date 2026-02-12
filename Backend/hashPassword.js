import bcrypt from "bcryptjs";

const run = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash("123456", salt);
  console.log(hashed);
};

run();

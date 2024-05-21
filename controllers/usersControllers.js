import { createUserSchema } from "../schemas/usersSchemas.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/users.js"
import HttpError from "../helpers/HttpError.js"

async function register(req, res, next) {
  const { name, email, password } = req.body;
  const user = {
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  };

  try {
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser !== null) {
      throw HttpError(409, "Email in use");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await User.create({ name, email, password: passwordHash });
    res.status(201, "Created").json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const user = {
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  };
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
     throw HttpError(401)
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      console.log("Password");
      return res.status(401).send({ message: "Email or password is incorrect" });
    }

    const token = jwt.sign(
       { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );
    await User.findByIdAndUpdate(user._id, { token });
    res.send({token});
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

async function current(req, res, next) {
     const token = req.headers.authorization?.split(" ")[1];
     if (token===null) {
       return next(HttpError(401, "Not authorized"));
     }
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       const user = await User.findById(decoded.id)
       if (!user) {
         return next(HttpError(401, "Not authorized"));
       }
       res.status(200).json(user);
     } catch (error) {
       next(error);
     }
}
async function update(req, res, next) {
  const { subscription } = req.body;
    if (!subscription.includes(subscription)) {
      return next(HttpError(400, "Invalid subscription value"));
  }
  try {
     const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { subscription },
      { new: true }
    );

    if (!updatedUser) {
      return next(HttpError(404, "User not found"));
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error)
  }
}

export default { register, login, logout, current, update};

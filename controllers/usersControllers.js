import { createUserSchema } from "../schemas/usersSchemas.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/users.js"
import HttpError from "../helpers/HttpError.js"

async function register(req, res, next) {
  const { email, password } = req.body;
  const user = {
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  };

  try {
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser !== null) {
      throw HttpError(409, "Email in use");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await User.create({ email, password: passwordHash });
        const response = {
      user: {
        email: result.email,
        subscription: result.subscription,
      }
    };
    res.status(201, "Created").json(response);
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
  const lowerCaseEmail = email.toLowerCase();
  try {
    const userInUse = await User.findOne({  email: lowerCaseEmail });
    if (userInUse === null) {
                return res
                  .status(401)
                  .send({ message: "Email or password is wrong" });
    }
    const isMatch = await bcrypt.compare(password, userInUse.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign(
       { id: userInUse._id },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );
    await User.findByIdAndUpdate(userInUse._id, { token });

     const response = {
       token,
       user: {
         email: userInUse.email,
         subscription: userInUse.subscription,
       },
     };
    res.json(response);
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
     if (!token) {
       throw HttpError(401, "Not authorized");
     }
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       const user = await User.findById(decoded.id)
       if (!user) {
         throw HttpError(401, "Not authorized");

       }
       const response = {
         email: user.email,
         subscription: user.subscription,
       }
       res.status(200).json(response);
     } catch (error) {
       next(error);
     }
}
async function update(req, res, next) {
  const { subscription } = req.body;
  if (!subscription.includes(subscription)) {
      throw HttpError(400, "Invalid subscription value");
  }
  try {
     const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { subscription },
      { new: true }
    );

    if (!updatedUser) {
      throw HttpError(404, "User not found");
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error)
  }
}

export default { register, login, logout, current, update};

import passport from "passport";
import { Strategy } from "passport-local";
import { UserModel } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

passport.use(
	new Strategy(
		{
			usernameField: "phone",
			passwordField: "password",
		},
		async (phone: string, password: string, done) => {
			try {
				const user = await UserModel.findOne({ phone });

				if (!user) {
					return done(null, false, { message: "User not found" });
				}

				const isPassMatch = await bcrypt.compare(
					password,
					user.password as string
				);

				if (!isPassMatch) {
					return done(null, false, { message: "Password is incorrect" });
				}

				return done(null, user);
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
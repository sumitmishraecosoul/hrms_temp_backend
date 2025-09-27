import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import All_Models from '../../Utils/All_Models.js';

dotenv.config();

const authController = {}

authController.Register_User = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await All_Models.User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. Please Login' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await All_Models.User.create({
            email,
            password: hashedPassword
        });

        const accessTokenHRMS = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: '7d',

            });

        const refreshTokenHRMS = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: '30d',
            });

        res.cookie(
            "accessTokenHRMS",
            accessTokenHRMS,
            {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            }
        );
        res.cookie(
            "refreshTokenHRMS",
            refreshTokenHRMS,
            {
                httpOnly: true,
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }
        );

        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            accessTokenHRMS,
            refreshTokenHRMS
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

authController.Login_User = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await All_Models.User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessTokenHRMS = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: '7d',
            }
        )

        const refreshTokenHRMS = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: '30d',
            }
        )

        res.cookie(
            "accessTokenHRMS",
            accessTokenHRMS,
            {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            }
        );
        res.cookie(
            "refreshTokenHRMS",
            refreshTokenHRMS,
            {
                httpOnly: true,
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }
        );

        res.status(200).json({
            message: "User logged in successfully",
            user: user,
            accessTokenHRMS,
            refreshTokenHRMS
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

authController.Logout_User = async (req, res) => {
    try {
        res.clearCookie("accessTokenHRMS");
        res.clearCookie("refreshTokenHRMS");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default authController;
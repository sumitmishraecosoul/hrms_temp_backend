import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const tokenVerify = (req,res,next) => {
    const accessToken = req.cookies?.accessTokenHRMS;
    

    if(!accessToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
            if(err) {
                if(err.name != 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Invalid Access Token' });
                }
            req.clearCookie('accessTokenHRMS');

            if(req.cookies?.refreshTokenHRMS) {
                const refreshToken = req.cookies.refreshTokenHRMS;
                jwt.verify(
                    refreshToken,
                    process.env.JWT_REFRESH_SECRET,
                    (err, decoded) => {
                        if(err){
                            res.clearCookie('refreshTokenHRMS');
                            return res.status(401).json({ error: 'Invalid Refresh Token' });
                        }

                        const accessToken = jwt.sign(
                            { id: decoded.id, email: decoded.email },
                            process.env.JWT_ACCESS_SECRET,
                            { expiresIn: '7d' }
                        );

                        res.cookie('accessTokenHRMS', accessToken, {
                            httpOnly: true,
                            secure: true,
                            maxAge: 24 * 60 * 60 * 1000,
                        });
                        next();
                    }
                );
            }
            else {
                return res.status(401).json({ error: 'Invalid Refresh Token' });
            }
        }
        else{
            req.user = decoded;
            req.userId = decoded.id;

            next();
        }
    });
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default tokenVerify;

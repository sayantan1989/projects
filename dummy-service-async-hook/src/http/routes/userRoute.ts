import { Router as router, Request, Response, NextFunction, Router } from 'express';
import { Session } from '../../Session';
import { UserController } from '../controller/userController';

export class User {

    public getUserRouter(): Router {

        const UserRouter = router();

        UserRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {

                const testheader = req.headers.testheader;
                Session.setSession(testheader);
                console.log(testheader);
                const userController = new UserController();

                // pass variables
                if ( req.baseUrl === '/user-service/case1' ){
                    const result = await userController.case1(testheader);
                    res.status(200).json({ value : result });
                }

                // use static variables
                if ( req.baseUrl === '/user-service/case2' ){
                    const result = await userController.case2();
                    res.status(200).json({ value : result });
                }

                // use async hooks
                if ( req.baseUrl === '/user-service/case3' ){
                    const result = await userController.case3();
                    res.status(200).json({ value : result });
                }

            } catch (err) {
                next(err);
            }
        });

        UserRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
            next();
        });

        UserRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
            next();
        });

        UserRouter.patch('/', async (req: Request, res: Response, next: NextFunction) => {
            next();
        });

        UserRouter.delete('/', async (req: Request, res: Response, next: NextFunction) => {
            next();
        });
        return UserRouter;
    }
}